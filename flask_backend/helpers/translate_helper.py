# --- A Helper Function to Run Our Agents ---
# We'll use this function throughout the notebook to make running queries easy.
import os
import re
import json
import asyncio
# from IPython.display import display, Markdown
from deep_translator import MyMemoryTranslator
from getpass import getpass 
from dotenv import load_dotenv

# lOad environment variable from the env
load_dotenv()

key_path = os.path.join(os.path.dirname(__file__), "..", "keys", "google-translate-key.json")
os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = os.path.abspath(key_path)

def translate_text_mymemory(text: str, source_lang: str = "en-GB", target_lang: str = "yo-NG") -> str:
    """
    Translate text using MyMemory Translator (via deep-translator).
    """
    try:
        translator = MyMemoryTranslator(source=source_lang, target=target_lang)
        return translator.translate(text)
    except Exception as e:
        return f"Translation error: {str(e)}"


def translate_text(text: str, target_lang: str = "yo-NG", source_lang: str = "en-GB") -> str:
    """
    Alias for translate_text_mymemory for backward compatibility.
    """
    return translate_text_mymemory(text, source_lang, target_lang)

def detect_language_mymemory(text: str) -> str:
    """
    Detect language using MyMemory's auto-detect capability.
    Since MyMemory doesn't return explicit detection results,
    we infer detection by trying 'auto' as source.
    """
    try:
        # Limit text length to avoid translation service issues
        if len(text) > 500:
            text = text[:500]
        
        # Skip detection for very short text
        if len(text.strip()) < 3:
            return "en-GB"
        
        # Translate text with auto-detect → English
        translator = MyMemoryTranslator(source="auto", target="en-GB")
        translated = translator.translate(text)

        # Heuristic:
        # if translation == original, assume English
        if translated.strip().lower() == text.strip().lower():
            return "en-GB"
        return "yo-NG"  # fallback assumption for Yoruba
    except Exception as e:
        # Return a proper error message instead of raising
        return f"Detection error: {str(e)}"


def detect_language(text: str) -> str:
    """
    Alias for detect_language_mymemory for backward compatibility.
    """
    return detect_language_mymemory(text)

class MyMemoryDetectHelper:
    """
    Helper for detecting language using MyMemory.
    """

    def __init__(self, source="auto", target="en-GB"):
        self.translator = MyMemoryTranslator(source=source, target=target)

    def detect_language(self, text: str) -> str:
        """
        Detect the source language of the given text.
        Uses detect_language_mymemory under the hood.
        """
        return detect_language_mymemory(text)

