import { Body, Controller, Delete, HttpCode, HttpStatus, Param, Post, Request, UseGuards } from '@nestjs/common';
import { QuizzService } from './quizz.service';
import { Roles } from '../decorators/Roles';
import { RolesGuard } from '../auth/roles.guard';

@Controller('quizz')
export class QuizzController {
  constructor(private quizzService: QuizzService) {}

  @HttpCode(HttpStatus.CREATED)
  @Post()
  @Roles(['teacher'])
  @UseGuards(RolesGuard)
  create(@Body() quizzData: Record<string, any>, @Request() req: any) {
    return this.quizzService.create(quizzData.title, quizzData.description, req.user.sub, quizzData?.options);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Post(':id/question')
  @Roles(['teacher'])
  @UseGuards(RolesGuard)
  addQuestion(@Param('id') id: string, @Body() questionData: Record<string, any>, @Request() req: any) {
    const authorId = req.user.sub;
    const question = this.quizzService.addQuestion(parseInt(id), authorId, questionData);
    question.then((res) =>
      res
    ).then((data) => {
        questionData?.answers?.forEach((answer: Record<string, any>) => {
          this.quizzService.addAnswerToQuestion(parseInt(id), authorId, data.id, answer?.answer, answer?.isCorrect).then((res) => {
          });
        });
    }
    ).catch((err) => {
      console.log('error', err);
    });
  }

  @HttpCode(HttpStatus.CREATED)
  @Delete(':id/question/:questionId')
  @Roles(['teacher'])
  @UseGuards(RolesGuard)
  deleteQuestion(@Param('id') id: string, @Param('questionId') questionId: string, @Request() req: any) {
    const authorId = req.user.sub;
    return this.quizzService.removeQuestion(parseInt(id), authorId, parseInt(questionId));
  }

  @HttpCode(HttpStatus.CREATED)
  @Post(':id/question/:questionId/answer')
  @Roles(['teacher'])
  @UseGuards(RolesGuard)
  addAnswerToQuestion(@Param('id') id: string, @Param('questionId') questionId: string, @Body() answerData: Record<string, any>, @Request() req: any) {
    const userId = req.user.sub;
    return this.quizzService.addAnswerToQuestion(parseInt(id), userId, parseInt(questionId), answerData?.answer, answerData?.isCorrect);
  }
}
