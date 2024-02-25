import { Module } from '@nestjs/common';
import { QuizzGateway } from './quizz.gateway';
import { QuizzController } from './quizz.controller';
import { QuizzService } from './quizz.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Quizz } from './quizz.entity';
import { Question } from './question.entity';
import { UsersModule } from '../user/user.modules';
import { Answer } from './answer.entity';
import { StudentAnswer } from './studentAnswer.entity';

@Module({
    imports: [
      TypeOrmModule.forFeature([Quizz]),
      TypeOrmModule.forFeature([Question]),
      TypeOrmModule.forFeature([Answer]),
      TypeOrmModule.forFeature([StudentAnswer]),
      UsersModule,
    ],
    providers: [QuizzGateway, QuizzService],
    controllers: [QuizzController],
    exports: [QuizzService],
})
export class QuizzModule {}
