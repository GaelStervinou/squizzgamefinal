import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Quizz } from './quizz.entity';
import { Question } from './question.entity';
import { UserService } from '../user/user.service';
import { Answer } from './answer.entity';
import { StudentAnswer } from './studentAnswer.entity';
import { Room } from '../room/room.entity';
import { User } from '../user/user.entity';

@Injectable()
export class QuizzService {
  constructor(
    @InjectRepository(Quizz)
    private quizzRepository: Repository<Quizz>,
    @InjectRepository(Question)
    private questionRepository: Repository<Question>,
    private userService: UserService,
    @InjectRepository(Answer)
    private answerRepository: Repository<Answer>,
    @InjectRepository(StudentAnswer)
    private studentAnswerRepository: Repository<StudentAnswer>,
  ) {
  }

  findOneById(id: number): Promise<Quizz | null> {
    return this.quizzRepository.findOne({
      where: {
        id: id,
      },
      relations: {
        author: true,
        questions: {
          answers: true,
        },
      },
    });
  }

  findOneByTitle(title: string): Promise<Quizz | null> {
    return this.quizzRepository.findOneBy({ title });
  }

  async findAll(): Promise<Quizz[]> {
    return await this.quizzRepository.find({
      relations: {
        author: true,
        questions: {
          answers: true,
        },
      },
    });
  }

  async findAllByAuthorId(authorId: number): Promise<Quizz[]> {
    return await this.quizzRepository.find({
      relations: {
        author: true,
        questions: {
          answers: true,
        },
      },
      where: {
        author: {
          id: authorId,
        },
      },
    });
  }

  async create(title: string, description: string, authorId: number, randomizeQuestions: boolean): Promise<any> {
    if (await this.findOneByTitle(title)) {
      throw new UnprocessableEntityException('Title already exists');
    }
    const author = await this.userService.findOne(authorId);
    if (null === author) {
      throw new UnprocessableEntityException('User not found');
    }
    return this.quizzRepository.save({ title, description, author, randomizeQuestions });
  }

  async addQuestion(quizzId: number, authorId: number, question: any): Promise<any> {
    const quizz = await this.findOneById(quizzId);
    if (null === quizz) {
      throw new UnprocessableEntityException('Quizz not found');
    }
    if (quizz.author.id !== authorId) {
      throw new UnprocessableEntityException('Quizz not found');
    }

    return this.questionRepository.save({
      quizz: quizz,
      question: question.question,
      duration: question.duration,
      answers: question.answers,
    });
  }

  async removeQuestion(quizzId: number, authorId: number, questionId: number): Promise<any> {
    const quizz = await this.findOneById(quizzId);
    if (null === quizz) {
      throw new UnprocessableEntityException('Quizz not found');
    }
    if (quizz.author.id !== authorId) {
      throw new UnprocessableEntityException('Quizz not found');
    }
    const question = quizz.questions.find(question => question.id === questionId);
    if (undefined === question) {
      throw new UnprocessableEntityException('Question not found');
    }

    await this.answerRepository.remove(question.answers);
    return this.questionRepository.remove(question);
  }

  async addAnswerToQuestion(quizzId: number, authorId: number, questionId: number, answer: string, isCorrect: boolean): Promise<any> {
    const quizz = await this.findOneById(quizzId);
    if (null === quizz) {
      throw new UnprocessableEntityException('Quizz not found');
    }
    if (quizz.author.id !== authorId) {
      throw new UnprocessableEntityException('Quizz not found');
    }
    const question = quizz.questions.find(question => question.id === questionId);
    if (undefined === question) {
      throw new UnprocessableEntityException('Question not found');
    }
    if (undefined !== question.answers.find(currentAnswer => currentAnswer.answer === answer)) {
      throw new UnprocessableEntityException('Answer already exists');
    }

    return this.answerRepository.save({ answer, isCorrect, question });
  }

  async deleteQuizz(quizzId: number): Promise<any> {
    const quizz = await this.findOneById(quizzId);
    if (null === quizz) {
      throw new UnprocessableEntityException('Quizz not found');
    }
    return this.quizzRepository.remove(quizz);
  }

  async findOneByRoomId(roomId: number): Promise<Quizz | null> {
    return this.quizzRepository.findOne({
      where: {
        rooms: {
          id: roomId,
        },
      },
      relations: {
        rooms: true,
        questions:
          {
            answers: true,
          },
      },
    });
  }

  async answerQuestion(user: User, question: Question, answer: Answer, room: Room): Promise<any> {
    return await this.studentAnswerRepository.save({ user, question, answer, room });
  }

  async getStudentScore(student: number, room: Room): Promise<StudentAnswer[]> {
    const user = await this.userService.findOne(student);

    const res =  await this.studentAnswerRepository.find(
      {
        where: {
          user: user, room: room,
        },
        relations: {
          answer: true,
        },
      });

    return res;
  }

  async getAllAnswersByQuestion(question: Question, room: Room): Promise<StudentAnswer[]> {
    return await this.studentAnswerRepository.find(
      {
        where: {
          question: question, room: room,
        },
        relations: {
          answer: true,
          user: true,
        },
      });
  }
}
