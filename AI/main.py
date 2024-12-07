from openai import OpenAI

# Set up your OpenAI API key
api_key = "sk-proj-FItk0iqiCJg5jakKxsOcT3BlbkFJ0WrMEi4512NjGNWIt8Lu"


client = OpenAI(
    api_key=api_key,
)

# Step 1: Extract Symptoms
def extract_symptoms(user_input):
    """
    Extracts symptoms from the user's input text using OpenAI GPT.
    """
    messages = [
        {"role": "system", "content": "You are a helpful assistant specialized in medical symptom extraction."},
        {"role": "user", "content": f"Extract symptoms from the following text:\n\"{user_input}\""}
    ]
    response = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=messages,
        max_tokens=150,
        temperature=0.7
    )
    raw_text = response.choices[0].message.content.strip()

    # Parse the symptoms (assumes the response lists them)
    symptoms = [line.strip() for line in raw_text.split("\n") if line.strip() and not line.strip().isdigit()]
    return symptoms


# Step 2: Get Possible Diagnoses
def get_diagnosis(symptoms):
    """
    Provides possible diagnoses based on extracted symptoms using OpenAI GPT.
    """
    messages = [
        {"role": "system", "content": "You are a medical assistant providing possible diagnoses based on symptoms. "
                                      "You must give information about every diagnoses provided"},
        {"role": "user",
         "content": f"Based on the following symptoms: {', '.join(symptoms)}, what are the most likely diagnoses?"}
    ]
    response = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=messages,
        max_tokens=200,
        temperature=0.7
    )
    diagnosis = response.choices[0].message.content.strip()
    return diagnosis


# Main Script
if __name__ == "__main__":
    print("Welcome to the AI Health Assistant!")
    user_input = input("Describe your health problem: ")

    # Step 1: Extract Symptoms
    symptoms = extract_symptoms(user_input)
    print(f"\nExtracted Symptoms: {symptoms}")

    # Step 2: Get Diagnosis
    if symptoms:
        diagnosis = get_diagnosis(symptoms)
        print(f"\nPossible Diagnoses:\n{diagnosis}")
    else:
        print("\nNo symptoms could be extracted. Please provide more details.")
