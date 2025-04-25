import { ApiProperty } from '@nestjs/swagger';
import { UserEntity } from '../entities/user.entity';

export class ResponseUserDTO {
  @ApiProperty({ type: 'string', format: 'uuid' })
  id?: string;

  @ApiProperty({ type: 'string', format: 'email' })
  email?: string;

  constructor(user: Partial<UserEntity>) {
    this.id = user.id;
    this.email = user.email;
  }
}
