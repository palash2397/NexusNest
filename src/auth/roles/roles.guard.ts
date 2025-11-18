import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
} from '@nestjs/common';
import { ApiResponse } from '../../utils/ApiResponse'; // adjust path

@Injectable()
export class RoleGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();

    const user = request.user;

    console.log('User Role:', user?.role);

    if (user?.role !== 'admin') {
      throw new ForbiddenException(
        new ApiResponse(401, {}, 'Access is forbidden'),
      );
    }

    return true;
  }
}
