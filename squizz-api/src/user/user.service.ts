import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';
import { NotFoundError } from 'rxjs';

const SALT_OR_ROUNDS = 10;

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
    ) {}

    findAll(): Promise<User[]> {
        return this.usersRepository.find();
    }

    findOne(id: number): Promise<User | null> {
        return this.usersRepository.findOneBy({ id });
    }

    findOneByUsername(username: string): Promise<User | null> {
        return this.usersRepository.findOneBy({ username });
    }

    async login(username: string, password: string): Promise<User | NotFoundError> {
        const user = await this.usersRepository.findOneBy({ username });
        if (user && await bcrypt.compare(password, user.password)) {
            return user;
        }
        return {
            name: 'Error',
            message: 'User not found',
        };
    }

    async remove(id: number): Promise<void> {
        await this.usersRepository.delete(id);
    }

    async create(userData: User): Promise<any> {
        userData.password = await bcrypt.hash(userData.password, SALT_OR_ROUNDS);
        return this.usersRepository.save(userData);
    }

    async update(userData: User): Promise<any> {
        return this.usersRepository.save(userData);
    }
}