import { z } from 'zod';

export const userSchema = z.object({
    famFirstname: z.string().trim(),
    famLastname: z.string().trim(),
    famGender: z.enum(['Female', 'Male', 'Prefer Not to Say']),
});