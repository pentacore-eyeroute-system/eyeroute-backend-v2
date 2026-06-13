import { z } from 'zod';

export const pviSchema = z.object({
    pviFirstname: z.string().trim(),
    pviLastname: z.string().trim(),
    pviGender: z.enum(['Female', 'Male', 'Prefer Not to Say']),
    relationship: z.enum([
        'Parent',
        'Spouse/Partner',
        'Son/Daughter',
        'Sibling',
        'Grandchild',
        'Grandparent',
        'Legal Guardian',
        'Caregiver',
        'Friend/Volunteer'
    ]),
});