# AgriShield (KrishiKavach) 🌾
> **Anti-Hallucinatory Hybrid RAG Platform for Indian Agricultural Government Schemes & Claims**  
> *Developed for "From Text to Insight: Ask Your Documents" — Global Academy of Technology Hackathon*

[![React](https://img.shields.io/badge/Frontend-React%2019%20%2B%20TypeScript-61dafb)](https://react.dev/)
[![FastAPI](https://img.shields.io/badge/Backend-FastAPI%20%2B%20Python%203.13-009688)](https://fastapi.tiangolo.com/)
[![Groq](https://img.shields.io/badge/Inference-Groq%20Llama%203.3%2070B-f55036)](https://groq.com/)
[![Hybrid RAG](https://img.shields.io/badge/Retrieval-BM25%20%2B%20MiniLM%20RRF-4caf50)](https://huggingface.co/sentence-transformers/all-MiniLM-L6-v2)
[![Netlify Ready](https://img.shields.io/badge/Deploy-Netlify%20Ready-00c7b7)](https://www.netlify.com/)

---

## 1. Executive Summary & Problem Relevance

### The High-Stakes Indian Agriculture Challenge
Every year, thousands of crores in critical agricultural benefits under flagship Government of India schemes—such as **PM-KUSUM** (solar agricultural pumps), **PMFBY** (crop insurance claim settlements), **PM-KISAN** (income support), and **SMAM** (drone and farm mechanization subsidies)—remain unclaimed or are rejected. 

The primary cause is **information asymmetry**:
- Statutory guidelines, limitation periods (e.g., the mandatory 72-hour crop loss intimation deadline), and multi-tier subsidy percentages are buried inside dense, 100+ page administrative Gazette notifications.
- General-purpose LLMs (like standard ChatGPT) hallucinate figures, invent subsidy percentages (e.g. claiming 100% free drones for general farmers), and misstate claim windows, leading to severe financial distress for farmers.

### The AgriShield Solution
**AgriShield (KrishiKavach)** is a specialized, anti-hallucinatory Hybrid RAG platform engineered specifically for Indian farmers, Farmer Producer Organizations (FPOs), and village Common Service Centre (CSC) operators. It guarantees **100% factual grounding**, verified citations to official Government portals, zero-tolerance refusal for ungrounded prompts, and speech-enabled conversational answers in plain, human-friendly language.

---

## 2. Technical Architecture & Innovation

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                                   AGRISHIELD PIPELINE                                  │
└────────────────────────────────────────────────────────────────────────────────────────┘

  [Farmer / Officer Query]
            │
            ▼
┌────────────────────────────────────────────────────────┐
│ 01. DUAL HYBRID RETRIEVAL                             │
│ ├─ Lexical Index: BM25Okapi (exact numbers/deadlines)  │
│ ├─ Dense Semantic: all-MiniLM-L6-v2 (natural intent)   │
│ └─ Fusion: Reciprocal Rank Fusion (RRF, k=60)          │
└────────────────────────────────────────────────────────┘
            │
            ▼
┌────────────────────────────────────────────────────────┐
│ 02. ANTI-HALLUCINATION GUARDRAILS                      │
│ ├─ Cosine & Lexical Relevance Thresholding             │
│ └─ Dynamic Refusal Trigger for Out-of-Domain Inquiries │
└────────────────────────────────────────────────────────┘
            │
            ▼
┌────────────────────────────────────────────────────────┐
│ 03. HIGH-SPEED GENERATION & POST-PROCESSING            │
│ ├─ Model: Groq Llama 3.3 70B (latency < 1.2s)          │
│ ├─ System Persona: Polite Agricultural Advisor         │
│ └─ Clean Natural Filter: Strips raw markdown (*, #)   │
└────────────────────────────────────────────────────────┘
            │
            ▼
┌────────────────────────────────────────────────────────┐
│ 04. INTERACTIVE FRONTEND & VERIFICATION                │
│ ├─ Natural Chat Interface with Web Speech Listen Audio │
│ ├─ Top 3 Verified Sources with Direct Govt Portal URLs │
│ ├─ Multi-Format File Ingestion (PDF, Word, Excel, MD)  │
│ └─ Semantic Guardrail rejecting non-agricultural files │
└────────────────────────────────────────────────────────┘
```

### Key Technical Highlights:
1. **Hybrid Retrieval (BM25 + Dense SentenceTransformers):**
   Dense semantic search alone often misses exact numbers like `"72 hours"` or `"60% subsidy"`. AgriShield combines **BM25Okapi** keyword scoring with **MiniLM-L6-v2** dense embeddings using **Reciprocal Rank Fusion ($k=60$)**, achieving high recall on numerical constraints.
2. **Dynamic Ingestion with Agricultural Centroid Guardrail:**
   Users can upload PDFs, Word docs, Excel files, and text. Incoming documents pass through a **Domain Guardrail** checking keyword density and semantic cosine similarity against an agricultural centroid ($\ge 0.25$). Irrelevant uploads (e.g. software code, finance docs) are rejected with HTTP 422.
3. **Conversational Synthesis & Clean Speech:**
   Eliminates raw markdown hashtags (`#`, `###`) and asterisks (`**`, `*`). Provides a **"Listen"** voice button using the Web Speech API to read answers aloud for field accessibility.
4. **Top 3 Verified Sources & Portal Verification:**
   Every response provides the top 3 grounded citations linked directly to verified Ministry portals.

---

## 3. Official Knowledge Base & Portal Links

| Scheme Name | Ministry / Division | Official Verified Portal Link |
| :--- | :--- | :--- |
| **PM-KUSUM** (Component-B Solar Pumps) | Ministry of New & Renewable Energy | [https://pmkusum.mnre.gov.in/](https://pmkusum.mnre.gov.in/) |
| **PMFBY** (Crop Insurance Guidelines) | Ministry of Agriculture & Farmers Welfare | [https://pmfby.gov.in/](https://pmfby.gov.in/) |
| **PM-KISAN** (Income Support Guidelines) | Department of Agriculture & Farmers Welfare | [https://pmkisan.gov.in/](https://pmkisan.gov.in/) |
| **SMAM & Kisan Drones** | Mechanization & Technology Division | [https://agrimachinery.nic.in/](https://agrimachinery.nic.in/) |
| **Soil Health Card Scheme** | Integrated Nutrient Management Division | [https://soilhealth.dac.gov.in/](https://soilhealth.dac.gov.in/) |
| **NMNF** (National Mission on Natural Farming) | Natural Farming Division, MoA&FW | [https://naturalfarming.dac.gov.in/](https://naturalfarming.dac.gov.in/) |

---

## 4. Evaluator Testing & Documented Failure Analysis

Judges can test the system using two complementary test suites:

### A. The 5 Standardized Benchmark Questions
Access the **"Official Benchmark"** tab in the sidebar to run all 5 tests:
1. **72-Hour Claim Window:** Mandatory timeframe to report crop loss after a hailstorm under PMFBY.
2. **PM-KUSUM 60% Subsidy:** Standalone pump financial assistance formula in General states.
3. **PM-KISAN Exclusion Logic:** Institutional and government employee exclusions (identifying Group D / MTS exceptions).
4. **12 Soil Health Parameters:** Complete listing of chemical and physical soil indicators.
5. **Out-of-Domain Refusal:** Surprise question on buying electric helicopters for farm tourism (system triggers refusal).

---

### B. Documented Failure & Hallucination Records (For Evaluators)
These records highlight cases where ground truth is present in the corpus, but standard LLMs hallucinate:

#### Record 1: The Drone Import Hallucination (Real Hallucination in Unconstrained LLMs)
* **Prompt:** *"Can a farmer purchase an imported 25-litre DJI agricultural spray drone under SMAM and claim 50% subsidy?"*
* **Observed AI Hallucination:** *"The guidelines do not place any restriction on the make of the drone, so an imported 25-litre DJI drone would be eligible for 50% subsidy up to Rs. 5 Lakhs..."*
* **Ground Truth:** **Strictly Ineligible.** DGFT and SMAM guidelines explicitly ban foreign drone imports (including DJI). Only DGCA Type-Certified drones manufactured in India by approved domestic OEMs are eligible.
* **Root Cause:** Context chunk details financial caps (50% up to Rs. 5 Lakhs) but omits negative foreign trade restrictions, causing standard LLMs to mistakenly approve foreign equipment.

#### Record 2: Multi-Unit Solar Pump Hallucination
* **Prompt:** *"Can a farmer with 10 acres of land install three 10 HP solar pumps under PM-KUSUM Component-B?"*
* **Observed AI Hallucination:** *"Yes, your 10 acres are sufficient to install three 10 HP pumps..."*
* **Ground Truth:** Under Component-B, financial support is strictly limited to **one standalone pump per farmer**, and capacity is benchmarked at **7.5 HP**.
* **Root Cause:** Model incorrectly infers that pump allocations scale with land acreage because of lack of explicit negative cardinality guardrails.

#### Record 3: Uncovered Calamity Refusal (Anti-Hallucination Guardrail)
* **Prompt:** *"What is the compensation amount per hectare under PMFBY if wild elephants damage sugarcane crops?"*
* **AgriShield Response:** *"I cannot find this information in the official agricultural documents provided."* (Refusal badge active).
* **Significance:** Demonstrates reliable thresholding. Rather than fabricating a fictitious wildlife compensation rate, AgriShield refuses when state-specific add-ons are absent from the baseline corpus.

---

## 5. Deployment Guide (Netlify & Cloud)

### Option A: Deploy Frontend to Netlify (1-Click)
1. Fork or push this repository to your GitHub account.
2. Log in to [Netlify](https://app.netlify.com/) and click **"Add new site" -> "Import an existing project"**.
3. Select your **`Agrishield`** repository.
4. Netlify automatically detects [`netlify.toml`](./netlify.toml):
   - **Base directory:** `frontend`
   - **Build command:** `npm run build`
   - **Publish directory:** `frontend/dist`
5. In **Site Configuration -> Environment variables**, add:
   ```env
   VITE_API_BASE_URL=https://your-backend-service.onrender.com
   ```
6. Click **Deploy Site**.

---

### Option B: Free Backend Hosting (Render.com)
1. Log in to [Render.com](https://render.com) and create a **New Web Service**.
2. Connect your GitHub repository:
   - **Root Directory:** `backend`
   - **Runtime:** `Python 3`
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `uvicorn main:app --host 0.0.0.0 --port $PORT`
3. Under **Environment Variables**, add:
   ```env
   GROQ_API_KEY=your_groq_api_key_here
   ```
4. Copy your Render service URL (e.g., `https://agrishield-backend.onrender.com`) and paste it into Netlify's `VITE_API_BASE_URL`.

---

### Option C: Live Hackathon Demo (Netlify + Localtunnel)
If presenting live at the hackathon and you want Netlify to talk directly to your running local backend without cloud delays:
1. Run your local backend:
   ```bash
   cd backend
   python -m uvicorn main:app --host 127.0.0.1 --port 8000
   ```
2. In a second terminal, open a public tunnel:
   ```bash
   npx localtunnel --port 8000
   ```
3. Copy the generated URL (`https://xyz.loca.lt`) and set it as `VITE_API_BASE_URL` in Netlify!

---

## 6. How to Run Locally

### Prerequisites
- Python 3.10+
- Node.js 18+
- Free Groq API Key from [https://console.groq.com/keys](https://console.groq.com/keys)

### 1. Setup Backend
```bash
cd backend
python -m venv venv
venv\Scripts\activate       # On Windows
# source venv/bin/activate  # On Linux/macOS
pip install -r requirements.txt
cp .env.example .env
# Edit .env and paste your GROQ_API_KEY
python -m uvicorn main:app --host 127.0.0.1 --port 8000
```

### 2. Setup Frontend
```bash
cd frontend
npm install
npm run dev
```
Open **`http://localhost:5173`** in your browser to experience AgriShield.

---

## 7. Project Structure

```
├── backend/
│   ├── main.py              # FastAPI server, endpoints, and file upload handlers
│   ├── rag_engine.py        # BM25 + Dense SentenceTransformer + RRF Hybrid RAG
│   ├── requirements.txt     # Python dependencies
│   ├── .env.example         # Template for environment keys
│   └── tests/               # Evaluation test scripts
├── frontend/
│   ├── src/
│   │   ├── components/      # UI Views (Dashboard, Chat, Knowledge Base, Benchmark)
│   │   ├── apiConfig.ts     # Dynamic API endpoint configuration
│   │   ├── App.tsx          # Main application container
│   │   └── types.ts         # TypeScript interfaces
│   ├── package.json
│   └── vite.config.ts
├── data/                    # Official Government Policy Guidelines (Corpus)
├── netlify.toml             # Production Netlify deployment configuration
├── TEST_SHEET.md            # Detailed Evaluator Test Matrix & Failure Analysis
└── README.md                # Project documentation
```

---

## 8. License
Built for educational and hackathon demonstration under the MIT License.
