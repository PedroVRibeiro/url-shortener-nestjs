import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Redirect,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UrlsService } from './urls.service';
import { ShortUrlRequestDto } from './dtos/short-url-request.dto';
import { ShortUrlResponseDto } from './dtos/short-url-response.dto';
import { AuthGuard } from '@nestjs/passport';
import { User } from 'src/common/decorators/user.decorator';
import { UpdateShortUrlDto } from './dtos/update-short-url.dto';
import { OptionalJwtAuthGuard } from 'src/common/guards/optional-jwt-auth.guard';

@ApiTags('URLS')
@Controller('urls')
export class UrlsController {
  constructor(private readonly urlsService: UrlsService) {}

  @ApiBearerAuth('jwt')
  @UseGuards(OptionalJwtAuthGuard)
  @ApiOperation({
    summary: 'Creates a new shortened URL',
  })
  @ApiResponse({
    status: 201,
    description: 'Shortened URL successfully created',
    type: ShortUrlResponseDto,
  })
  @Post()
  async create(
    @User('id') userId: string | undefined,
    @Body() createUrlDto: ShortUrlRequestDto,
  ): Promise<ShortUrlResponseDto> {
    const shortenedUrl = await this.urlsService.create(createUrlDto, userId);

    return new ShortUrlResponseDto({
      ...shortenedUrl,
    });
  }

  @ApiBearerAuth('jwt')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({
    summary: 'Get the user`s list of shortened URLs',
  })
  @ApiResponse({
    status: 200,
    description: 'Return the user`s list of shortened URLs',
    type: ShortUrlResponseDto,
  })
  @Get()
  async listUrls(@User('id') userId: string): Promise<ShortUrlResponseDto[]> {
    const shortenedUrlsList = await this.urlsService.findAllByUser(userId);

    return shortenedUrlsList.map(
      (url) =>
        new ShortUrlResponseDto({
          ...url,
        }),
    );
  }

  @ApiBearerAuth('jwt')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({
    summary: 'Update an URL',
  })
  @ApiResponse({
    status: 200,
    description: 'Update the user`s given URL',
    type: ShortUrlResponseDto,
  })
  @Put(':id')
  async update(
    @User('id') userId: string,
    @Param('id') urlId: string,
    @Body() updateUrlDto: UpdateShortUrlDto,
  ): Promise<ShortUrlResponseDto> {
    const updatedUrl = await this.urlsService.update(
      userId,
      urlId,
      updateUrlDto,
    );

    return new ShortUrlResponseDto({
      ...updatedUrl,
    });
  }

  @ApiBearerAuth('jwt')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Delete a URL' })
  @ApiResponse({
    status: 200,
    description: 'URL deleted',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'URL deleted',
        },
      },
    },
  })
  @Delete(':id')
  async remove(@User('id') userId: string, @Param('id') urlDd: string) {
    return await this.urlsService.remove(userId, urlDd);
  }

  @ApiResponse({ status: 302, description: 'Redirect to original URL' })
  @ApiOperation({ summary: 'Redirects the browser to the original URL' })
  @Redirect()
  @Get(':code')
  async redirectUrl(@Param('code') code: string) {
    const originalUrl = await this.urlsService.redirect(code);

    return { url: originalUrl };
  }
}
