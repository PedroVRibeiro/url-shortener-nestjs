import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class RequestUserDto {
  @ApiProperty({ type: 'string', format: 'email' })
  @IsEmail()
  email: string;

  @ApiProperty({ type: 'string', minLength: 8, default: '11111111' })
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  password: string;
}
