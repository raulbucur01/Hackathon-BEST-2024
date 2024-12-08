import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getCurrentUser } from "@/lib/api"; // Assume this function gets the current user from Appwrite

const Home = () => {
  const [userId, setUserId] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const currentUser = await getCurrentUser();
        if (currentUser?.$id) {
          setUserId(currentUser.$id);
        }
      } catch (error) {
        console.error("Error fetching user ID:", error);
      }
    };

    fetchUserId();
  }, []);

  const handleViewAppointments = () => {
    if (userId) {
      navigate(`/appointments/${userId}`);
    } else {
      alert("You must be logged in to view appointments.");
    }
  };

  return (
    <div className="min-h-screen bg-dm-dark flex flex-col items-center justify-center px-6">
      <h1 className="text-4xl font-bold text-dm-light mb-8">
        Welcome to Our Platform
      </h1>
      <p className="text-lg text-dm-accent mb-6 text-center">
        Explore features like Health Assistant, Doctor Appointments, and more.
      </p>
      <div className="flex gap-6">
        {/* Health Assistant Button */}
        <Link
          to="/health-assistant"
          className="px-6 py-3 bg-dm-dark-2 text-white rounded-md hover:bg-dm-secondary transition duration-200"
        >
          Go to Health Assistant
        </Link>
        {/* Appointments Button */}
        <button
          onClick={handleViewAppointments}
          className="px-6 py-3 bg-dm-dark-2 text-white rounded-md hover:bg-dm-secondary transition duration-200"
        >
          View Appointments
        </button>
      </div>
    </div>
  );
};

export default Home;
