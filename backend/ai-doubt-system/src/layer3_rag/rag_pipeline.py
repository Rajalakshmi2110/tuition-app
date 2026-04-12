import pickle
import faiss
from sentence_transformers import SentenceTransformer
from groq import Groq
import json
import os
from dotenv import load_dotenv

load_dotenv()

class RAGPipeline:
    def __init__(self, subject_id='data_structures', vector_db_path=None, ollama_url=None):
        from pathlib import Path
        
        self.subject_id = subject_id
        
        if vector_db_path:
            self.vector_db_path = vector_db_path
        else:
            base_dir = Path(os.environ.get('AI_PROJECT_ROOT', Path(__file__).parent.parent.parent))
            self.vector_db_path = str(base_dir / 'subjects' / subject_id / 'vector_db')
        
        self.index = faiss.read_index(f"{self.vector_db_path}/faiss_index.bin")
        with open(f"{self.vector_db_path}/chunks.pkl", 'rb') as f:
            self.chunks = pickle.load(f)
        
        try:
            with open(f"{self.vector_db_path}/metadata.json", 'r') as f:
                self.metadata = json.load(f)
        except:
            self.metadata = [{"source": f"{subject_id} materials", "page": i} for i in range(len(self.chunks))]
        
        self.embedder = SentenceTransformer('sentence-transformers/all-MiniLM-L6-v2')
        
        api_key = os.getenv('GROQ_API_KEY')
        if not api_key:
            raise ValueError("GROQ_API_KEY not set")
        self.client = Groq(api_key=api_key)
        self.model_name = "llama-3.1-8b-instant"
        
        print(f"RAG Pipeline loaded for {subject_id} with {len(self.chunks)} chunks (Groq)")
    
    def retrieve_context(self, question, top_k=3):
        import re
        specific_source = None
        question_lower = question.lower()
        
        if '.pdf' in question_lower:
            match = re.search(r'([\w_]+)\.pdf', question_lower)
            if match:
                specific_source = match.group(1)
        
        query_embedding = self.embedder.encode([question]).astype('float32')
        
        search_k = top_k * 5 if specific_source else top_k
        distances, indices = self.index.search(query_embedding, search_k)
        
        context_chunks = []
        sources = []
        for idx in indices[0]:
            meta = self.metadata[idx] if idx < len(self.metadata) else {"source": "Unknown", "page": idx}
            
            if specific_source:
                if specific_source.lower() not in meta['source'].lower():
                    continue
            
            chunk_text = self.chunks[idx]
            if len(chunk_text) > 1500:
                chunk_text = chunk_text[:1500] + "..."
            context_chunks.append(chunk_text)
            sources.append(meta)
            
            if len(context_chunks) >= top_k:
                break
        
        return "\n\n".join(context_chunks), sources
    
    def generate_answer(self, question, context, is_follow_up=False):
        code_keywords = ['algorithm', 'pseudocode', 'function', 'procedure', 'implementation']
        needs_code = any(keyword in question.lower() for keyword in code_keywords)
        
        if is_follow_up:
            prompt = f"""Context: {context}

Question: {question}

Provide additional information, examples, or deeper explanation.

Answer:"""
        elif needs_code:
            prompt = f"""Context: {context}

Question: {question}

Using ONLY the context, provide the algorithm/pseudocode in triple backticks.

Answer:"""
        else:
            prompt = f"""You are an academic tutor. Answer using ONLY the context below.

Context: {context}

Question: {question}

Rules:
- Clear, well-structured answer in your own words
- Use short paragraphs with line breaks
- If listing items, use numbered points
- Keep concise: 3-5 sentences for simple, up to 10 for complex
- Do NOT include raw textbook formatting

Answer:"""
        
        try:
            response = self.client.chat.completions.create(
                model=self.model_name,
                messages=[{"role": "user", "content": prompt}],
                max_tokens=500,
                temperature=0.7
            )
            return response.choices[0].message.content
        except Exception as e:
            return f"Error generating answer: {str(e)}"
    
    def answer_question(self, question, is_follow_up=False):
        context, sources = self.retrieve_context(question, top_k=3)
        answer = self.generate_answer(question, context, is_follow_up)
        
        formatted_sources = []
        for src in sources:
            formatted_sources.append(f"{src['source']} (Page {src['page']})")
        
        return {
            "status": "success",
            "context": context,
            "answer": answer,
            "sources": formatted_sources
        }
