import os
from typing import Optional, List, Dict, Any
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from rag_engine import AgriRAGEngine

app = FastAPI(
    title="AgriShield RAG Backend",
    description="Grounded Agricultural Policy & Subsidy Navigator API",
    version="1.0.0"
)

# Enable CORS for local React development and production hosting
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize RAG Engine
DATA_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "data")
print(f"Loading documents from {DATA_DIR}...")
rag_engine = AgriRAGEngine(data_dir=DATA_DIR)

class QueryRequest(BaseModel):
    query: str
    api_key: Optional[str] = None

class QueryResponse(BaseModel):
    query: str
    answer: str
    grounded: bool
    retrieval_latency_ms: float
    generation_latency_ms: float
    total_latency_ms: float
    retrieved_sources: List[Dict[str, Any]]

# Predefined benchmark test sheet as required by hackathon criteria
BENCHMARK_TESTS = [
    {
        "id": "q1",
        "category": "Precise Numerical & Deadline Retrieval",
        "question": "What is the mandatory time window for a farmer to report crop loss under PMFBY after a hailstorm?",
        "expected_answer": "Within 72 hours of the occurrence of the calamity.",
        "expected_document": "PMFBY_Crop_Insurance_Guidelines.md",
        "key_phrase": "72 hours",
        "rubric_target": "Strict factual accuracy; zero tolerance for hallucination."
    },
    {
        "id": "q2",
        "category": "Subsidy Matrix & Contribution Calculation",
        "question": "What percentage of subsidy is provided for a standalone solar agricultural pump under PM-KUSUM Component-B in general states?",
        "expected_answer": "60% total subsidy (30% Central Financial Assistance CFA + 30% State Government subsidy), with farmer contributing maximum 40% (up to 30% through bank loan and 10% margin money).",
        "expected_document": "PM_KUSUM_Solar_Pump_Scheme.md",
        "key_phrase": "30% Central, 30% State, 40% Farmer",
        "rubric_target": "Multi-tier breakdown accurately retrieved without confusion."
    },
    {
        "id": "q3",
        "category": "Eligibility & Negative Exclusions",
        "question": "Are retired government employees eligible to receive PM-KISAN benefits?",
        "expected_answer": "Serving and retired government employees are generally excluded from PM-KISAN. Pensioners with monthly pension of Rs. 10,000 or more are excluded. However, Multi-Tasking Staff (MTS) / Class IV / Group D employees are NOT excluded and remain eligible.",
        "expected_document": "PM_KISAN_Operational_Guidelines.md",
        "key_phrase": "Excluded except Group D / MTS",
        "rubric_target": "Negative condition and exception correctly parsed."
    },
    {
        "id": "q4",
        "category": "Technical Specifications & Multi-Parameter Listing",
        "question": "How many and which parameters are tested on a Soil Health Card?",
        "expected_answer": "12 parameters: Primary macronutrients (N, P, K), Secondary (S), Micronutrients (Zn, Fe, Cu, Mn, B), and Physical parameters (pH, EC, Organic Carbon).",
        "expected_document": "Soil_Health_Card_and_Fertilizer_Policy.md",
        "key_phrase": "12 parameters (N, P, K, S, Zn, Fe, Cu, Mn, B, pH, EC, OC)",
        "rubric_target": "Complete enumeration without missing elements."
    },
    {
        "id": "q5",
        "category": "Anti-Hallucination & Out-of-Domain Refusal ('I Don't Know')",
        "question": "What is the government subsidy for buying an electric helicopter for farm tourism?",
        "expected_answer": "I cannot find this information in the official agricultural documents provided.",
        "expected_document": "None (Out of Domain)",
        "key_phrase": "Refusal / I don't know",
        "rubric_target": "Rubric criterion: 'Answers must come only from your data; unanswerable questions get I don't know'."
    }
]

FAILURE_CASES = [
    {
        "case_id": "fail_01",
        "title": "Lexical Acronym Ambiguity without BM25 Rewriting",
        "query_example": "subsidy for CHC and FMB",
        "failure_mode": "Pure dense vector embeddings sometimes confuse 'CHC' (Custom Hiring Centre) with Community Health Centres, yielding low relevance chunks.",
        "cause": "Polysemous acronyms in generic pre-trained embedding models without domain fine-tuning.",
        "mitigation_implemented": "Query expansion dictionary + BM25 keyword boosting ensures 'Custom Hiring Centre' and 'Sub-Mission on Agricultural Mechanization' are prioritized."
    },
    {
        "case_id": "fail_02",
        "title": "Multi-Hop Cross-Scheme Temporal Calculations",
        "query_example": "If I received PM-KISAN in December 2023, when can I apply for post-harvest claim if harvest is delayed?",
        "failure_mode": "Single-step RAG may struggle to synthesize independent clauses across two unrelated policy guidelines (PM-KISAN disbursal cycle vs PMFBY 14-day post-harvest condition).",
        "cause": "Independent documents chunked separately; question asks for compound hypothetical reasoning across separate ministries.",
        "mitigation_implemented": "Context assembly ranks and returns chunks from both PM-KISAN and PMFBY side-by-side with distinct source tags."
    }
]

@app.get("/api/health")
def health():
    return {
        "status": "healthy",
        "total_documents": len(set(c.doc_name for c in rag_engine.chunks)),
        "total_chunks": len(rag_engine.chunks),
        "embedding_model": "sentence-transformers/all-MiniLM-L6-v2",
        "groq_model": "llama-3.3-70b-versatile",
        "hybrid_retrieval": "BM25Okapi + Dense Cosine (RRF)"
    }

@app.post("/api/query", response_model=QueryResponse)
def query_rag(req: QueryRequest):
    if not req.query.strip():
        raise HTTPException(status_code=400, detail="Query cannot be empty")
    
    result = rag_engine.query(user_query=req.query, groq_api_key=req.api_key)
    return result

@app.get("/api/benchmark")
def get_benchmark():
    return {
        "benchmark_questions": BENCHMARK_TESTS,
        "failure_analyses": FAILURE_CASES
    }

@app.get("/api/documents")
def get_documents():
    docs_summary = {}
    for c in rag_engine.chunks:
        if c.doc_name not in docs_summary:
            docs_summary[c.doc_name] = {
                "title": c.scheme,
                "sections": set(),
                "chunks_count": 0
            }
        docs_summary[c.doc_name]["sections"].add(c.section)
        docs_summary[c.doc_name]["chunks_count"] += 1
        
    formatted = []
    for doc_name, meta in docs_summary.items():
        formatted.append({
            "doc_name": doc_name,
            "title": meta["title"],
            "sections": list(meta["sections"]),
            "chunks_count": meta["chunks_count"]
        })
    return {"documents": formatted}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
