import { Entity, Index, ManyToOne, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { Question } from './question.entity';
import { Answer } from './answer.entity';
import { User } from '../user/user.entity';
import { Room } from '../room/room.entity';

@Entity()
@Unique(['question', 'room', 'user'])
@Index(['question', 'room', 'user'], { unique: true })
export class StudentAnswer {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(type => Question, question => question.studentAnswers)
  question: Question;

  @ManyToOne(type => Answer)
  answer: Answer;

  @ManyToOne(type => User)
  user: User;

  @ManyToOne(type => Room)
  room: Room;
}