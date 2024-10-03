import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { UsersService } from '../users/users.service';
import { JwtPayload } from './jwt-payoad.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly usersService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // Extract JWT token from the Authorization header
      ignoreExpiration: false, // Token will not be accepted if it is expired
      secretOrKey: process.env.JWT_SECRET || 'your_secret_key', // Use your secret key or from environment variable
    });
  }

  async validate(payload: JwtPayload) {
    const user = await this.usersService.findByEmail(payload.email); // Fetch user from database
    if (!user) {
      throw new UnauthorizedException();
    }
    return { userId: user._id, email: user.email }; // Return the necessary user info
  }
}
