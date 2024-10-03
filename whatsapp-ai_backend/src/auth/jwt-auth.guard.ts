import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  handleRequest(err, user, info, context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    // const authHeader = request.headers['authorization'];

    // console.log('JwtAuthGuard - Authorization Header:', authHeader); // Log the Authorization header
    // console.log('JwtAuthGuard - Error:', err); // Log any error encountered
    // console.log('JwtAuthGuard - User:', user); // Log the user object

    // If JWT is missing or invalid
    if (err || !user) {
      //   console.log('JwtAuthGuard - JWT is missing or invalid:', info); // Log the missing or invalid JWT
      throw new UnauthorizedException('JWT is missing or invalid'); // Throw an exception to terminate the request
    }

    return user;
  }
}
