import os
import glob
import re
import time
from typing import List, Dict, Any, Tuple
import numpy as np
from rank_bm25 import BM25Okapi
from sentence_transformers import SentenceTransformer
from groq import Groq
from dotenv import load_dotenv

# Load .env from backend directory and root directory
load_dotenv(os.path.join(os.path.dirname(__file__), ".env"))
load_dotenv(os.path.join(os.path.dirname(__file__), "..", ".env"))

# Default model
EMBEDDING_MODEL_NAME = "all-MiniLM-L6-v2"
GROQ_MODEL = "llama-3.3-70b-versatile"

def resolve_source_url(doc_name: str, scheme: str) -> str:
    combined = f"{doc_name} {scheme}".lower()
    if "kusum" in combined or "solar" in combined:
        return "https://pmkusum.mnre.gov.in/"
    if "pmfby" in combined or "fasal bima" in combined or "crop insurance" in combined:
        return "https://pmfby.gov.in/"
    if "pm_kisan" in combined or "pm-kisan" in combined or "kisan samman" in combined:
        return "https://pmkisan.gov.in/"
    if "drone" in combined or "smam" in combined or "mechanization" in combined:
        return "https://agrimachinery.nic.in/"
    if "soil" in combined:
        return "https://soilhealth.dac.gov.in/"
    if "natural" in combined or "nmnf" in combined:
        return "https://naturalfarming.dac.gov.in/"
    return "https://agricoop.nic.in/"

class AgriChunk:
    def __init__(self, chunk_id: str, doc_name: str, scheme: str, section: str, content: str):
        self.chunk_id = chunk_id
        self.doc_name = doc_name
        self.scheme = scheme
        self.section = section
        self.content = content.strip()

    def to_dict(self) -> Dict[str, Any]:
        return {
            "chunk_id": self.chunk_id,
            "doc_name": self.doc_name,
            "scheme": self.scheme,
            "section": self.section,
            "content": self.content,
            "source_url": resolve_source_url(self.doc_name, self.scheme)
        }

