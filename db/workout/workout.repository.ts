import { In } from 'typeorm';
import { getRepository } from '../db.utils';
import { WorkoutEntity } from './workout.entity';
import { castArray } from 'lodash';
import { Workout } from './workout.schema';

export class WorkoutRepository {
  static async delete(ids: number | number[]): Promise<void> {
    const workoutRepository = await getRepository(WorkoutEntity);
    await workoutRepository.delete({ id: In(castArray(ids)) });
  }

  static async create({ name }: Workout): Promise<WorkoutEntity> {
    const workoutRepository = await getRepository(WorkoutEntity);
    return workoutRepository.save({
      name,
    });
  }

  static async findAll(): Promise<WorkoutEntity[]> {
    const workoutRepository = await getRepository(WorkoutEntity);
    return workoutRepository.find();
  }
}
