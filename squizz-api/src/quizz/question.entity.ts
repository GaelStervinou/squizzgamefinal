import { Entity, Column, PrimaryGeneratedColumn, Unique, RelationId, ManyToOne, OneToMany } from 'typeorm';
import { Quizz } from './quizz.entity';
import { Answer } from './answer.entity';
import { StudentAnswer } from './studentAnswer.entity';

@Entity()
export class Question {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  question: string;

  @Column()
  duration: number;

  @ManyToOne(type => Quizz, quizz => quizz.questions)
  quizz: Quizz;

  @OneToMany(type => Answer, answer => answer.question)
  answers: Answer[];

  @OneToMany(type => StudentAnswer, studentAnswer => studentAnswer.question)
  studentAnswers: StudentAnswer[];
}