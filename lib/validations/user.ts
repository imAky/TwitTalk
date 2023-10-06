import * as z from "zod";

export const UserValidation = z.object({
  banner: z.string().url(),
  profile: z.string().url().nonempty(),
  name: z
    .string()
    .nonempty()
    .min(3, { message: "Minimum 3 characters accepts." })
    .max(50, { message: "Maximum 30 characters allowed." }),
  username: z
    .string()
    .min(3, { message: "Minimum 3 characters accepts." })
    .max(30, { message: "Maximum 30 characters allowed." }),
  bio: z.string().max(160, { message: "Maximum 50 characters allowed" }),
  location: z
    .string()
    .max(30, { message: "Maximum 30 characters allowed." })
    .optional(),
  website: z
    .string()
    .url()
    .max(100, { message: "Maximum 30 characters allowed." })
    .optional(),
});
