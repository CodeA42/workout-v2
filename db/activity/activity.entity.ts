import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  Relation,
  JoinColumn,
} from 'typeorm';
import { WorkoutEntity } from '../workout/workout.entity';

@Entity()
export class ActivityEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column('text')
  name!: string;

  @Column('text')
  type!: string;

  @Column('integer')
  reps!: number;

  @Column('integer')
  workoutId!: number;

  @ManyToOne(() => WorkoutEntity, workoutEntity => workoutEntity.activities)
  @JoinColumn({ name: 'workoutId' })
  workout!: Relation<WorkoutEntity>;

  @Column({
    type: 'integer',
    unique: true,
    nullable: false,
  })
  order!: number;
}
