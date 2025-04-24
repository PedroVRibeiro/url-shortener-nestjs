import { PartialType } from '@nestjs/swagger';
import { RequestUserDto } from './request-user.dto';

export class UpdateUserDto extends PartialType(RequestUserDto) {}
