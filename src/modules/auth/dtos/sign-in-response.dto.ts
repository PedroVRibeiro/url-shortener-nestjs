import { ApiProperty } from '@nestjs/swagger';
import { ResponseUserDTO } from 'src/modules/users/dtos/response-user.dto';
import { UserEntity } from 'src/modules/users/entities/user.entity';

export class SignInResponseDto {
  @ApiProperty({
    type: UserEntity,
    readOnly: true,
  })
  user: ResponseUserDTO;

  @ApiProperty({
    type: 'string',
    format: 'jwt',
    readOnly: true,
  })
  token: string;
}
