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

{
    "card1": "The emperor - Stability, power, aid, protection, a great person, conviction, reason. An opportunity may be presenting itself. A new job or leadership role. you may find yourself becoming the boss of something. You are on top of your game right now, take advantage of this position. This card is suggestive of stability and security in life. You are on top of things and everything is under your control. It is your hard work, discipline and self control that have bought you this far. It means that you are in charge of your life now setting up your own rules and boundaries.",
    "card2": "The Lovers - Attraction, love, beauty, trials overcome.You are being led to love. The Lovers represent a couple coming together and supporting each other in divine Harmony. You may be starting a new relationship or strengthening an existing one. This card can also indicate a non romantic relationship such as a friendship or partnership of some kind. This card is about relationships and choices. Its appearance in a spread indicates some decision about an existing relationship, a temptation of the heart, or a choice of potential partners. Often an aspect of the querent's life will have to be sacrificed; a bachelor(ette)'s lifestyle may be sacrificed and a relationship gained (or vice versa), or one potential partner may be chosen while another is turned down. Whatever the choice, it should not be made lightly, as the ramifications will be lasting.",
    "card3": "The Chariot - Progression, forward motion. No obstacles will be able to stop you. You are moving forward and progressing now. Self-sufficiency will drive you toward your future. The Chariot is a card about overcoming conflicts and moving forward in a positive direction. One needs to keep going on and through sheer hard work and commitment he will be victorious. In Relationships  this card points out the need to maintain independence."
}
