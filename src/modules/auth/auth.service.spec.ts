import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { SignInRequestDto } from './dtos/sign-in-request.dto';
import { NotFoundException } from '@nestjs/common';
import { compare } from 'bcrypt';
import { UserEntity } from '../users/entities/user.entity';

jest.mock('bcrypt', () => ({
  compare: jest.fn(),
}));

describe('AuthService', () => {
  let authService: AuthService;
  let usersService: jest.Mocked<UsersService>;
  let jwtService: jest.Mocked<JwtService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: {
            findByEmail: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
          },
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    usersService = module.get(UsersService);
    jwtService = module.get(JwtService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('signIn', () => {
    const signInRequestDto: SignInRequestDto = {
      email: 'test@example.com',
      password: 'defaults',
    };

    const user = {
      id: 'user-id',
      email: 'test@example.com',
      password: 'hashed-password',
    } as unknown as UserEntity;

    it('should return user and token if credentials are correct', async () => {
      usersService.findByEmail.mockResolvedValue(user);
      (compare as jest.Mock).mockResolvedValue(true);
      jwtService.sign.mockReturnValue('mocked-jwt-token');

      const result = await authService.signIn(signInRequestDto);

      expect(usersService.findByEmail).toHaveBeenCalledWith(
        signInRequestDto.email,
      );
      expect(compare).toHaveBeenCalledWith(
        signInRequestDto.password,
        user.password,
      );
      expect(jwtService.sign).toHaveBeenCalledWith({
        sub: user.id,
        email: user.email,
        role: user.role,
      });
      expect(result).toEqual({
        user: expect.any(Object),
        token: 'mocked-jwt-token',
      });
    });

    it('should throw NotFoundException if user not found', async () => {
      usersService.findByEmail.mockResolvedValue(null as unknown as UserEntity);

      await expect(authService.signIn(signInRequestDto)).rejects.toThrow(
        NotFoundException,
      );

      expect(usersService.findByEmail).toHaveBeenCalledWith(
        signInRequestDto.email,
      );
      expect(compare).not.toHaveBeenCalled();
      expect(jwtService.sign).not.toHaveBeenCalled();
    });

    it('should throw NotFoundException if password does not match', async () => {
      usersService.findByEmail.mockResolvedValue(user);
      (compare as jest.Mock).mockResolvedValue(false);

      await expect(authService.signIn(signInRequestDto)).rejects.toThrow(
        NotFoundException,
      );

      expect(usersService.findByEmail).toHaveBeenCalledWith(
        signInRequestDto.email,
      );
      expect(compare).toHaveBeenCalledWith(
        signInRequestDto.password,
        user.password,
      );
      expect(jwtService.sign).not.toHaveBeenCalled();
    });
  });
});
