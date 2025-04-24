import { UserEntity } from '../entities/user.entity';

export class ResponseUserDTO {
  id?: string;
  email?: string;

  constructor(user: Partial<UserEntity>) {
    this.id = user.id;
    this.email = user.email;
  }
}
