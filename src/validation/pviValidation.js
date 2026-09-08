import { z } from 'zod';

const pviNameSchema = z.object({
    pviFirstname: z.string().trim(),
    pviLastname: z.string().trim(),
});

export const pviSchema = pviNameSchema.extend({
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

export const pviUpdateSchema = pviNameSchema;