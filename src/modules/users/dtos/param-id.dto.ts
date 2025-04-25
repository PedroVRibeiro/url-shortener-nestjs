import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class ParamIdDto {
  @ApiProperty({
    type: 'string',
    format: 'uuid',
    example: '4aa3d45e-ee9b-4464-992f-f9dcb26a3b27',
    description: 'UUID v4 identifier',
  })
  @IsUUID('4', { message: 'The ID must be a valid UUID v4.' })
  id: string;
}
