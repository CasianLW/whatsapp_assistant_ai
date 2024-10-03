import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { UsersService } from '../users/users.service';
import { JwtPayload } from './jwt-payoad.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly usersService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // Extract JWT from `Authorization` header
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'your_secret_key', // Ensure the secret matches with the JWT secret
    });
  }

  async validate(payload: JwtPayload) {
    // console.log('JwtStrategy - Received Payload:', payload); // Log to check if payload is being processed
    const user = await this.usersService.findByEmail(payload.email);

    if (!user) {
      // console.log('JwtStrategy - User not found with email:', payload.email);
      throw new UnauthorizedException('User not found');
    }

    // console.log('JwtStrategy - User validated:', user);
    return {
      userId: user._id,
      email: user.email,
      role: user.role,
      nickname: user.nickname,
    };
  }
}
