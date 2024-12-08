import { useGetAIChatHistory } from "@/lib/react-query/queriesAndMutations";
import { useUserContext } from "@/context/AuthContext";
import Loader from "@/components/shared/Loader";

// Regex Patterns for parsing strings
const regexPatterns = {
  userInput: /User Input: (.+?)\n/,
  symptoms: /Symptoms: (.+?)\n/,
  suggestedFields: /Suggested Fields: (.+?)\n/,
  doctors: /Doctors: (.+)/,
};

type ParsedChatData = {
  userInput: string;
  diagnosis: string;
  symptoms: string[];
  suggestedFields: string[];
  doctors: string[];
};

function parseChatHistory(rawString: string): ParsedChatData {
  const userInputMatch = rawString.match(regexPatterns.userInput);
  const diagnosisIndex = rawString.indexOf("Diagnosis:");
  const symptomsMatch = rawString.match(regexPatterns.symptoms);
  const suggestedFieldsMatch = rawString.match(regexPatterns.suggestedFields);
  const doctorsMatch = rawString.match(regexPatterns.doctors);

  // Extract full diagnosis section
  let diagnosis = "Unknown";
  if (diagnosisIndex !== -1) {
    const remainingText = rawString.substring(diagnosisIndex);
    const nextKeyIndex = Math.min(
      ...["Symptoms:", "Suggested Fields:", "Doctors:"]
        .map((key) => remainingText.indexOf(key))
        .filter((index) => index !== -1)
    );
    diagnosis =
      nextKeyIndex === Infinity
        ? remainingText.substring(10).trim()
        : remainingText.substring(10, nextKeyIndex).trim();
  }

  return {
    userInput: userInputMatch?.[1] || "Unknown",
    diagnosis,
    symptoms: symptomsMatch
      ? symptomsMatch[1].split(", ").map((symptom) => symptom.trim())
      : [],
    suggestedFields: suggestedFieldsMatch
      ? suggestedFieldsMatch[1].split(", ").map((field) => field.trim())
      : [],
    doctors: doctorsMatch
      ? doctorsMatch[1].split(", ").map((doctor) => doctor.trim())
      : [],
  };
}

const AIChatHistory = () => {
  const { user } = useUserContext();
  const {
    data: chatHistory,
    isPending,
    isError,
  } = useGetAIChatHistory(user?.id);

  if (isPending) {
    return (
      <div className="bg-dm-dark h-screen flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-dm-dark h-screen flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dm-dark py-8 px-4 sm:px-6 lg:px-8">
      {/* Container */}
      <div className="max-w-4xl mx-auto bg-dm-dark-2 shadow-md rounded-lg p-6">
        {/* Header */}
        <div className="border-b border-dm-dark-2 pb-4 mb-4">
          <h1 className="text-2xl font-bold text-dm-light mb-2">
            AI Chat History
          </h1>
          <p className="text-md text-dm-accent">
            View your AI chat history, conversations, and assistant responses.
          </p>
        </div>

        {/* Chat History Section */}
        {chatHistory?.length > 0 ? (
          <ul className="space-y-4">
            {chatHistory.map((message: string, index: number) => {
              const parsedData = parseChatHistory(message);
              return (
                <li
                  key={index}
                  className={`p-4 rounded-lg transition duration-200 ${
                    index % 2 === 0 ? "bg-dm-secondary" : "bg-dm-dark"
                  } shadow-sm`}
                >
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-semibold text-dm-light">
                        » Your Input «
                      </h3>
                      <p className="text-gray-300">{parsedData.userInput}</p>
                    </div>
                    <hr className="border-dm-accent" />
                    <div>
                      <h3 className="text-lg font-semibold text-dm-light">
                        » Diagnosis «
                      </h3>
                      <div className="text-gray-300 whitespace-pre-line">
                        {parsedData.diagnosis || "No diagnosis available."}
                      </div>
                    </div>
                    <hr className="border-dm-accent" />
                    <div>
                      <h3 className="text-lg font-semibold text-dm-light">
                        » Symptoms «
                      </h3>
                      <ul className="text-gray-300">
                        {parsedData.symptoms.length > 0 ? (
                          parsedData.symptoms.map((symptom, i) => (
                            <li key={i}>{symptom}</li>
                          ))
                        ) : (
                          <li>No symptoms listed.</li>
                        )}
                      </ul>
                    </div>
                    <hr className="border-dm-accent" />
                    <div>
                      <h3 className="text-lg font-semibold text-dm-light">
                        » Suggested Fields «
                      </h3>
                      <ul className="text-gray-300">
                        {parsedData.suggestedFields.length > 0 ? (
                          parsedData.suggestedFields.map((field, i) => (
                            <li key={i}>{field}</li>
                          ))
                        ) : (
                          <li>No fields suggested.</li>
                        )}
                      </ul>
                    </div>
                    <hr className="border-dm-accent" />
                    <div>
                      <h3 className="text-lg font-semibold text-dm-light">
                        » Doctors «
                      </h3>
                      <ul className="text-gray-300">
                        {parsedData.doctors.length > 0 ? (
                          parsedData.doctors.map((doctor, i) => (
                            <li key={i}>{doctor}</li>
                          ))
                        ) : (
                          <li>No doctors suggested.</li>
                        )}
                      </ul>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        ) : (
          <div className="text-center text-gray-600 mt-10">
            <p>
              No AI chat history available yet. Start interacting with your
              assistant!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIChatHistory;
