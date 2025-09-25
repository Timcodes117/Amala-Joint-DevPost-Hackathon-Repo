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


def translate_text_mymemory(text: str, source_lang: str = "en", target_lang: str = "yo") -> str:
    """
    Translate text using MyMemory Translator (via deep-translator).

    Args:
        text (str): The text to translate.
        source_lang (str): The source language code (default: "en").
        target_lang (str): The target language code (default: "yo").

    Returns:
        str: Translated text.
    """
    try:
        translator = MyMemoryTranslator(source=source_lang, target=target_lang)
        return translator.translate(text)
    except Exception as e:
        return f"Translation error: {str(e)}"

class MyMemoryDetectHelper:
    """
    Helper for detecting language using MyMemory.
    """

    def __init__(self, source="auto", target="en"):
        # Default is auto → en (to let it detect automatically)
        self.translator = MyMemoryTranslator(source=source, target=target)

    def detect_language(self, text: str) -> str:
        """
        Detect the source language of the given text.
        MyMemory detects automatically when source='auto'.
        """
        try:
            translation = self.translator.translate(text)
            detected_lang = self.translator.source  # The auto-detected language
            return detected_lang
        except Exception as e:
            raise RuntimeError(f"Detection failed: {e}")
    



