import { Injectable, NotFoundException } from '@nestjs/common';
import { SignInResponseDto } from './dtos/sign-in-response.dto';
import { SignInRequestDto } from './dtos/sign-in-request.dto';
import { UsersService } from '../users/users.service';
import { compare } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signIn(signInRequest: SignInRequestDto): Promise<SignInResponseDto> {
    const { email, password } = signInRequest;

    const user = await this.usersService.findByEmail(email);

    if (!user) {
      throw new NotFoundException('Incorrect email or password.');
    }

    const passwordConfirmed = await compare(password, user.password);

    if (!passwordConfirmed) {
      throw new NotFoundException('Incorrect email or password.');
    }

    const token = this.jwtService.sign({ sub: user.id });

    return {
      user,
      token,
    };
  }
}
