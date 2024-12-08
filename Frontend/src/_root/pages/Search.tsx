import React, { useState } from "react";
import { useSearchDoctors } from "@/lib/react-query/queriesAndMutations"; // Import your custom hook
import Loader from "@/components/shared/Loader"; // Adjust based on your project

type SearchProps = {
  data: {
    symptoms: string[];
    suggestedFields: string[];
  };
};

const Search = ({ data }: SearchProps) => {
  const [query, setQuery] = useState<string>("");
  const [filter, setFilter] = useState<
    "all" | "doctors" | "symptoms" | "fields"
  >("all");

  const { data: doctorResults, isLoading: loadingDoctors } = useSearchDoctors(
    filter === "doctors" ? query : ""
  );

  const filteredResults = {
    symptoms: data.symptoms.filter((symptom) =>
      symptom.toLowerCase().includes(query.toLowerCase())
    ),
    suggestedFields: data.suggestedFields.filter((field) =>
      field.toLowerCase().includes(query.toLowerCase())
    ),
  };

  return (
    <div className="min-h-screen bg-dm-dark py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-dm-dark-2 shadow-md rounded-lg p-6">
        <h1 className="text-2xl font-bold text-dm-light mb-4">Search</h1>

        {/* Filter Options */}
        <div className="mb-4">
          <label className="text-dm-light mr-4">Filter By:</label>
          <select
            value={filter}
            onChange={(e) =>
              setFilter(
                e.target.value as "all" | "doctors" | "symptoms" | "fields"
              )
            }
            className="p-2 rounded-md bg-dm-dark border border-dm-accent text-dm-light"
          >
            <option value="all">All</option>
            <option value="doctors">Doctors</option>
            <option value="symptoms">Symptoms</option>
            <option value="fields">Fields</option>
          </select>
        </div>

        {/* Search Input */}
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search doctors, symptoms, or fields..."
          className="w-full p-3 rounded-md border border-dm-accent focus:outline-none focus:ring-2 focus:ring-dm-accent"
        />

        {/* Search Results */}
        <div className="mt-6">
          {query && (
            <div>
              <h2 className="text-lg font-semibold text-dm-light mb-2">
                Search Results for "{query}":
              </h2>

              <div className="space-y-4">
                {/* Doctors Section */}
                {(filter === "all" || filter === "doctors") && (
                  <div>
                    <h3 className="text-lg font-semibold text-dm-light">
                      Doctors
                    </h3>
                    {loadingDoctors ? (
                      <Loader />
                    ) : (
                      <ul className="text-gray-300">
                        {doctorResults?.length > 0 ? (
                          doctorResults.map(
                            (doctor: { id: string; name: string }) => (
                              <li key={doctor.id}>{doctor.name}</li>
                            )
                          )
                        ) : (
                          <li>No matching doctors found.</li>
                        )}
                      </ul>
                    )}
                  </div>
                )}

                {/* Symptoms Section */}
                {(filter === "all" || filter === "symptoms") && (
                  <div>
                    <h3 className="text-lg font-semibold text-dm-light">
                      Symptoms
                    </h3>
                    <ul className="text-gray-300">
                      {filteredResults.symptoms.length > 0 ? (
                        filteredResults.symptoms.map((symptom, index) => (
                          <li key={index}>{symptom}</li>
                        ))
                      ) : (
                        <li>No matching symptoms found.</li>
                      )}
                    </ul>
                  </div>
                )}

                {/* Suggested Fields Section */}
                {(filter === "all" || filter === "fields") && (
                  <div>
                    <h3 className="text-lg font-semibold text-dm-light">
                      Suggested Fields
                    </h3>
                    <ul className="text-gray-300">
                      {filteredResults.suggestedFields.length > 0 ? (
                        filteredResults.suggestedFields.map((field, index) => (
                          <li key={index}>{field}</li>
                        ))
                      ) : (
                        <li>No matching fields found.</li>
                      )}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Search;
