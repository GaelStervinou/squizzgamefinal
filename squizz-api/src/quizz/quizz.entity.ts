import { Entity, Column, PrimaryGeneratedColumn, Unique, RelationId, ManyToOne, OneToMany } from 'typeorm';
import { User } from '../user/user.entity';
import { Question } from './question.entity';
import { Room } from '../room/room.entity';

@Entity()
export class Quizz {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @Unique(['title'])
  title: string;

  @Column()
  description: string;

  @Column()
  randomizeQuestions: boolean;

  @ManyToOne(type => User, user => user.quizzs)
  author: User;

  @OneToMany(type => Question, question => question.quizz)
  questions: Question[];

  @OneToMany(type => Room, room => room.quizz)
  rooms: Room[];
}