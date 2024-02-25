import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Room } from './room.entity';
import { UserService } from '../user/user.service';
import { QuizzService } from '../quizz/quizz.service';
import { RoomStudent } from './roomStudent.entity';
import { User } from '../user/user.entity';
import { Answer } from '../quizz/answer.entity';
import { Question } from '../quizz/question.entity';

@Injectable()
export class RoomService {
  constructor(
    @InjectRepository(Room)
    private roomRepository: Repository<Room>,
    private userService: UserService,
    private quizzService: QuizzService,
    @InjectRepository(RoomStudent)
    private roomStudentRepository: Repository<RoomStudent>,
  ) {
  }

  async create(password: string, ownerId: number, userLimit: number, quizzId: number): Promise<Room> {
    const room = new Room();
    const quizz = await this.quizzService.findOneById(quizzId);
    if (null === quizz) {
      throw new UnprocessableEntityException('Quizz not found');
    }
    if (quizz.author.id !== ownerId) {
      throw new UnprocessableEntityException('Quizz not found');
    }
    if (password?.length > 0) {
      if (password.length < 4) {
        throw new UnprocessableEntityException('Password too short. 4 characters minimum');
      }
      room.password = password;
    } else {
      room.password = null;
    }

    if (userLimit > 0) {
      if (userLimit < 2) {
        throw new UnprocessableEntityException('User limit too short. 2 users minimum');
      }
      room.userLimit = userLimit;
    } else {
      room.userLimit = null;
    }

    const owner = await this.userService.findOne(ownerId);
    if (!owner) {
      throw new UnprocessableEntityException('Owner not found');
    }
    room.owner = owner;
    return this.roomRepository.save(room);
  }

  async start(id: number, ownerId: number): Promise<Room> {
    const room = await this.roomRepository.findOne({ where: { id }, relations: ['owner'] });
    if (!room) {
      throw new UnprocessableEntityException('Room not found');
    }
    if (room.owner.id !== ownerId) {
      throw new UnprocessableEntityException('Room not found');
    }
    room.isStarted = true;
    return await this.roomRepository.save(room);
  }

  async updateClientId(roomId: number, studentId: number, clientId: string): Promise<void> {
    const room = await this.roomRepository.findOne({ where: { id: roomId } });
    if (!room) {
      throw new UnprocessableEntityException('Room not found');
    }
    const student = await this.userService.findOne(studentId);
    if (!student) {
      throw new UnprocessableEntityException('Student not found');
    }
    const roomStudent = room.students.find((s) => s.id === studentId);
    if (!roomStudent) {
      throw new UnprocessableEntityException('Student not found');
    }
    roomStudent.clientId = clientId;

    await this.roomRepository.save(room);
  }

  async addStudent(roomId: number, clientId: string, student: any, password: string): Promise<void> {
    const room = await this.roomRepository.findOne({ where: { id: roomId } });
    if (!room) {
      throw new UnprocessableEntityException('Room not found');
    }
    if (room.password && room.password !== password) {
      throw new UnprocessableEntityException('Wrong password');
    }
    if (room.isStarted) {
      throw new UnprocessableEntityException('Room already started');
    }
    student = await this.userService.findOne(student.sub);
    const roomStudent = new RoomStudent();
    roomStudent.clientId = clientId;
    roomStudent.room = room;
    roomStudent.student = student;
    await this.roomStudentRepository.save(roomStudent);
  }

  async getStudents(roomId: number): Promise<RoomStudent[]> {
    const room = await this.roomRepository.findOne({ where: { id: roomId } });
    if (!room) {
      throw new UnprocessableEntityException('Room not found');
    }
    return await this.roomStudentRepository.find({ where: { room }, relations: {
      student: true,
      } });
  }

  async getRoom(roomId: number): Promise<Room> {
    return await this.roomRepository.findOne({ where: { id: roomId } });
  }

  async findAllByOwnerId(ownerId: number): Promise<Room[]> {
    return await this.roomRepository.find({
      where: {
        owner: {
          id: ownerId,
        },
      },
      relations: ['quizz'],
    });
  }

  async answerQuestion(question: Question, student: User, answer: Answer, roomId: number): Promise<any> {
    const room = await this.roomRepository.findOne({ where: { id: roomId } });
    if (!room) {
      throw new UnprocessableEntityException('Room not found');
    }
    return await this.quizzService.answerQuestion( student, question, answer, room);
  }

  async getStudentScore(student: number, roomId: number): Promise<number> {
    const room = await this.roomRepository.findOne({ where: { id: roomId } });
    if (!room) {
      throw new UnprocessableEntityException('Room not found');
    }
    const answers = await this.quizzService.getStudentScore(student, room);

    const correctAnswers = answers.filter((answer) => answer.answer.isCorrect === true);
    return correctAnswers.length;
  }

  async endRoom(roomId: number): Promise<void> {
    const room = await this.roomRepository.findOne({ where: { id: roomId } });
    if (!room || room.isEnded) {
      throw new UnprocessableEntityException('Room not found');
    }
    room.isEnded = true;
    await this.roomRepository.save(room);
  }

  async getAllAnswersByQuestion(question: Question, roomId: number): Promise<any> {
    const room = await this.roomRepository.findOne({ where: { id: roomId } });
    if (!room) {
      throw new UnprocessableEntityException('Room not found');
    }
    return await this.quizzService.getAllAnswersByQuestion(question, room);
  }
}
