import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInRequestDto } from './dtos/sign-in-request.dto';
import { SignInResponseDto } from './dtos/sign-in-response.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('AUTH')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiOperation({ summary: 'Sign In' })
  @ApiResponse({
    status: 200,
    description: 'Return the user and token',
    type: SignInResponseDto,
  })
  @Post('signin')
  async signIn(@Body() signInRequest: SignInRequestDto) {
    return this.authService.signIn(signInRequest);
  }
}
