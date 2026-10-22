# AgriShield (KrishiKavach) — 5-Question Test Sheet & Evaluation Matrix
**Hackathon Event:** From Text to Insight: Ask Your Documents (Global Academy of Technology)  
**Evaluation Date:** 22 October 2026  
**Pipeline:** Hybrid RAG (BM25Okapi + SentenceTransformers `all-MiniLM-L6-v2` + Groq Llama 3.3 70B)

---

## 1. Five Standardized Test Questions

| # | Evaluation Category | Test Question | Expected Ground Truth Answer | Source Document & Clause | Metric / Rubric Target |
|---|-------------------|---------------|------------------------------|--------------------------|------------------------|
| **Q1** | **Strict Numerical & Deadline Retrieval** | *"What is the mandatory time window for a farmer to report crop loss under PMFBY after a hailstorm?"* | **Within 72 hours** of the occurrence of the calamity to the Crop Insurance App, Toll-free 14447, or local agriculture office. | `PMFBY_Crop_Insurance_Guidelines.md` (Mandatory Claim Intimation Window) | **100% Factual Precision.** Zero tolerance for hallucination or delay. |
| **Q2** | **Multi-Tier Subsidy Matrix** | *"What percentage of subsidy is provided for a standalone solar agricultural pump under PM-KUSUM Component-B in general states?"* | **60% total subsidy** (30% Central Financial Assistance CFA + minimum 30% State Government subsidy). The farmer contributes maximum 40% (can take a 30% bank loan, requiring only 10% margin money). | `PM_KUSUM_Solar_Pump_Scheme.md` (Component-B) | **Complex Breakdown Accuracy.** Correct separation of Central vs State vs Farmer contribution. |
| **Q3** | **Exclusion Logic & Exceptions** | *"Are retired government employees eligible to receive PM-KISAN benefits?"* | **Serving and retired government employees are excluded** (as well as pensioners receiving Rs. 10,000+ monthly). **EXCEPTION:** Multi-Tasking Staff (MTS) / Class IV / Group D employees are NOT excluded and remain eligible. | `PM_KISAN_Operational_Guidelines.md` (Exclusion Criteria) | **Conditional Negation Parsing.** Correctly identifies the Group D / MTS exception. |
| **Q4** | **Technical Specification Listing** | *"How many and which parameters are tested on a Soil Health Card?"* | **12 parameters:** Primary Macro (N, P, K), Secondary (S), Micro (Zn, Fe, Cu, Mn, B), and Physical indicators (pH, EC, Organic Carbon). | `Soil_Health_Card_and_Fertilizer_Policy.md` (12 Mandatory Parameters) | **Completeness.** Full enumeration without missing chemical elements. |
| **Q5** | **Anti-Hallucination & Refusal** *(Out-of-Domain / Surprise)* | *"What is the government subsidy for buying an electric helicopter for farm tourism?"* | *"I cannot find this information in the official agricultural documents provided."* | **Out of Domain / Not in Corpus** | **Strict Grounding Refusal.** Rubric Rule: "Unanswerable questions get 'I don't know'". |

---

## 2. Honest Failure Analysis (2 Documented Failure Cases)

### Failure Case 1: Polysemous Acronym Ambiguity
* **Trigger Query:** `"subsidy for CHC and FMB"`
* **Failure Symptom:** Pure dense semantic vector retrieval mapped "CHC" to Community Health Centres and medical facilities, returning low-relevance chunks.
* **Underlying Root Cause:** Pre-trained dense language embeddings (like general MiniLM) carry broad web associations where "CHC" is predominantly medical rather than agricultural ("Custom Hiring Centre").
* **Implemented Mitigation:**
  1. Built a **Query Expansion Layer** that translates domain shorthand into explicit statutory nomenclature (`CHC` $\to$ `Custom Hiring Centre`, `SMAM`).
  2. Implemented **BM25 Lexical Matching** combined via **Reciprocal Rank Fusion (RRF)** ($k=60$), prioritizing exact keyword occurrences over fuzzy semantic drift.

### Failure Case 2: Multi-Hop Cross-Scheme Temporal Calculations
* **Trigger Query:** `"If I received PM-KISAN in December 2023, when can I apply for post-harvest claim if harvest is delayed?"`
* **Failure Symptom:** Single-step retrieval fetched either PM-KISAN disbursal rules or PMFBY post-harvest rules, but struggled to formulate a composite synthetic schedule.
* **Underlying Root Cause:** The facts belong to two separate ministry operational guidelines (MoA&FW PM-KISAN division vs PMFBY Insurance division) chunked into separate vector clusters.
* **Implemented Mitigation:**
  - Expanded top-$K$ retrieval to 4 diverse chunks and structured prompt context with distinct scheme delimiters `[Source 1: Scheme | Section]`, enabling the Llama 3.3 model to reason across multi-source contexts without confusing schemes.
