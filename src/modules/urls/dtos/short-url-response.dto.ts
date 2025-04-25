import { ApiProperty } from '@nestjs/swagger';
import { Url } from '../entities/url.entity';

export class ShortUrlResponseDto {
  @ApiProperty({ type: 'string', format: 'uuid' })
  id?: string;

  @ApiProperty({ type: 'string', format: 'url', readOnly: true })
  originalUrl?: string;

  @ApiProperty({ type: 'string', format: 'url', readOnly: true })
  code?: string;

  @ApiProperty({ type: 'string', format: 'url', readOnly: true })
  shortUrl?: string;

  @ApiProperty({ type: 'number', readOnly: true })
  accesses?: number;

  @ApiProperty({ type: 'string', format: 'date-time', readOnly: true })
  expiresAt?: Date;

  constructor(user: Partial<Url>) {
    this.id = user.id;
    this.originalUrl = user.originalUrl;
    this.code = user.code;
    this.shortUrl = user.shortUrl;
    this.accesses = user.accesses;
    this.expiresAt = user.expiresAt;
  }
}
