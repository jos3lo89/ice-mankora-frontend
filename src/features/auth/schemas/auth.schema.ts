import { z } from "zod";

export const signInSchema = z.object({
  username: z.string().min(3, "El usuario debe tener al menos 3 caracteres"),
  password: z.string().min(4, "La contraseña debe tener al menos 4 caracteres"),
});

export type SignInSchema = z.infer<typeof signInSchema>;
