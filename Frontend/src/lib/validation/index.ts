import { z } from "zod";

export const PatientSignupValidation = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),

  phone: z
    .string()
    .min(10, { message: "Phone number must be at least 10 digits" })
    .max(15, { message: "Phone number cannot exceed 15 digits" })
    .regex(/^[0-9]+$/, { message: "Phone number must contain only numbers" }),

  email: z.string().email({ message: "Invalid email address" }),

  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" }),
});

export const SigninValidation = z.object({
  email: z.string().email(),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" }),
});

export const DoctorSignupValidation = z.object({
  name: z.string().min(1, "Name is required"),
  specialization: z.string().min(1, "Specialization is required"),
  phone: z
    .string()
    .min(10, "Phone number is required")
    .max(15, "Phone number is too long")
    .regex(/^[0-9]+$/, { message: "Phone number must contain only numbers" }),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});
