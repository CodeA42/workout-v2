import { z } from 'zod';
import { getRepository } from '../db.utils';
import { DataOrError } from '../type';
import { ActivityEntity } from './activity.entity';
import {
  Activity,
  PartialActivity,
  PartialActivityInstance,
  activitySchema,
  partialActivityInstanceSchema,
} from './activity.schema';
import { WorkoutEntity } from '../workout/workout.entity';

export type UpdateActivityResult = z.ZodError<PartialActivity> | string;

export class ActivityRespository {
  static async updateExistingEctivity(
    id: number,
    activity: PartialActivityInstance,
  ): Promise<DataOrError<ActivityEntity, UpdateActivityResult>> {
    const result = partialActivityInstanceSchema.safeParse(activity);
    if (!result.success) return result;

    const activityRepository = await getRepository(ActivityEntity);
    let foundActivity = await activityRepository.findOneBy({ id });

    if (!foundActivity) return { success: false, error: 'Activity not found' };

    if (activity.name) foundActivity.name = activity.name;
    if (activity.reps) foundActivity.reps = activity.reps;
    if (activity.type) foundActivity.type = activity.type;
    if (activity.workoutId) foundActivity.workoutId = activity.workoutId;
    if (activity.order) foundActivity.order = activity.order;

    const savedActivity = await activityRepository.save(foundActivity);
    return {
      success: true,
      data: savedActivity,
    };
  }

  static async createActivity(
    data: Activity,
  ): Promise<DataOrError<ActivityEntity, z.ZodError<Activity>>> {
    const result = activitySchema.safeParse(data);
    if (!result.success) return result;

    let newActivity = new ActivityEntity();
    newActivity = { ...newActivity, ...result.data };
    newActivity.order = await this.getNumberOfActivitiesInAWorkout(
      result.data.workoutId,
    );

    const workoutRepository = await getRepository(WorkoutEntity);
    const workout = await workoutRepository.findOne({
      where: { id: result.data.workoutId },
    });

    if (workout) {
      newActivity.workout = workout;
    }

    const activityRepository = await getRepository(ActivityEntity);
    const savedActivity = await activityRepository.save(newActivity);

    return {
      success: true,
      data: savedActivity,
    };
  }

  static async moveBelow(
    positionToMoveBelow: number,
    id: number,
  ): Promise<void> {
    const activityRepository = await getRepository(ActivityEntity);

    const activity = await activityRepository.findOne({ where: { id } });
    if (!activity) return;

    const allActivities = await activityRepository.find({
      where: { workoutId: activity?.workoutId },
    });
    const startIndex = allActivities.findIndex(activity => activity.id === id);

    const modifiedActivities = this.moveElement(
      allActivities,
      startIndex,
      positionToMoveBelow,
    );

    await this.setOrderBasedOnArrayIndex(modifiedActivities);
  }

  private static async setOrderBasedOnArrayIndex(
    activities: ActivityEntity[],
  ): Promise<ActivityEntity[]> {
    const activityRepository = await getRepository(ActivityEntity);

    const activitiesWithModifiedOrder = activities.map((activity, index) => ({
      ...activity,
      order: index + 1,
    }));

    return activityRepository.save(activitiesWithModifiedOrder);
  }

  private static moveElement(
    arr: ActivityEntity[],
    fromIndex: number,
    toIndex: number,
  ): ActivityEntity[] {
    const [targetActivity] = arr.splice(fromIndex, 1);

    arr.splice(toIndex, 0, targetActivity);

    return arr;
  }

  static async getNumberOfActivitiesInAWorkout(
    workoutId: number,
  ): Promise<number> {
    const activityRepository = await getRepository(ActivityEntity);
    const count = await activityRepository
      .createQueryBuilder('activity')
      .where('activity.workoutId = :workoutId', { workoutId })
      .getCount();

    return count;
  }

  static async delete(id: number) {
    const activityRepository = await getRepository(ActivityEntity);
    await activityRepository.delete({ id });
  }

  static async getAllActivitiesForAWorkout(
    workoutId: number,
  ): Promise<ActivityEntity[]> {
    const activityRepository = await getRepository(ActivityEntity);
    return activityRepository.find({ where: { workoutId } });
  }
}
