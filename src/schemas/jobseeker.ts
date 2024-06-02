import { z } from "zod";

export const jobseekerLoginSchema = z.object({
  email: z.string().email(),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/\d/, "Password must contain at least one digit")
    .regex(
      /[!@#$%^&*(),.?":{}|<>]/,
      "Password must contain at least one special character"
    ),
});

export const jobseekerRegisterSchema = z.object({
  email: z.string().email(),
  username: z.string(),
  education: z.string(),
  experience: z.string(),
  skills: z.array(z.string().min(1).max(50)),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/\d/, "Password must contain at least one digit")
    .regex(
      /[!@#$%^&*(),.?":{}|<>]/,
      "Password must contain at least one special character"
    ),
});

export const jobseekerUpdateSchema = z.object({
  education: z.string(),
  experience: z.string(),
  skills: z.array(z.string().min(1).max(50)),
});
