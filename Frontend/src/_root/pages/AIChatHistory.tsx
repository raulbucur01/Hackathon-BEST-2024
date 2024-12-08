import { useGetAIChatHistory } from "@/lib/react-query/queriesAndMutations";
import { useUserContext } from "@/context/AuthContext";
import Loader from "@/components/shared/Loader";

const AIChatHistory = () => {
  const { user } = useUserContext();
  const {
    data: chatHistory,
    isPending,
    isError,
  } = useGetAIChatHistory(user?.id);

  if (isPending) {
    return <Loader />;
  }

  if (isError) {
    return (
      <div className="text-center mt-10">
        <p className="text-lg font-semibold text-red-500">
          Error loading AI chat history. Please try again later.
        </p>
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
            {chatHistory.map((message: string, index: number) => (
              <li
                key={index}
                className={`p-4 rounded-lg transition duration-200 ${
                  index % 2 === 0 ? "bg-dm-light" : "bg-dm-accent"
                } shadow-sm hover:scale-105`}
              >
                {message}
              </li>
            ))}
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
