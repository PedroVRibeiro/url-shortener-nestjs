import { Exclude } from 'class-transformer';
import { BaseTimeStampEntity } from 'src/config/database/base-entity';
import { Url } from 'src/modules/urls/entities/url.entity';
import { Entity, Column, OneToMany } from 'typeorm';

@Entity('users')
export class UserEntity extends BaseTimeStampEntity {
  @Column()
  email: string;

  @Column()
  @Exclude()
  password: string;

  @Exclude()
  @Column({ type: 'varchar', default: 'USER' })
  role: string;

  @OneToMany(() => Url, (url) => url.user, { nullable: true })
  urls: Url[];
}
