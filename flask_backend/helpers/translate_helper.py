# --- A Helper Function to Run Our Agents ---
# We'll use this function throughout the notebook to make running queries easy.
import os
import re
import asyncio
# from IPython.display import display, Markdown
from google.cloud import translate_v2 as translate
from getpass import getpass 
from dotenv import load_dotenv

# lOad environment variable from the env

load_dotenv()


key_path = os.path.join(os.path.dirname(__file__), "..", "keys", "google-translate-key.json")
os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = os.path.abspath(key_path)

import google.generativeai as genai
from google.adk.agents import Agent
from google.adk.tools import google_search
from google.adk.runners import Runner
from google.adk.sessions import InMemorySessionService, Session
from google.genai.types import Content, Part
from google.cloud import translate_v2 as translate
from getpass import getpass 


translate_client = translate.Client()

def translate_text(
    text: str | bytes | list[str] = "¡Hola amigos y amigas!",
    target_language: str = "en",
    source_language: str | None = None,
) -> dict:
    """Translates a given text into the specified target language.

    Find a list of supported languages and codes here:
    https://cloud.google.com/translate/docs/languages#nmt

    Args:
        text: The text to translate. Can be a string, bytes or a list of strings.
              If bytes, it will be decoded as UTF-8.
        target_language: The ISO 639 language code to translate the text into
                         (e.g., 'en' for English, 'es' for Spanish).
        source_language: Optional. The ISO 639 language code of the input text
                         (e.g., 'fr' for French). If None, the API will attempt
                         to detect the source language automatically.

    Returns:
        A dictionary containing the translation results.
    """

    from google.cloud import translate_v2 as translate

    translate_client = translate.Client()

    if isinstance(text, bytes):
        text = [text.decode("utf-8")]

    if isinstance(text, str):
        text = [text]

    # If a string is supplied, a single dictionary will be returned.
    # In case a list of strings is supplied, this method
    # will return a list of dictionaries.

    # Find more information about translate function here:
    # https://cloud.google.com/python/docs/reference/translate/latest/google.cloud.translate_v2.client.Client#google_cloud_translate_v2_client_Client_translate
    results = translate_client.translate(
        values=text,
        target_language=target_language,
        source_language=source_language
    )

    for result in results:
        if "detectedSourceLanguage" in result:
            print(f"Detected source language: {result['detectedSourceLanguage']}")

        print(f"Input text: {result['input']}")
        print(f"Translated text: {result['translatedText']}")
        print()

    return results


def detect_language(text: str) -> dict:
    """Detects the text's language of the input text."""
    from google.cloud import translate_v2 as translate

    translate_client = translate.Client()

    # Text can also be a sequence of strings, in which case this method
    # will return a sequence of results for each text.
    result = translate_client.detect_language(text)

    print(f"Text: {text}")
    print("Confidence: {}".format(result["confidence"]))
    print("Language: {}".format(result["language"]))

    return result
