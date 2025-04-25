import { ApiProperty } from '@nestjs/swagger';
import { UserEntity } from '../entities/user.entity';

export class ResponseUserDTO {
  @ApiProperty({
    type: 'string',
    format: 'uuid',
    example: '7f716bde-4c67-4d87-9c5b-1d5f5e8d6f3d',
  })
  id?: string;

  @ApiProperty({ type: 'string', format: 'email', example: 'user@example.com' })
  email?: string;

  @ApiProperty({ type: 'string', example: 'USER' })
  role?: string;

  constructor(user: Partial<UserEntity>) {
    this.id = user.id;
    this.email = user.email;
    this.role = user.role;
  }
}
