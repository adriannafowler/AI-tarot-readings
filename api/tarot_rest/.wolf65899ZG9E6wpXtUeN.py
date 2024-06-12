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

# for m in genai.list_models():
#     if 'generateContent' in m.supported_generation_methods:
#         print(m.name)
response = model.generate_content('Given 3 tarot cards: the empress, the chariot, and temperance. Please give me a tarot reading')
print(response.text)
