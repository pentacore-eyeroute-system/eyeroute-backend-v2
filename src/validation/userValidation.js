import { z } from 'zod';

export const signUpOtpSchema = z.object({
    email: z.string().trim().email(),
    otp: z.coerce.string().length(6),
    password: z.string(),
    famFirstname: z.string().trim().min(1),
    famLastname: z.string().trim().min(1),
    famGender: z.enum([
        'Female',
        'Male',
        'Prefer Not to Say'
    ]),
});

export const forgotPasswordOtpSchema = z.object({
    email: z.string().trim().email(),
    otp: z.coerce.string().length(6),
    password: z.string(),
});