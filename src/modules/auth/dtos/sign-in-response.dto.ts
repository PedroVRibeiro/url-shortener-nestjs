import { ApiProperty } from '@nestjs/swagger';
import { UserEntity } from 'src/modules/users/entities/user.entity';

export class SignInResponseDto {
  @ApiProperty({
    type: UserEntity,
    readOnly: true,
  })
  user: UserEntity;

  @ApiProperty({
    type: 'string',
    format: 'jwt',
    readOnly: true,
  })
  token: string;
}
