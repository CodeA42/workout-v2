import { z } from 'zod';
import { objectIdSchema } from '../object-id.schema';

export const activitySchema = z.object({
  name: z.string(),
  type: z.string(),
  reps: z.number(),
  workoutId: z.number(),
});
export type Activity = z.infer<typeof activitySchema>;

export const partialaActivitySchema = activitySchema.partial();
export type PartialActivity = z.infer<typeof partialaActivitySchema>;

export const activityInstanceSchema = activitySchema
  .merge(objectIdSchema)
  .merge(z.object({ order: z.number() }));
export type ActivityInstance = z.infer<typeof activityInstanceSchema>;

export const partialActivityInstanceSchema = activityInstanceSchema.partial();
export type PartialActivityInstance = z.infer<
  typeof partialActivityInstanceSchema
>;
