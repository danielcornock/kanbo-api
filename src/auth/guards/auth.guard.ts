import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { verify } from 'jsonwebtoken';
import { jwtSecret } from '../../config/env/env';
import { IParams } from 'src/config/interfaces/params.interface';
import { AuthService } from '../service/auth.service';
import { promisify } from '../../shared/utilties/utilities';
import { IUser } from '../model/user';

@Injectable()
export class AuthGuard implements CanActivate {
  private readonly _authService: AuthService;

  constructor(authService: AuthService) {
    this._authService = authService;
  }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();

    return this._authenticate(request);
  }

  private async _authenticate(request: any): Promise<boolean> {
    const token = this._checkForJwt(request.headers.authorization);

    const jwtVerify = promisify(verify);

    let decoded: IParams;
    try {
      decoded = await jwtVerify(token, jwtSecret);
    } catch {
      return false;
    }

    return this._attachUser(decoded.id, request);
  }

  private _checkForJwt(auth: string): string {
    let token: string;

    if (auth && auth.startsWith('Bearer')) {
      token = auth.split(' ')[1];
    }

    if (!token) {
      throw new UnauthorizedException(
        'You are not logged in. Please log in to continue.',
      );
    }

    return token;
  }

  private async _attachUser(id: string, request: any): Promise<boolean> {
    let user: IUser;

    try {
      user = await this._authService.fetchUser({ _id: id });
      if (!user) {
        throw new NotFoundException('This user no longer exists!');
      }

      request.user = user;
      return true;
    } catch {
      throw new InternalServerErrorException();
    }
  }
}
