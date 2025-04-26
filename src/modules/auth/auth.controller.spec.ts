import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { SignInRequestDto } from './dtos/sign-in-request.dto';
import { SignInResponseDto } from './dtos/sign-in-response.dto';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: jest.Mocked<AuthService>;

  const mockAuthService = {
    signIn: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('signIn', () => {
    it('should call authService.signIn with correct parameters and return the response', async () => {
      const signInRequestDto: SignInRequestDto = {
        email: 'test@example.com',
        password: 'defaults',
        role: 'USER',
      };

      const response: SignInResponseDto = {
        user: {
          id: 'user-id',
          email: signInRequestDto.email,
          role: signInRequestDto.role,
        },
        token: 'mocked-jwt-token',
      };

      authService.signIn.mockResolvedValue(response);

      const result = await authController.signIn(signInRequestDto);

      expect(authService.signIn).toHaveBeenCalledWith(signInRequestDto);
      expect(result).toEqual(response);
    });
  });
});
