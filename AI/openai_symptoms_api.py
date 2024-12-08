from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from openai import OpenAI
from utils import load_config_yaml_file
from pathlib import Path
from fastapi.middleware.cors import CORSMiddleware
from twilio.jwt.access_token import AccessToken
from twilio.jwt.access_token.grants import VideoGrant

app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Change "*" to specific domains for security
    allow_methods=["GET", "POST", "OPTIONS"],  # Allow OPTIONS for preflight
    allow_headers=["*"],
)

# Load configuration
config = load_config_yaml_file(Path("config.yaml"))

api_key = config["OPENAI_KEY"]
twilio_account_sid = config["TWILIO_ACCOUNT_SID"]
twilio_api_key = config["TWILIO_API_KEY"]
twilio_api_secret = config["TWILIO_API_SECRET"]

client = OpenAI(api_key=api_key)

class PatientRequest(BaseModel):
    user_input: str

class TokenRequest(BaseModel):
    roomName: str
    identity: str

def extract_symptoms(user_input):
    """
    Extracts symptoms from the user's input text using OpenAI GPT.
    """
    messages = [
        {"role": "system", "content": "You are a helpful assistant specialized in medical symptom extraction."},
        {"role": "user", "content": f"Extract symptoms from the following text:\n\"{user_input}\""}
    ]
    try:
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=messages,
            max_tokens=150,
            temperature=0.7
        )
        raw_text = response.choices[0].message.content.strip()
        symptoms = [line.strip() for line in raw_text.split("\n") if line.strip() and not line.strip().isdigit()]
        return symptoms
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error extracting symptoms: {str(e)}")

def get_diagnosis(symptoms):
    """
    Provides possible diagnoses based on extracted symptoms using OpenAI GPT.
    """
    messages = [
        {"role": "system", "content": "You are a medical assistant providing possible diagnoses based on symptoms. "
                                      "You must give information about every diagnosis provided"},
        {"role": "user",
         "content": f"Based on the following symptoms: {', '.join(symptoms)}, what are the most likely diagnoses?"}
    ]
    try:
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=messages,
            max_tokens=200,
            temperature=0.7
        )
        diagnosis = response.choices[0].message.content.strip()
        return diagnosis
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching diagnosis: {str(e)}")

def get_medical_field(diagnosis):
    """
    Provides the suggested medical field(s) based on the diagnosis using OpenAI GPT.
    """
    messages = [
        {"role": "system", "content": "You are an assistant specializing in mapping medical diagnoses to relevant medical fields (e.g., Radiology, Dermatology, Psychiatry). Respond with just the word(s) of the field(s) separated by commas."},
        {"role": "user",
         "content": f"Based on the diagnosis: \"{diagnosis}\", which medical field(s) should the patient consult?"}
    ]
    try:
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=messages,
            max_tokens=100,
            temperature=0.7
        )
        fields = response.choices[0].message.content.strip()
        suggested_fields = [field.strip() for field in fields.split(",") if field.strip()]
        return suggested_fields
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching medical fields: {str(e)}")

@app.post("/analyze")
def analyze_health(request: PatientRequest):
    """
    Analyzes the patient's health problem and provides symptoms and possible diagnoses.
    """
    user_input = request.user_input

    symptoms = extract_symptoms(user_input)
    if not symptoms:
        raise HTTPException(status_code=400, detail="No symptoms could be extracted. Please provide more details.")

    diagnosis = get_diagnosis(symptoms)
    medical_fields = get_medical_field(diagnosis)

    return {
        "symptoms": symptoms,
        "diagnosis": diagnosis,
        "suggested_fields": medical_fields
    }

@app.post("/generate-token")
def generate_twilio_token(request: TokenRequest):
    """
    Generates a Twilio token for video chat.
    """
    try:
        token = AccessToken(
            twilio_account_sid,
            twilio_api_key,
            twilio_api_secret,
            identity=request.identity
        )
        video_grant = VideoGrant(room=request.roomName)
        token.add_grant(video_grant)
        return {"token": token.to_jwt()}  # No need to decode
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating Twilio token: {str(e)}")
