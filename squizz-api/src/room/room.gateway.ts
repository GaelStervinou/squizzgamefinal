import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { RoomService } from './room.service';
import { Room } from './room.entity';
import { Server } from 'socket.io';
import { UseGuards } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { AuthService } from '../auth/auth.service';
import { SocketAuthGuard } from '../auth/socket.auth.guard';
import { QuizzService } from '../quizz/quizz.service';
import { RoomStudent } from './roomStudent.entity';
import { Question } from '../quizz/question.entity';
import { Roles } from '../decorators/Roles';

@WebSocketGateway({
  cors: true,
  namespace: 'room',
})
export class RoomGateway
  implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private room: Room;
  private students: RoomStudent[];

  constructor(
    private readonly roomService: RoomService,
    private readonly quizService: QuizzService,
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {
  }


  @UseGuards(SocketAuthGuard)
  async handleConnection(client: any, ...args: any[]) {
    /*console.log(client, args);
    //TODO check les middlewares pour socket io
    const payload = this.authService.verify(
      client.handshake.headers.authorization,
    );
    const user = await this.userService.findOne(payload.userId);

    !user && client.disconnect();
    console.log(args);
    this.room = await this.roomService.getRoom(args[0]);
    if (null === this.room) {
      throw new UnprocessableEntityException('Room not found');
    }
    this.students = await this.roomService.getStudents(this.room.id);
    if (this.students.length >= this.room.userLimit) {
      throw new UnprocessableEntityException('Room is full');
    }
    console.log('client connected : ', client.id);
    const newStudent = await this.userService.findOne(args[1]);
    if (null === newStudent) {
      throw new UnprocessableEntityException('User not found');
    }
    if (args[2] !== this.room?.password) {
      throw new UnprocessableEntityException('Wrong password');
    }
    if (this.students.find((s) => s.id === newStudent.id)) {
      await this.roomService.updateClientId(this.room.id, newStudent.id, client.id);
    } else {
      await this.roomService.addStudent(this.room.id, newStudent);
      this.students.push(newStudent);
    }

    this.server.emit('handle-connection', 'ok');*/
  }

  handleDisconnect(client: any) {
    console.log('client disconnected : ', client.id);
    //this.clients = this.clients.filter((c) => c.id !== client.id);
  }

  @SubscribeMessage('joinRoom')
  @UseGuards(SocketAuthGuard)
  async handleJoinRoom(client: any, payload: any): Promise<void> {
    try {
      await this.roomService.addStudent(payload.roomId, client.id, client.data.user, payload.password);
    } catch (e) {
      client.emit('joinedRoom', { error: e.message });
      return;
    }

    const quizz = await this.quizService.findOneByRoomId(parseInt(payload.roomId));
    client.emit('joinedRoom', { success: true, data: quizz });
  }

  @SubscribeMessage('getAllRooms')
  @UseGuards(SocketAuthGuard)
  async handleGetAll(client: any, payload: any): Promise<void> {
    client.emit('retieveAllRooms', await this.roomService.findAllByOwnerId(payload));
  }

  @SubscribeMessage('start')
  @UseGuards(SocketAuthGuard)
  @Roles(['teacher'])
  async handleStart(client: any, payload: any): Promise<void> {
    this.room = await this.roomService.start(payload.id, client.data.user.sub);
    this.students = await this.roomService.getStudents(this.room.id);

    this.students.forEach((student) => {
      this.server.to(student.clientId).emit('roomStart', this.room);
    });

    client.emit('roomStart', this.room);

    const quizz = await this.quizService.findOneByRoomId(this.room.id);
    const questions = quizz.questions;

    for (let i = 0; i < questions.length; i++) {
      await this.sendQuestionToParticipants(questions[i]);
    }

    await this.roomService.endRoom(this.room.id);
    this.students.forEach((student) => {
      this.server.to(student.clientId).emit('roomEnd', this.room);
    });
    client.emit('roomEnd', this.room);
  }

  async sendQuestionToParticipants(question: Question) {
    this.students = await this.roomService.getStudents(this.room.id);
    const payload = {
      question,
      roomId: this.room.id,
    };

    this.students.forEach((student) => {
      this.server.to(student.clientId).emit('nextQuestion', payload);
    });
    let timer = question.duration;
    await new Promise((resolve) => {
      const countdownInterval = setInterval(() => {
        this.server.emit('timer', timer);
        timer--;
        if (timer < 0) {
          clearInterval(countdownInterval);
          resolve(null);
        }
      }, 1000);
    });
  }

  @SubscribeMessage('answer')
  @UseGuards(SocketAuthGuard)
  async handleAnswer(client: any, payload: any): Promise<void> {
    const quizz = await this.quizService.findOneByRoomId(payload.roomId);
    if (null === quizz) {
      client.emit('answerResponse', { error: 'Quizz not found' });
      return;
    }
    const question = quizz.questions.find((q) => q.id === payload.questionId);
    if (undefined === question) {
      client.emit('answerResponse', { error: 'Question not found' });
      return;
    }
    const student = await this.userService.findOne(client.data.user.sub);
    if (null === student) {
      client.emit('answerResponse', { error: 'Student not found' });
      return;
    }
    const answer = question.answers.find((a) => a.id === payload.answerId);
    if (undefined === answer) {
      client.emit('answerResponse', { error: 'Answer not found' });
      return;
    }
    await this.roomService.answerQuestion(question, student, answer, payload.roomId);

    const correctAnswer = question.answers.find((a) => a.isCorrect);
    client.emit('answerResponse', {
      correctAnswer,
      isGood: correctAnswer.id === answer.id,
    });
  }

  @SubscribeMessage('getScore')
  @UseGuards(SocketAuthGuard)
  async handleGetScore(client: any, payload: any): Promise<void> {
    const score = await this.roomService.getStudentScore(client.data.user.sub, payload.roomId);
    const quizz = await this.quizService.findOneByRoomId(this.room.id);
    const questions = quizz.questions;
    client.emit('score', score + ' / ' + questions.length);
  }

  @SubscribeMessage('getScores')
  @UseGuards(SocketAuthGuard)
  @Roles(['teacher'])
  async handleGetScores(client: any, payload: any): Promise<void> {
    const students = await this.roomService.getStudents(payload.roomId);
    const scores = [];
    const quizz = await this.quizService.findOneByRoomId(this.room.id);
    const questions = quizz.questions;
    for (const student of students) {
      const score = await this.roomService.getStudentScore(student.student.id, payload.roomId);
      scores.push({ student, score: score });
    }
    client.emit('scores', { scores, total: questions.length, roomId: payload.roomId });
  }
}
