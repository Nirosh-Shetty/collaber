import { z } from "zod";

export const usernameSchema = z
  .string()
  .min(2, "Username must contain atleast 2 charectors")
  .max(20, "Username shouldn't exeed 20 charectors")
  .regex(/^[a-zA-Z0-9_]+$/, "Username shouldn't contain special charectors");

export const signUpSchema = z.object({
  role: z.enum(["influencer", "brand", "manager"], {
    errorMap: () => ({ message: "Please select a role" }),
  }),
  name: z.string(),
  username: usernameSchema,
  email: z.string().email({ message: "Enter a valid email" }),
  password: z.string().min(6, "Password must contian atleast 6 words"),
  // otp: z.number().max(20, "Username shouldn't exeed 20 charectors"),
});
