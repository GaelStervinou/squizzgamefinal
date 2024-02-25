import {Controller, Get, Post, Put, Delete, Param, Body} from '@nestjs/common';
import {UserService} from './user.service';
import {User} from './user.entity';

@Controller('users')
export class UsersController {
    constructor(private readonly UserService: UserService) {
    }

    @Get()
    index(): Promise<User[]> {
        return this.UserService.findAll();
    }

    @Get(':id')
    show(@Param('id') id: string): Promise<User> {
        return this.UserService.findOne(parseInt(id));
    }

    @Post()
    async create(@Body() userData: User): Promise<any> {
        return this.UserService.create(userData);
    }

    @Put(':id')
    async update(@Param('id') id: string, @Body() userData: User): Promise<any> {
        userData.id = Number(id);
        return this.UserService.update(userData);
    }

    @Delete(':id')
    async delete(@Param('id') id: string): Promise<any> {
        return this.UserService.remove(parseInt(id));
    }

    @Post('login')
    async login(@Body() userData: User): Promise<any> {
        return this.UserService.login(userData.username, userData.password);
    }
}