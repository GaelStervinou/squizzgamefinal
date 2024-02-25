import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, Unique } from 'typeorm';
import { User } from '../user/user.entity';
import { Quizz } from '../quizz/quizz.entity';
import { Room } from './room.entity';

@Entity()
export class RoomStudent {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @Unique(['clientId'])
  clientId: string;

  @ManyToOne(type => User, user => user.studentRooms)
  student: User;

  @ManyToOne(type => Room, room => room.students)
  room: Room;
}