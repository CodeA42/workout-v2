import { z } from 'zod';
import { objectIdSchema } from '../object-id.schema';

export const workoutSchema = z.object({
  name: z.string(),
});
export type Workout = z.infer<typeof workoutSchema>;

export const workoutWithIdSchema = workoutSchema.merge(objectIdSchema);
export type WorkoutWithId = z.infer<typeof workoutWithIdSchema>;
