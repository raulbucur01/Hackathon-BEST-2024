import {
  useQuery,
  useMutation,
  useQueryClient,
  useInfiniteQuery,
} from "@tanstack/react-query";
import {
  createPatientAccount,
  getCurrentUser,
  signInAccount,
  signOutAccount,
  createDoctorAccount,
  getDoctorDetails,
  getDiagnosis,
  getDoctorsBySpecialization,
  getAIChatHistory,
  addAIChatHistory,
  searchDoctors,
} from "../api";
import { INewPatient, INewDoctor } from "@/types";
import { QUERY_KEYS } from "./queryKeys";

export const useGetAIChatHistory = (patientId: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_AI_CHAT_HISTORY, patientId],
    queryFn: () => getAIChatHistory(patientId),
    enabled: !!patientId,
  });
};

export const useSearchDoctors = (input: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.SEARCH_DOCTORS, input],
    queryFn: () => searchDoctors(input),
    enabled: !!input,
  });
};

export const useAddAiChatHistory = () => {
  return useMutation({
    mutationFn: ({
      patientId,
      message,
    }: {
      patientId: string;
      message: string;
    }) => addAIChatHistory(patientId, message),
  });
};

export const useCreatePatientAccount = () => {
  return useMutation({
    mutationFn: (patient: INewPatient) => createPatientAccount(patient),
  });
};

export const useCreateDoctorAccount = () => {
  return useMutation({
    mutationFn: (doctor: INewDoctor) => createDoctorAccount(doctor),
  });
};

export const useSignInAccount = () => {
  return useMutation({
    mutationFn: (user: { email: string; password: string }) =>
      signInAccount(user),
  });
};

export const useGetDoctorsBySpecialization = (specializations: string[]) => {
  return useQuery({
    queryKey: ["getDoctorsBySpecialization", specializations], // Include specializations in the queryKey
    queryFn: () => getDoctorsBySpecialization(specializations), // Use the specializations from the hook's argument
  });
};

export const useGetDiagnosis = () => {
  return useMutation({
    mutationFn: (message: string) => getDiagnosis(message),
  });
};

export const useSignOutAccount = () => {
  return useMutation({
    mutationFn: signOutAccount,
  });
};

export const useGetCurrentUser = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_CURRENT_USER],
    queryFn: getCurrentUser,
  });
};

export const useGetDoctorDetails = (doctorId: string | undefined) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_DOCTOR_DETAILS, doctorId],
    queryFn: () => getDoctorDetails(doctorId as string),
    enabled: !!doctorId, // Only fetch if doctorId exists
  });
};
