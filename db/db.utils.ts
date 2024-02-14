import { DataSource, EntityTarget, ObjectLiteral } from 'typeorm';
import { WorkoutEntity } from './workout/workout.entity';
import { ActivityEntity } from './activity/activity.entity';

const dataSource = new DataSource({
  database: 'workout-db',
  driver: 'sqlite',
  entities: [WorkoutEntity, ActivityEntity],
  // synchronize: true,
  type: 'expo',
});

let dbi: DataSource;

export async function getDbInstance(): Promise<DataSource> {
  if (dbi) return dbi;
  dbi = await dataSource.initialize();
  return dbi;
}

export async function resetDatabase() {
  dbi = await getDbInstance();
  await dbi.dropDatabase();
  await dbi.synchronize();
}

export async function getRepository<Entity extends ObjectLiteral>(
  entity: EntityTarget<Entity>,
) {
  const dbi = await getDbInstance();
  return dbi.getRepository(entity);
}
