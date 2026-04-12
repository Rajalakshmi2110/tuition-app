from .rag_pipeline import RAGPipeline
from pathlib import Path
import re
import html
from typing import Dict, Any

_pipelines = {}

def get_rag_pipeline(subject_id='data_structures', vector_db_path=None):
    global _pipelines
    if subject_id in _pipelines:
        return _pipelines[subject_id]
    _pipelines[subject_id] = RAGPipeline(subject_id=subject_id, vector_db_path=vector_db_path)
    return _pipelines[subject_id]

def format_answer(data: Dict[str, Any], format_type: str = 'json') -> Any:
    if 'answer' in data and isinstance(data['answer'], str):
        data['answer'] = html.unescape(data['answer'])
        data['answer'] = re.sub(r'^[=\-]{3,}$', '', data['answer'], flags=re.MULTILINE)
        data['answer'] = re.sub(r'\n{3,}', '\n\n', data['answer'])
    return data

def generate_answer(question: str, subject_id='data_structures', vector_db_path=None, is_follow_up=False) -> str:
    pipeline = get_rag_pipeline(subject_id, vector_db_path)
    return pipeline.answer_question(question, is_follow_up)
