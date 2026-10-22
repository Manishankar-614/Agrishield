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

## 2. In-Context Failure & Hallucination Analysis (3 Evaluator Records)

The following 3 evaluation records demonstrate cases where the **ground truth is contained within the official knowledge base documents**, but standard LLMs or unconstrained RAG pipelines hallucinate or produce erroneous answers due to semantic ambiguity, context bleeding, or prior web biases.

---

### Evaluator Record 1: Geographic Subsidy Cap Hallucination
* **Prompt to Give:**  
  `"Can I get a 90% subsidy under PM-KUSUM for installing a solar pump on my 5-acre farm in Haryana?"`
* **Target Knowledge Base Document:**  
  [`PM_KUSUM_Solar_Pump_Scheme.md`](file:///c:/Users/Student.ME/Downloads/ANLP%20hackathon/data/PM_KUSUM_Solar_Pump_Scheme.md) (Component-B: Pattern of Financial Support)
* **Ground Truth in Documents:**  
  **No, strictly 60% total subsidy** (30% Central CFA + 30% State Government subsidy). The 90% subsidy rate is **strictly restricted** to North-Eastern states, Hilly regions (Himachal Pradesh, Uttarakhand, Jammu & Kashmir), and Island territories. Haryana is a General category state and is legally capped at 60%.
* **Observed AI Hallucination (Standard LLM / Naive RAG):**  
  *"Yes, under PM-KUSUM you can get up to 90% subsidy for your standalone solar pump, where the Central government provides 50% CFA and the State provides 30%..."* (Affirming 90% for a general state farmer).
* **Root Cause NLP Analysis:**  
  **Cross-Clause Context Bleeding:** The retrieved chunk contains two adjacent bullet points: General States (60%) and Special Hilly/NE States (90%). Because the user's prompt explicitly mentions *"90% subsidy"*, standard cross-attention latches onto the 90% clause, leading the model to confirm the user's wishful premise rather than refuting it for Haryana.
* **AgriShield Mitigation:**  
  Strict entity-state classification in prompt instructions and cross-checking geographic eligibility before stating subsidy percentages.

---

### Evaluator Record 2: Dual Temporal Constraint Confusion
* **Prompt to Give:**  
  `"My harvested wheat crop was lying cut in the field and got damaged by unseasonal rain 10 days after harvest. Can I claim under PMFBY if I intimate within 72 hours of the rain?"`
* **Target Knowledge Base Document:**  
  [`PMFBY_Crop_Insurance_Guidelines.md`](file:///c:/Users/Student.ME/Downloads/ANLP%20hackathon/data/PMFBY_Crop_Insurance_Guidelines.md) (Clause 7.2: Post-Harvest Losses)
* **Ground Truth in Documents:**  
  **Yes, the claim is valid.** Under PMFBY Post-Harvest coverage, crops kept in "cut and spread" condition in the field for drying are protected for **up to 14 days post-harvest**. Because the damage occurred at 10 days (within 14 days) and intimation was reported within 72 hours of the unseasonal rain event, the claim is fully admissible.
* **Observed AI Hallucination (Standard LLM / Naive RAG):**  
  *"No, your claim will be rejected because claims under PMFBY must be submitted within 72 hours of harvesting, and 10 days have already elapsed."*
* **Root Cause NLP Analysis:**  
  **Compounding Temporal Logic Failure:** The document specifies two independent time clocks:
  1. *Elapsed time since harvest:* Max 14 days.
  2. *Intimation clock after calamity:* Max 72 hours from the incident.  
  Standard RAG models frequently collapse these two distinct clocks into a single deadline, wrongly assuming the 72-hour window starts from the harvest date rather than the calamity occurrence date.
* **AgriShield Mitigation:**  
  Multi-clause chunking that pairs the 14-day post-harvest eligibility condition with the event-based 72-hour notification clock.

---

### Evaluator Record 3: Statutory Landholder vs Tenant Cultivator Exclusion
* **Prompt to Give:**  
  `"I cultivate 3 hectares of agricultural land under a written tenancy lease agreement. Am I entitled to receive Rs. 6,000 per year under PM-KISAN?"`
* **Target Knowledge Base Document:**  
  [`PM_KISAN_Operational_Guidelines.md`](file:///c:/Users/Student.ME/Downloads/ANLP%20hackathon/data/PM_KISAN_Operational_Guidelines.md) (Clause 2.1: Definition of Beneficiary)
* **Ground Truth in Documents:**  
  **Strictly Ineligible.** PM-KISAN benefits are legally restricted to *landholder farmer families* who hold actual cultivable land ownership recorded in State land revenue records. Agricultural laborers, tenant farmers, and sharecroppers are completely excluded from the scheme.
* **Observed AI Hallucination (Standard LLM / Naive RAG):**  
  *"Yes! Small and marginal farmers cultivating up to 2-3 hectares are eligible to receive Rs. 6,000 per year in three installments to purchase seeds and fertilizers."*
* **Root Cause NLP Analysis:**  
  **Pre-Training Bias Overriding Dense Retrieval:** Most pre-trained LLMs have seen millions of web pages stating "PM-KISAN supports small Indian farmers". When queried with *"cultivate 3 hectares"*, the model relies on general world knowledge rather than the statutory legal nuance of *land-owning titleholder* versus *tenant cultivator*.
* **AgriShield Mitigation:**  
  BM25 lexical prioritization of exclusionary keywords (`tenant`, `sharecropper`, `landholder family`) combined with explicit grounding instructions enforcing strict legal definitions.

---

## 3. Official Portal Verification Links
Every response generated by AgriShield is verified against and directly links to official Government of India portals:
1. **PM-KUSUM (Solar Pumps):** [https://pmkusum.mnre.gov.in/](https://pmkusum.mnre.gov.in/)
2. **PMFBY (Crop Insurance):** [https://pmfby.gov.in/](https://pmfby.gov.in/)
3. **PM-KISAN (Income Support):** [https://pmkisan.gov.in/](https://pmkisan.gov.in/)
4. **SMAM & Kisan Drones (Mechanization):** [https://agrimachinery.nic.in/](https://agrimachinery.nic.in/)
5. **Soil Health Card Scheme:** [https://soilhealth.dac.gov.in/](https://soilhealth.dac.gov.in/)
6. **National Mission on Natural Farming (NMNF):** [https://naturalfarming.dac.gov.in/](https://naturalfarming.dac.gov.in/)

