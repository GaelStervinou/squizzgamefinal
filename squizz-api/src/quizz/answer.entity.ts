import { Entity, Column, PrimaryGeneratedColumn, Unique, ManyToOne, Index } from 'typeorm';
import { Question } from './question.entity';

@Entity()
@Unique(['answer', 'question'])
@Index(['answer', 'question'], { unique: true })
export class Answer {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  answer: string;

  @Column()
  isCorrect: boolean;

  @ManyToOne(type => Question, question => question.answers)
  question: Question;
}