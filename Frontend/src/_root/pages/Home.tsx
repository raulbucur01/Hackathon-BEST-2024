import React, { useEffect, useState } from "react";
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
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-300 flex flex-col items-center justify-center px-4">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">Welcome to Our Platform</h1>
      <p className="text-lg text-gray-700 mb-6">
        Explore features like Health Assistant, Doctor Appointments, and more.
      </p>
      <div className="flex gap-4">
        <Link
          to="/health-assistant"
          className="px-6 py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          Go to Health Assistant
        </Link>
        <button
          onClick={handleViewAppointments}
          className="px-6 py-3 bg-green-500 text-white rounded-md hover:bg-green-600"
        >
          View Appointments
        </button>
      </div>
    </div>
  );
};

export default Home;
