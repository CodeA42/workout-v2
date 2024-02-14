import { z } from 'zod';

export const objectIdSchema = z.object({ id: z.string().uuid().nonempty() });

export type ObjectId = z.infer<typeof objectIdSchema>;
