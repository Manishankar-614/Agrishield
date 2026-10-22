export interface ChunkMetadata {
  chunk_id: string;
  doc_name: string;
  scheme: string;
  section: string;
  content: string;
  source_url?: string;
}

export interface RetrievedSource {
  chunk: ChunkMetadata;
  vector_score: number;
  bm25_score: number;
  rrf_score: number;
}

export interface QueryResponse {
  query: string;
  answer: string;
  grounded: boolean;
  retrieval_latency_ms: number;
  generation_latency_ms: number;
  total_latency_ms: number;
  retrieved_sources: RetrievedSource[];
}

export interface BenchmarkQuestion {
  id: string;
  category: string;
  question: string;
  expected_answer: string;
  expected_document: string;
  key_phrase: string;
  rubric_target: string;
}

export interface FailureCase {
  case_id: string;
  title: string;
  query_example: string;
  failure_mode: string;
  cause: string;
  mitigation_implemented: string;
}

export interface DocumentSummary {
  doc_name: string;
  title: string;
  sections: string[];
  chunks_count: number;
}
