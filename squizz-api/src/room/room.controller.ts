import { Body, Controller, HttpCode, HttpStatus, Post, Request, UseGuards } from '@nestjs/common';
import { RoomService } from './room.service';
import { Roles } from '../decorators/Roles';
import { RolesGuard } from '../auth/roles.guard';

@Controller('room')
export class RoomController {
  constructor(private roomService: RoomService) {}

  @HttpCode(HttpStatus.CREATED)
  @Post()
  @Roles(['teacher'])
  @UseGuards(RolesGuard)
  create(@Body() roomData: Record<string, any>, @Request() req: any) {
    return this.roomService.create(roomData?.password, req.user.sub, roomData?.userLimit, roomData?.quizzId);
  }
}
