import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { configService } from './config/config.service';
import {UsersModule} from "./user/user.modules";
import { AuthModule } from './auth/auth.module';
import { QuizzModule } from './quizz/quizz.module';
import { RoomModule } from './room/room.module';
import { RoomGateway } from './room/room.gateway';

@Module({
  imports: [
    TypeOrmModule.forRoot(configService.getTypeOrmConfig()),
    RoomModule,
    UsersModule,
    AuthModule,
    QuizzModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }