import re

def clean_text(text: str) -> str:
    """
    Remove unnecessary characters, extra spaces, and normalize text
    """
    text = text.strip()
    text = re.sub(r'\s+', ' ', text)  # collapse multiple spaces
    text = re.sub(r'[^a-zA-Z0-9 .,?!]', '', text)  # remove special chars
    return text

def split_sentences(text: str) -> list:
    """
    Split text into sentences for summary or analysis
    """
    sentences = re.split(r'(?<=[.!?]) +', text)
    return [s.strip() for s in sentences if s.strip()]

def extract_keywords(text: str, min_length=3) -> list:
    """
    Simple keyword extraction: return unique words longer than min_length
    """
    words = re.findall(r'\b\w+\b', text.lower())
    keywords = list(set([w for w in words if len(w) >= min_length]))
    return keywords
