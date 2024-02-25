import { Module } from '@nestjs/common';
import { RoomController } from './room.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Room } from './room.entity';
import { RoomService } from './room.service';
import { UsersModule } from '../user/user.modules';
import { QuizzModule } from '../quizz/quizz.module';
import { RoomGateway } from './room.gateway';
import { RoomStudent } from './roomStudent.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Room]),
    TypeOrmModule.forFeature([RoomStudent]),
    UsersModule,
    QuizzModule,
    AuthModule,
  ],
  providers: [RoomGateway, RoomService],
  controllers: [RoomController],
  exports: [RoomService],
})
export class RoomModule {}
