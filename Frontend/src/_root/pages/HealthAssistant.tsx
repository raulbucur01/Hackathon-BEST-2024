import { useUserContext } from "@/context/AuthContext";
import {
  useGetDiagnosis,
  useGetDoctorsBySpecialization,
  useAddAiChatHistory,
} from "@/lib/react-query/queriesAndMutations";
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

type ApiResponse = {
  symptoms: string[];
  diagnosis: string;
  suggested_fields: string[];
};

const HealthAssistant = () => {
  const { user } = useUserContext();
  const [userInput, setUserInput] = useState<string>(
    localStorage.getItem("userInput") || ""
  );
  const [responseData, setResponseData] = useState<ApiResponse | null>(
    JSON.parse(localStorage.getItem("responseData") || "null")
  );
  const [specializations, setSpecializations] = useState<string[]>(
    JSON.parse(localStorage.getItem("specializations") || "[]")
  );
  const [doctors, setDoctors] = useState<any[]>(
    JSON.parse(localStorage.getItem("doctors") || "[]")
  );
  const [error, setError] = useState<string | null>(null);

  const { mutateAsync: getDiagnosis, isPending: isGettingDiagnosis } =
    useGetDiagnosis();
  const { data: fetchedDoctors, isLoading: isFetchingDoctors } =
    useGetDoctorsBySpecialization(specializations);

  const { mutateAsync: addAiChatHistoryMutation } = useAddAiChatHistory();

  useEffect(() => {
    if (fetchedDoctors) {
      setDoctors(fetchedDoctors);
      localStorage.setItem("doctors", JSON.stringify(fetchedDoctors));
    }
  }, [fetchedDoctors]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setResponseData(null);
    setDoctors([]);
    setSpecializations([]);

    try {
      const result = await getDiagnosis(userInput);
      console.log(result);
      console.log(result.diagnosis);
      if (result) {
        setResponseData(result);
        setSpecializations(result.suggested_fields);

        // Save to localStorage
        localStorage.setItem("responseData", JSON.stringify(result));
        localStorage.setItem(
          "specializations",
          JSON.stringify(result.suggested_fields)
        );
        localStorage.setItem("userInput", userInput);

        // Format data for storage
        const formattedString = `
         User Input: ${userInput}
         Diagnosis: ${result.diagnosis}
         Symptoms: ${result.symptoms.join(", ")}
         Suggested Fields: ${result.suggested_fields.join(", ")}
         Doctors: ${doctors
           .map((doc) => `${doc.name} - ${doc.specialization}`)
           .join(", ")}
       `;

        // Trigger the mutation to save this formatted string into the database
        const patientId = user.id; // Replace this with the actual logged-in user's ID
        await addAiChatHistoryMutation({ patientId, message: formattedString });
      } else {
        setError("Failed to get a response from the server.");
      }
    } catch (err) {
      console.error(err);
      setError("An error occurred while processing your request.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-blue-300 flex">
      {/* Scrollable Content */}
      <div className="flex-1 ml-1/4 overflow-y-auto">
        <div className="flex flex-col items-center justify-center p-8">
          <h1 className="text-4xl font-bold text-blue-900 mb-8">
            Health Assistant
          </h1>

          {/* Input Form */}
          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-4 bg-white p-8 shadow-lg rounded-lg w-full max-w-4xl"
          >
            <textarea
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder="Describe your health problem..."
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 resize-none"
            />
            <button
              type="submit"
              disabled={isGettingDiagnosis || isFetchingDoctors}
              className="px-8 py-3 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 transition disabled:opacity-50"
            >
              {isGettingDiagnosis || isFetchingDoctors
                ? "Analyzing..."
                : "Send"}
            </button>
          </form>

          {/* Error Message */}
          {error && (
            <div className="mt-4 text-red-500 font-semibold">{error}</div>
          )}

          {/* Response Display */}
          {responseData && (
            <div className="mt-8 bg-white p-8 shadow-lg rounded-lg max-w-7xl w-full">
              <h2 className="text-3xl font-semibold text-blue-700">Results</h2>

              <div className="mt-4">
                <h3 className="text-xl font-semibold text-gray-700">
                  Symptoms:
                </h3>
                <ul className="list-disc list-inside mt-2 text-gray-600">
                  {responseData.symptoms.map((symptom, index) => (
                    <li key={index}>{symptom}</li>
                  ))}
                </ul>
              </div>

              <div className="mt-6">
                <h3 className="text-xl font-semibold text-gray-700">
                  Diagnosis:
                </h3>
                <p className="mt-2 text-gray-600 whitespace-pre-line">
                  {responseData.diagnosis}
                </p>
              </div>

              <div className="mt-6">
                <h3 className="text-xl font-semibold text-gray-700">
                  Suggested Fields:
                </h3>
                <ul className="list-disc list-inside mt-2 text-gray-600">
                  {responseData.suggested_fields.map((field, index) => (
                    <li key={index}>{field}</li>
                  ))}
                </ul>
              </div>

              {doctors.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-xl font-semibold text-gray-700">
                    Doctors:
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                    {doctors.map((doctor) => (
                      <Link
                        to={`/doctor-details/${doctor.$id}`}
                        state={{
                          report: {
                            symptoms: responseData.symptoms,
                            diagnosis: responseData.diagnosis,
                          },
                        }}
                        className="text-blue-500 hover:underline"
                      >
                        {doctor.name}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HealthAssistant;
