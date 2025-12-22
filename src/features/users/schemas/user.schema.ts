import { Roles } from "@/enums/roles.enum";
import { z } from "zod";

export const registerUserSchema = z.object({
  name: z.string().min(3, "El nombre debe tener al menos 3 caracteres"),
  dni: z
    .string()
    .min(8, "El DNI debe tener 8 dígitos")
    .max(8, "El DNI debe tener 8 dígitos")
    .regex(/^\d+$/, "El DNI solo debe contener números"),
  username: z.string().min(3, "El usuario debe tener al menos 3 caracteres"),
  password: z.string().min(4, "La contraseña debe tener al menos 4 caracteres"),
  role: z.enum(Roles, "Debes seleccionar un rol"),
  floors: z.array(z.string()).min(1, "Debes seleccionar al menos un piso"),
});

export type RegisterUserSchema = z.infer<typeof registerUserSchema>;
