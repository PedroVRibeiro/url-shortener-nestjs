import { PartialType } from '@nestjs/swagger';
import { RequestUserDto } from './request-user.dto';
import { IsOptional, MinLength } from 'class-validator';

export class UpdateUserDto extends PartialType(RequestUserDto) {
  @IsOptional()
  @MinLength(8, {
    message: 'Password must be at least 8 characters long',
  })
  password?: string;
}