class AgriRAGEngine:
    def __init__(self, data_dir: str):
        self.data_dir = data_dir
        self.chunks: List[AgriChunk] = []
        self.bm25: BM25Okapi = None
        self.tokenized_corpus: List[List[str]] = []
        self.embeddings: np.ndarray = None
        
        print("Initializing SentenceTransformer embedding model...")
        try:
            self.embed_model = SentenceTransformer(EMBEDDING_MODEL_NAME, local_files_only=True)
        except Exception:
            self.embed_model = SentenceTransformer(EMBEDDING_MODEL_NAME)
        
        # Load and index documents
        self.load_documents()
        self.build_indices()
        
    def _tokenize(self, text: str) -> List[str]:
        # Clean and tokenize for BM25
        text = text.lower()
        tokens = re.findall(r'\b[a-z0-9\-]+\b', text)
        return tokens

    def load_documents(self):
        doc_files = glob.glob(os.path.join(self.data_dir, "*.md"))
        print(f"Found {len(doc_files)} policy documents in {self.data_dir}")
        
        self.chunks = []
        chunk_counter = 0

        for file_path in doc_files:
            file_name = os.path.basename(file_path)
            with open(file_path, "r", encoding="utf-8") as f:
                raw_text = f.read()

            # Extract scheme name from first header
            scheme_match = re.search(r'^#\s+(.+)$', raw_text, re.MULTILINE)
            scheme_title = scheme_match.group(1).strip() if scheme_match else file_name.replace(".md", "").replace("_", " ")

            # Split by markdown section headers (### or ##)
            sections = re.split(r'(?=\n###?\s+)', raw_text)
            
            for sec in sections:
                sec = sec.strip()
                if not sec:
                    continue
                
                # Extract section title
                sec_header_match = re.match(r'^###?\s+(.+)$', sec, re.MULTILINE)
                section_title = sec_header_match.group(1).strip() if sec_header_match else "General Overview"
                
                # If section is very long, split by double newline
                paragraphs = [p.strip() for p in sec.split("\n\n") if len(p.strip()) > 30]
                
                if len(paragraphs) <= 1:
                    chunk_counter += 1
                    self.chunks.append(AgriChunk(
                        chunk_id=f"chk_{chunk_counter:03d}",
                        doc_name=file_name,
                        scheme=scheme_title,
                        section=section_title,
                        content=sec
                    ))
                else:
                    # Combine smaller paragraphs into cohesive chunks of ~300-500 words
                    current_chunk = []
                    current_len = 0
                    for p in paragraphs:
                        current_chunk.append(p)
                        current_len += len(p.split())
                        if current_len >= 180:
                            chunk_counter += 1
                            chunk_text = f"[{scheme_title} - {section_title}]\n" + "\n\n".join(current_chunk)
                            self.chunks.append(AgriChunk(
                                chunk_id=f"chk_{chunk_counter:03d}",
                                doc_name=file_name,
                                scheme=scheme_title,
                                section=section_title,
                                content=chunk_text
                            ))
                            current_chunk = []
                            current_len = 0
                    
                    if current_chunk:
                        chunk_counter += 1
                        chunk_text = f"[{scheme_title} - {section_title}]\n" + "\n\n".join(current_chunk)
                        self.chunks.append(AgriChunk(
                            chunk_id=f"chk_{chunk_counter:03d}",
                            doc_name=file_name,
                            scheme=scheme_title,
                            section=section_title,
                            content=chunk_text
                        ))

        print(f"Total chunks indexed: {len(self.chunks)}")

    def validate_agricultural_domain(self, text: str) -> Tuple[bool, str, float]:
        """Validates whether an uploaded document is legitimately related to the agricultural domain."""
        if len(text.strip()) < 80:
            return False, "Document content is too short (minimum 80 characters required).", 0.0

        # 1. Agricultural Lexicon Density Check
        agri_keywords = [
            "agriculture", "agricultural", "farmer", "farmers", "farming", "crop", "crops",
            "soil", "irrigation", "subsidy", "subsidies", "fertilizer", "fertilizers",
            "pesticide", "harvest", "seed", "seeds", "kisan", "cultivation", "monsoon",
            "horticulture", "agronomy", "fpo", "tractors", "livestock", "yield", "acre",
            "hectare", "mandis", "apmc", "icar", "pmfby", "kusum", "dap", "urea", "kharif", "rabi"
        ]
        
        lower_text = text.lower()
        matched_keywords = set()
        for kw in agri_keywords:
            if re.search(r'\b' + re.escape(kw) + r'\b', lower_text):
                matched_keywords.add(kw)

        # 2. Semantic Similarity against Agricultural Centroid
        anchor_concept = (
            "Indian agriculture, agricultural schemes, farming subsidies, crop insurance, "
            "soil fertility testing, irrigation systems, farmer welfare, and agricultural mechanization."
        )
        doc_sample = text[:1500]
        embeddings = self.embed_model.encode([doc_sample, anchor_concept], convert_to_numpy=True, normalize_embeddings=True)
        cosine_sim = float(np.dot(embeddings[0], embeddings[1]))

        # Rejection rule: Must have agricultural keyword relevance AND semantic alignment
        if len(matched_keywords) < 2 and cosine_sim < 0.25:
            return (
                False,
                f"Rejected: Out-of-Domain Document. Detected only {len(matched_keywords)} agricultural terms and low semantic relevance ({round(cosine_sim, 2)}). AgriShield strictly enforces domain integrity to prevent knowledge base pollution.",
                cosine_sim
            )

        return (
            True,
            f"Approved: Verified agricultural domain relevance (Semantic alignment: {round(cosine_sim, 2)}, Keywords matched: {len(matched_keywords)}).",
            cosine_sim
        )

    def add_document(self, title: str, content: str) -> Dict[str, Any]:
        """Dynamically validates, stores, chunks, and indexes a new document into the RAG knowledge base."""
        # Validate domain
        is_valid, message, score = self.validate_agricultural_domain(content)
        if not is_valid:
            return {
                "success": False,
                "reason": message,
                "score": score
            }

        # Clean title for filename
        clean_title = re.sub(r'[^a-zA-Z0-9_\- ]', '', title).strip().replace(' ', '_')
        if not clean_title:
            clean_title = f"Custom_Agri_Doc_{int(time.time())}"
        filename = f"{clean_title}.md"
        file_path = os.path.join(self.data_dir, filename)

        # Ensure header in content
        if not content.strip().startswith('#'):
            formatted_content = f"# {title}\n\n{content}"
        else:
            formatted_content = content

        with open(file_path, "w", encoding="utf-8") as f:
            f.write(formatted_content)

        # Reload all documents and rebuild indices
        self.load_documents()
        self.build_indices()

        return {
            "success": True,
            "filename": filename,
            "message": message,
            "total_chunks": len(self.chunks),
            "total_documents": len(set(c.doc_name for c in self.chunks))
        }

    def build_indices(self):
        # 1. BM25 Indexing
        self.tokenized_corpus = [self._tokenize(c.content) for c in self.chunks]
        self.bm25 = BM25Okapi(self.tokenized_corpus)
        
        # 2. Dense Vector Embeddings
        print("Computing embeddings for dense vector index...")
        chunk_texts = [f"{c.scheme} {c.section}: {c.content}" for c in self.chunks]
        embeddings = self.embed_model.encode(chunk_texts, convert_to_numpy=True, normalize_embeddings=True)
        self.embeddings = embeddings
        print("Index construction complete.")

    def rewrite_query(self, query: str) -> str:
        """Query expansion for common agricultural scheme acronyms."""
        q = query
        expansions = {
            r"\bkusum\b": "PM-KUSUM solar agriculture pump subsidy",
            r"\bpmfby\b": "PMFBY Pradhan Mantri Fasal Bima Yojana crop insurance loss",
            r"\bpm kisan\b": "PM-KISAN Samman Nidhi 6000 income installment",
            r"\bsmam\b": "SMAM Sub-Mission Agricultural Mechanization tractor custom hiring",
            r"\bshc\b": "Soil Health Card soil testing parameters micronutrients",
            r"\bdrone\b": "Kisan drone financial assistance grant FPO"
        }
        for pat, repl in expansions.items():
            if re.search(pat, q, re.IGNORECASE):
                q = f"{q} {repl}"
        return q

    def retrieve(self, query: str, top_k: int = 4) -> List[Dict[str, Any]]:
        expanded_query = self.rewrite_query(query)
        
        # 1. BM25 Scores
        query_tokens = self._tokenize(expanded_query)
        bm25_scores = self.bm25.get_scores(query_tokens)
        bm25_ranked_indices = np.argsort(bm25_scores)[::-1]
        
        # 2. Dense Vector Semantic Similarity
        query_vec = self.embed_model.encode([query], convert_to_numpy=True, normalize_embeddings=True)[0]
        cosine_scores = np.dot(self.embeddings, query_vec)
        vector_ranked_indices = np.argsort(cosine_scores)[::-1]
        
        # 3. Reciprocal Rank Fusion (RRF)
        # score = (w_bm25 / (k + rank_bm25)) + (w_vec / (k + rank_vec))
        k = 60
        rrf_scores: Dict[int, float] = {}
        
        for rank, idx in enumerate(bm25_ranked_indices[:20]):
            rrf_scores[idx] = rrf_scores.get(idx, 0.0) + (1.0 / (k + rank + 1)) * 0.45
            
        for rank, idx in enumerate(vector_ranked_indices[:20]):
            rrf_scores[idx] = rrf_scores.get(idx, 0.0) + (1.0 / (k + rank + 1)) * 0.55
            
        sorted_indices = sorted(rrf_scores.keys(), key=lambda i: rrf_scores[i], reverse=True)
        top_indices = sorted_indices[:top_k]
        
        results = []
        for idx in top_indices:
            chunk = self.chunks[idx]
            vec_score = float(cosine_scores[idx])
            bm_score = float(bm25_scores[idx])
            results.append({
                "chunk": chunk.to_dict(),
                "vector_score": round(vec_score, 4),
                "bm25_score": round(bm_score, 4),
                "rrf_score": round(rrf_scores[idx], 4)
            })
            
        return results

    def query(self, user_query: str, groq_api_key: str = None) -> Dict[str, Any]:
        start_time = time.time()
        
        # Retrieve top 3 chunks (showing up to 3 top sources)
        retrieved = self.retrieve(user_query, top_k=3)
        retrieval_latency = time.time() - start_time
        
        # Check relevance threshold (Anti-hallucination safeguard)
        max_vec_score = max([r["vector_score"] for r in retrieved]) if retrieved else 0.0
        max_bm25_score = max([r["bm25_score"] for r in retrieved]) if retrieved else 0.0
        
        # If both semantic and lexical scores are very poor, flag immediately
        is_relevant = (max_vec_score >= 0.28) or (max_bm25_score > 2.0)
        
        # Build prompt context
        context_blocks = []
        for i, item in enumerate(retrieved):
            c = item["chunk"]
            context_blocks.append(
                f"[Source {i+1}: {c['scheme']} | Section: {c['section']}]\n{c['content']}"
            )
        full_context = "\n\n---\n\n".join(context_blocks)
        
        api_key = groq_api_key or os.getenv("GROQ_API_KEY")
        
        system_prompt = (
            "You are AgriShield, a warm, polite, and authoritative AI Agricultural Advisor guiding farmers, officers, and citizens on Indian government schemes.\n"
            "Your job is to answer the user's question naturally and conversationally while using EXCLUSIVELY the provided official government document excerpts.\n\n"
            "TONE AND FORMATTING REQUIREMENTS (VERY IMPORTANT):\n"
            "- Speak naturally, politely, and clearly, as if you are speaking directly to a farmer or agricultural field officer.\n"
            "- AVOID RAW MARKDOWN SYMBOLS: Do NOT use markdown heading hashes (#, ##, ###) or asterisks (**text** or *text*). Write in clean, beautiful, natural prose.\n"
            "- For separate points, use simple clean dashes (- ) or numbered steps (1., 2.), never asterisks.\n"
            "- Mention scheme names and sections smoothly in your sentences, such as: 'According to the PM-KUSUM guidelines...' or cite at the end.\n\n"
            "MANDATORY FACTUAL GROUNDING RULES:\n"
            "1. Answer strictly based on the context excerpts provided. Never extrapolate, fabricate, or assume percentages, financial amounts, or deadlines.\n"
            "2. If the user asks something that is NOT addressed in the excerpts, or if the provided excerpts do not have sufficient information, YOU MUST STATE: "
            "'I cannot find this information in the official agricultural documents provided.' Do NOT try to give outside general advice.\n"
            "3. State exact numbers, percentages, and deadlines truthfully from the excerpts.\n"
        )
        
        user_prompt = f"Official Document Context Excerpts:\n{full_context}\n\nUser Question:\n{user_query}\n\nAnswer in natural, conversational, plain language without markdown symbols (* or #):"
        
        gen_start = time.time()
        
        if not api_key:
            # Fallback if no API key is provided yet
            answer = (
                "Groq API Key Not Configured. Please provide your free GROQ_API_KEY in the backend .env file.\n\n"
                f"Retrieved Context Preview ({len(retrieved)} matching official excerpts found):\n"
                + "\n\n".join([f"- {r['chunk']['scheme']} ({r['chunk']['section']}): {r['chunk']['content'][:180]}..." for r in retrieved])
            )
            grounded = is_relevant
        else:
            client = Groq(api_key=api_key)
            candidate_models = ["openai/gpt-oss-120b", "qwen/qwen3.8-27b", "openai/gpt-oss-20b", GROQ_MODEL]
            completion = None
            last_err = None
            
            for mod in candidate_models:
                try:
                    completion = client.chat.completions.create(
                        model=mod,
                        messages=[
                            {"role": "system", "content": system_prompt},
                            {"role": "user", "content": user_prompt}
                        ],
                        temperature=0.1,  # Low temperature for strict factual adherence
                        max_tokens=800
                    )
                    break
                except Exception as e:
                    last_err = e
                    continue
                    
            if completion:
                raw_answer = completion.choices[0].message.content
                
                # Check if model gave refusal response
                refusal_phrases = [
                    "cannot find this information",
                    "not found in the provided",
                    "does not contain",
                    "not mentioned in the official",
                    "no information is provided",
                    "i do not have this information"
                ]
                has_refusal = any(p in raw_answer.lower() for p in refusal_phrases)
                grounded = not has_refusal and is_relevant
                
                # Post-process to remove any remaining markdown symbols like # or ** or *
                cleaned = re.sub(r'^[#]+\s*', '', raw_answer, flags=re.MULTILINE)
                cleaned = re.sub(r'\*\*(.*?)\*\*', r'\1', cleaned)
                cleaned = re.sub(r'(?<!\*)\*(?!\*)(.*?)(?<!\*)\*(?!\*)', r'\1', cleaned)
                cleaned = re.sub(r'^\s*[\*•]\s+', '- ', cleaned, flags=re.MULTILINE)
                cleaned = re.sub(r'`(.*?)`', r'\1', cleaned)
                cleaned = re.sub(r'\n{3,}', '\n\n', cleaned)
                answer = cleaned.strip()
            else:
                answer = f"Error communicating with Groq API: {str(last_err)}"
                grounded = False
                
        generation_latency = time.time() - gen_start
        total_latency = time.time() - start_time
        
        return {
            "query": user_query,
            "answer": answer,
            "grounded": grounded,
            "retrieval_latency_ms": round(retrieval_latency * 1000, 1),
            "generation_latency_ms": round(generation_latency * 1000, 1),
            "total_latency_ms": round(total_latency * 1000, 1),
            "retrieved_sources": retrieved[:3]
        }
