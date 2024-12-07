import React from "react";
import { useParams } from "react-router-dom";
import { useGetDoctorDetails } from "@/lib/react-query/queriesAndMutations";

const DoctorDetailsPage = () => {
  const { doctorId } = useParams<{ doctorId: string }>();

  const { data: doctor, isLoading, error } = useGetDoctorDetails(doctorId);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error loading doctor details. Please try again later.</div>;
  }

  if (!doctor) {
    return <div>Doctor not found.</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold">{doctor.name}</h1>
      <img src={doctor.imageUrl} alt={doctor.name} className="w-32 h-32 mt-4" />
      <p className="mt-4">Specialization: {doctor.specialization}</p>
      <p className="mt-2">Contact: {doctor.phone}</p>
      <p className="mt-2">Email: {doctor.email}</p>
    </div>
  );
};

export default DoctorDetailsPage;
