import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  Relation,
} from 'typeorm';
import { ActivityEntity } from '../activity/activity.entity';

@Entity()
export class WorkoutEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column('text')
  name!: string;

  @OneToMany(() => ActivityEntity, activityEntity => activityEntity.workout)
  activities?: Relation<ActivityEntity>;
}
