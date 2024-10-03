import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';

@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    // console.log('AdminGuard - User:', user); // Log the user object for debugging

    if (!user) {
      //   console.log(
      //     'AdminGuard - Unauthorized Access Attempt: No user found in request.',
      //   );
      throw new ForbiddenException('User is not authenticated');
    }

    // Check if the user exists and has the role of 'admin'
    if (user.role === 'admin') {
      //   console.log('AdminGuard - User is admin');
      return true;
    }

    // console.log('AdminGuard - Unauthorized Access Attempt by:', user);
    throw new ForbiddenException(
      'You do not have permissions to access this resource',
    );
  }
}
