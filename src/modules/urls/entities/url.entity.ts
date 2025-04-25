import { Exclude } from 'class-transformer';
import { BaseTimeStampEntity } from 'src/config/database/base-entity';
import { UserEntity } from 'src/modules/users/entities/user.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

@Entity('urls')
export class Url extends BaseTimeStampEntity {
  @Column()
  originalUrl: string;

  @Column()
  code: string;

  @Column()
  shortUrl: string;

  @Column({ default: 0 })
  accesses: number;

  @Column({ type: 'timestamp', nullable: true })
  expiresAt?: Date;

  @Exclude()
  @Column({ nullable: true })
  userId?: string;

  @ManyToOne(() => UserEntity, (user) => user.urls, { nullable: true })
  @JoinColumn({ name: 'userId' })
  user: UserEntity;
}
