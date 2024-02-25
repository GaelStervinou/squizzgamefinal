import { Injectable, UnauthorizedException, UnprocessableEntityException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { User } from '../user/user.entity';
import { TypeORMError, Unique } from 'typeorm';
import { AVAILABLE_ROLES } from './constants';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private jwtService: JwtService
  ) {}

  verify(token: string): any {
    return this.jwtService.verify(token);
  }

  async signIn(username: string, password: string): Promise<any> {
    const user = await this.usersService.findOneByUsername(username);
    if (user && await bcrypt.compare(password, user.password)) {
      const payload = { sub: user.id, username: user.username, role: user.role };
      return {
        access_token: await this.jwtService.signAsync(payload),
      };
    }
    throw new UnauthorizedException();
  }

  async signUp(userData: User): Promise<any> {
    const user = await this.usersService.findOneByUsername(userData?.username);
    if (user) {
      throw new UnprocessableEntityException('Username already exists');
    }
    if (!AVAILABLE_ROLES.includes(userData?.role)) {
      throw new UnprocessableEntityException('Invalid role');
    }
    const newUser = await this.usersService.create(userData);
    const payload = { sub: newUser.id, username: newUser.username, role: newUser.role };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
