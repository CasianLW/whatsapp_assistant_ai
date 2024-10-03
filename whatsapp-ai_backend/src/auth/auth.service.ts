import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { UsersService } from '../users/users.service';
import { JwtPayload } from './jwt-payoad.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * Validate a user by their email and password.
   * Returns the user object without the password field if valid.
   */
  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);

    // Check if user exists and if the password matches
    if (user && (await bcrypt.compare(password, user.password))) {
      // Convert Mongoose Document to plain JS object and exclude the password field
      const { password, ...result } = user.toObject();
      return result;
    }

    // If no match, return null
    return null;
  }

  /**
   * Create a JWT token for the user upon successful login.
   * Ensure that the JWT secret used here matches the one used in `JwtStrategy`.
   */
  async login(user: any) {
    // Construct the payload with user details
    const payload: JwtPayload = {
      email: user.email,
      sub: user._id, // Correct reference to the user's ID field
      role: user.role,
      nickname: user.nickname,
    };

    // Sign the token with the same secret defined in the `JwtModule` configuration
    return {
      access_token: this.jwtService.sign(payload, {
        secret: process.env.JWT_SECRET || 'your_secret_key', // Use the same secret for consistency
      }),
    };
  }

  /**
   * Hash the password using bcrypt with a salt of 10 rounds.
   */
  async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
  }
}
