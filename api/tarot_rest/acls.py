import pathlib
import textwrap
import google.generativeai as genai
from IPython.display import display
from IPython.display import Markdown
from dotenv import load_dotenv
import os

load_dotenv()
GOOGLE_API_KEY = os.getenv('GOOGLE_API_KEY')
genai.configure(api_key=os.environ["GOOGLE_API_KEY"])
model = genai.GenerativeModel('gemini-1.5-pro')


def get_reading(cards):
    card1 = cards["card1"]
    card2 = cards["card2"]
    card3 = cards["card3"]

    prompt = f"Given 3 tarot cards and their descriptions: 1){card1}, 2){card2}, 3){card3} Please give me a tarot reading."
    response = model.generate_content(prompt)
    return response.text

