import { InjectRepository } from '@nestjs/typeorm';
import { Url } from './entities/url.entity';
import { IsNull, Repository } from 'typeorm';
import { ShortUrlRequestDto } from './dtos/short-url-request.dto';
import { UrlShortenerService } from 'src/services/shortener/url-shortener.service';
import { UpdateShortUrlDto } from './dtos/update-short-url.dto';
import { GoneException, NotFoundException } from '@nestjs/common';

export class UrlsService {
  constructor(
    @InjectRepository(Url)
    private urlsRepository: Repository<Url>,
    private readonly shortenerService: UrlShortenerService,
  ) {}

  async create(
    shortUrlRequestDto: ShortUrlRequestDto,
    userId?: string,
  ): Promise<Url> {
    const { originalUrl, expiresAt } = shortUrlRequestDto;

    const code = this.shortenerService.generateCodeFromHash(
      shortUrlRequestDto.originalUrl,
      6,
      userId ?? null,
    );

    const url = this.urlsRepository.create({
      originalUrl: originalUrl,
      code,
      shortUrl: `http://localhost:${3000}/short/${code}`,
      expiresAt: expiresAt,
      userId: userId ?? undefined,
    });

    return await this.urlsRepository.save(url);
  }

  async findAllByUser(userId: string): Promise<Url[]> {
    return await this.urlsRepository.find({
      where: { userId, deleted_at: undefined },
    });
  }

  async update(
    userId: string,
    urlId: string,
    updateShortUlrDto: UpdateShortUrlDto,
  ) {
    const url = await this.urlsRepository.findOne({
      where: {
        id: urlId,
        userId,
        deleted_at: IsNull(),
      },
    });

    if (!url) {
      throw new NotFoundException('URL not found');
    }

    Object.assign(url, updateShortUlrDto);
    return this.urlsRepository.save(url);
  }

  async remove(userId: string, urlId: string): Promise<void> {
    const url = await this.urlsRepository.findOne({
      where: {
        id: urlId,
        userId,
        deleted_at: IsNull(),
      },
    });

    if (!url) {
      throw new NotFoundException('URL not found');
    }

    await this.urlsRepository.save({
      id: urlId,
      deleted_at: new Date(),
    });
  }

  async redirect(code: string): Promise<string> {
    const url = await this.urlsRepository.findOne({
      where: {
        code,
        deleted_at: IsNull(),
      },
    });

    if (!url) {
      if (!url) {
        throw new NotFoundException('URL not found');
      }
    }

    if (url.expiresAt && new Date() > url.expiresAt) {
      throw new GoneException('The shortened URL has expired');
    }

    url.accesses += 1;
    await this.urlsRepository.save(url);

    return url.originalUrl;
  }
}
