// app/schemas.ts

import { z } from 'zod';

export const userSchema = z.object({
  id: z.string(),
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  email: z.string().email({ message: 'Invalid email address.' }),
  phoneNumber: z.string().regex(/^04\d{8}$/, { message: 'Must be a valid Australian mobile number.' }),
});

export type User = z.infer<typeof userSchema>

export const userFormSchema = userSchema.omit({ id: true })
export type UserFormData = z.infer<typeof userFormSchema>


