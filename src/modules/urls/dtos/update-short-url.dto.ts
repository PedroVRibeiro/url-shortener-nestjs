import { ApiProperty, PartialType } from '@nestjs/swagger';
import { ShortUrlRequestDto } from './short-url-request.dto';
import { IsDate, IsOptional, IsUrl, MinDate } from 'class-validator';
import { Transform } from 'class-transformer';

export class UpdateShortUrlDto extends PartialType(ShortUrlRequestDto) {
  @IsOptional()
  @ApiProperty({ type: 'string', format: 'url', example: 'https://google.com' })
  @IsUrl()
  originalUrl?: string;

  @ApiProperty({
    type: 'string',
    description: 'Date in ISO 8601 format. Minimum date is now.',
    format: 'date-time',
    example: '2025-04-24T23:59:59Z',
    required: false,
  })
  @IsOptional()
  @Transform(({ value }: { value: string }) =>
    value ? new Date(value) : undefined,
  )
  @IsDate()
  @MinDate(new Date(), {
    message:
      'The date must be greater than or equal to the current date. Date is UTC',
  })
  expiresAt?: string;
}
