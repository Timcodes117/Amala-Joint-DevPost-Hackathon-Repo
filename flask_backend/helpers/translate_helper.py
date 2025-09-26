# --- A Helper Function to Run Our Agents ---
# We'll use this function throughout the notebook to make running queries easy.
import os
import re
import json
import asyncio
# from IPython.display import display, Markdown
from getpass import getpass 
from dotenv import load_dotenv

# lOad environment variable from the env
load_dotenv()

# Try to import Google Cloud Translate, with fallback
try:
    from google.cloud import translate_v2 as translate
    key_path = os.path.join(os.path.dirname(__file__), "..", "keys", "google-translate-key.json")
    os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = os.path.abspath(key_path)
    translate_client = translate.Client()
    TRANSLATE_AVAILABLE = True
except (ImportError, Exception) as e:
    print(f"Warning: Google Cloud Translate not available: {e}")
    translate_client = None
    TRANSLATE_AVAILABLE = False

def translate_text(
    text: str | bytes | list[str],
    target_language: str = "en",
    source_language: str | None = None,
) -> str:
    """Translate text into the specified language and return only the translated string."""

    if not TRANSLATE_AVAILABLE or not translate_client:
        # Fallback: return original text if translation is not available
        if isinstance(text, bytes):
            text = text.decode("utf-8")
        return str(text)

    if isinstance(text, bytes):
        text = text.decode("utf-8")

    try:
        # Always pass a list to keep things consistent
        results = translate_client.translate(
            values=[text],
            target_language=target_language,
            source_language=source_language
        )

        # results is a list of dicts, so we grab the first one
        result = results[0]

        # Debug logging (optional)
        print(f"Detected source language: {result.get('detectedSourceLanguage')}")
        print(f"Input text: {result.get('input')}")
        print(f"Translated text: {result.get('translatedText')}\n")

        return result["translatedText"]  # ✅ Only return string
    except Exception as e:
        print(f"Translation error: {e}")
        # Fallback: return original text
        return str(text)



def detect_language(text: str) -> str:
    """Detect language of the input text and return just the language code."""
    
    if not TRANSLATE_AVAILABLE or not translate_client:
        # Fallback: assume English if translation is not available
        return "en"

    try:
        result = translate_client.detect_language(text)

        print(f"Text: {text}")
        print("Confidence: {}".format(result["confidence"]))
        print("Language: {}".format(result["language"]))

        return result["language"]  # ✅ Only return language code
    except Exception as e:
        print(f"Language detection error: {e}")
        # Fallback: assume English
        return "en"

