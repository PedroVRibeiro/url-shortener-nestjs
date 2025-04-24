import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { BaseTimeStampEntity } from 'src/config/database/base-entity';
import { Entity, Column } from 'typeorm';

@Entity('users')
export class UserEntity extends BaseTimeStampEntity {
  @ApiProperty({ type: 'string', format: 'email' })
  @Column()
  email: string;

  @Column()
  @Exclude()
  password: string;
}
