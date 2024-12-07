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
} from "../api";
import { INewPost, INewPatient, IUpdatePost, INewDoctor } from "@/types";
import { QUERY_KEYS } from "./queryKeys";

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
