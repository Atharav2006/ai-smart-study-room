from langdetect import detect, DetectorFactory

# Ensure consistent results
DetectorFactory.seed = 0

def detect_language(text: str) -> str:
    """
    Detect language of the text
    Returns ISO 639-1 code like 'en', 'hi', 'gu'
    """
    try:
        lang = detect(text)
        return lang
    except:
        return "unknown"

def is_supported_language(text: str, supported_languages=['en', 'hi', 'gu']) -> bool:
    lang = detect_language(text)
    return lang in supported_languages
