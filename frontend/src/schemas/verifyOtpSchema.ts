import { z } from "zod";

export const verifySchema = z.object({
  otp: z.string().length(6, "verify code should contain only 6 digits"),
});
