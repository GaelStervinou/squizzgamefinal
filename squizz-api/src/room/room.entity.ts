import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany } from 'typeorm';
import { User } from '../user/user.entity';
import { Quizz } from '../quizz/quizz.entity';
import { RoomStudent } from './roomStudent.entity';

@Entity()
export class Room {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar', { nullable: true })
  password: string;

  @Column()
  userLimit: number;

  @Column('boolean', { default: false })
  isStarted: boolean;

  @Column('boolean', { default: false })
  isEnded: boolean;

  @ManyToOne(type => User, user => user.rooms)
  owner: User;

  @ManyToOne(type => Quizz, quizz => quizz.rooms)
  quizz: Quizz;

  @OneToMany(type => RoomStudent, room => room.student)
  students: RoomStudent[];
}