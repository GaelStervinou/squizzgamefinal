import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { IS_PUBLIC_KEY } from '../decorators/PublicRoute';
import { WsException } from '@nestjs/websockets';
import { jwtConstants } from './constants';
import { User } from '../user/user.entity';

@Injectable()
export class SocketAuthGuard implements CanActivate {
  constructor(private jwtService: JwtService, private reflector: Reflector) { }

  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {

    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      // 💡 See this condition
      return true;
    }

    const token = context
      .switchToWs()
      .getClient()
      .handshake.headers.authorization;

    if (!token) {
      throw new WsException('Unauthorized');
    }

    try {
      // 💡 We're assigning the payload to the request object here
      // so that we can access it in our route handlers
      context.switchToWs().getClient().data.user = await this.jwtService.verifyAsync(
        token,
        {
          secret: jwtConstants.secret
        }
      );
    } catch {
      throw new WsException('Unauthorized');
    }

    return true;
  }
}