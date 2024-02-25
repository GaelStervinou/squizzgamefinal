import {
    OnGatewayConnection,
    OnGatewayDisconnect,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { QuizzService } from './quizz.service';
import { Quizz } from './quizz.entity';
import { UseGuards } from '@nestjs/common';
import { SocketAuthGuard } from '../auth/socket.auth.guard';
import { Roles } from '../decorators/Roles';

@WebSocketGateway({
    cors: true,
    namespace: 'quizz',
})
export class QuizzGateway
    implements OnGatewayConnection, OnGatewayDisconnect
{
    @WebSocketServer()
    server: Server;

    constructor(
      private readonly quizzService: QuizzService,
    ) {}


    handleConnection(client: any, ...args: any[]) {
        //client.emit('old-messages', this.chatMessages);
    }
    handleDisconnect(client: any) {
    }

    @UseGuards(SocketAuthGuard)
    @SubscribeMessage('getQuizzList')
    async handleGetAll(client: Socket, payload: any): Promise<void> {
        client.emit('retrieveQuizzList',
          await this.quizzService.findAllByAuthorId(parseInt(client.data.user.sub)));
    }

    @UseGuards(SocketAuthGuard)
    @SubscribeMessage('getQuizzById')
    async handleGetOneById(client: Socket, payload: any): Promise<void> {
        client.emit("quizzById",
          await this.quizzService.findOneById(parseInt(payload.id)));
    }

    @SubscribeMessage('create')
    @UseGuards(SocketAuthGuard)
    @Roles(['teacher'])
    async handleCreate(client: Socket, payload: any): Promise<void> {
        client.emit("createdQuizz",
          await this.quizzService.create(payload.title, payload.description, payload.authorId, payload.randomizeQuestions ));
    }

    @SubscribeMessage('deleteQuizz')
    @UseGuards(SocketAuthGuard)
    @Roles(['teacher'])
    async handleDelete(client: Socket, payload: any): Promise<void> {
        client.emit("quizzDeleted",
          await this.quizzService.deleteQuizz(payload.id));
    }
}
