import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsIn,
  IsNotEmpty,
  IsString,
  MinLength,
} from 'class-validator';

export class RequestUserDto {
  @ApiProperty({ type: 'string', format: 'email' })
  @IsEmail()
  email: string;

  @ApiProperty({ type: 'string', minLength: 8, default: 'defaults' })
  @IsString()
  @IsNotEmpty()
  @MinLength(8, {
    message: 'Password must be at least 8 characters long',
  })
  password: string;

  @ApiProperty({ type: 'string', default: 'USER' })
  @IsString()
  @IsNotEmpty()
  @IsIn(['ADMIN', 'USER'], {
    message: 'Role must be either ADMIN or USER',
  })
  role: string;
}
