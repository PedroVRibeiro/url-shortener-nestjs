import { Test, TestingModule } from '@nestjs/testing';
import { UrlsService } from './urls.service';
import { UrlShortenerService } from 'src/services/shortener/url-shortener.service';
import { IsNull, Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Url } from './entities/url.entity';
import { ShortUrlRequestDto } from './dtos/short-url-request.dto';
import { UpdateShortUrlDto } from './dtos/update-short-url.dto';
import { NotFoundException, GoneException } from '@nestjs/common';

const mockUrlsRepository = () => ({
  create: jest.fn(),
  save: jest.fn(),
  find: jest.fn(),
  findOne: jest.fn(),
});

const mockShortenerService = () => ({
  generateCodeFromHash: jest.fn(),
});

describe('UrlsService', () => {
  let urlsService: UrlsService;
  let urlsRepository: jest.Mocked<Repository<Url>>;
  let shortenerService: jest.Mocked<UrlShortenerService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UrlsService,
        { provide: getRepositoryToken(Url), useFactory: mockUrlsRepository },
        { provide: UrlShortenerService, useFactory: mockShortenerService },
      ],
    }).compile();

    urlsService = module.get<UrlsService>(UrlsService);
    urlsRepository = module.get(getRepositoryToken(Url));
    shortenerService = module.get(UrlShortenerService);
  });

  describe('create', () => {
    it('should create and save a new url', async () => {
      const shortUrlRequestDto: ShortUrlRequestDto = {
        originalUrl: 'http://example.com',
        expiresAt: undefined,
      };
      const generatedCode = 'abc123';
      const createdUrl = {
        id: '1',
        ...shortUrlRequestDto,
        code: generatedCode,
        shortUrl: `http://localhost:3000/short/${generatedCode}`,
      } as Url;

      shortenerService.generateCodeFromHash.mockReturnValue(generatedCode);
      urlsRepository.create.mockReturnValue(createdUrl);
      urlsRepository.save.mockResolvedValue(createdUrl);

      const result = await urlsService.create(shortUrlRequestDto, 'user-id');

      expect(shortenerService.generateCodeFromHash).toHaveBeenCalledWith(
        shortUrlRequestDto.originalUrl,
        6,
        'user-id',
      );
      expect(urlsRepository.create).toHaveBeenCalled();
      expect(urlsRepository.save).toHaveBeenCalledWith(createdUrl);
      expect(result).toEqual(createdUrl);
    });
  });

  describe('findAllByUser', () => {
    it('should return urls for a user', async () => {
      const urls = [{ id: '1' }, { id: '2' }] as Url[];
      urlsRepository.find.mockResolvedValue(urls);

      const result = await urlsService.findAllByUser('user-id');

      expect(urlsRepository.find).toHaveBeenCalledWith({
        where: { userId: 'user-id', deleted_at: undefined },
      });
      expect(result).toEqual(urls);
    });
  });

  describe('update', () => {
    it('should update an existing url', async () => {
      const updatedShortUrlDto: UpdateShortUrlDto = {
        originalUrl: 'http://updated.com',
      };
      const url = {
        id: 'url-id',
        userId: 'user-id',
        deleted_at: null,
      } as unknown as Url;

      urlsRepository.findOne.mockResolvedValue(url);
      urlsRepository.save.mockResolvedValue({
        ...url,
        ...updatedShortUrlDto,
      } as unknown as Url);

      const result = await urlsService.update(
        'user-id',
        'url-id',
        updatedShortUrlDto,
      );

      expect(urlsRepository.findOne).toHaveBeenCalled();
      expect(urlsRepository.save).toHaveBeenCalledWith(
        expect.objectContaining(updatedShortUrlDto),
      );
      expect(result).toEqual({ ...url, ...updatedShortUrlDto });
    });

    it('should throw NotFoundException if url not found', async () => {
      urlsRepository.findOne.mockResolvedValue(null);

      await expect(
        urlsService.update('user-id', 'url-id', {} as UpdateShortUrlDto),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should mark a url as deleted', async () => {
      const url = {
        id: 'url-id',
        userId: 'user-id',
        deleted_at: null,
      } as unknown as Url;

      urlsRepository.findOne.mockResolvedValue(url);
      urlsRepository.save.mockResolvedValue({} as unknown as Url);

      await urlsService.remove('user-id', 'url-id');

      expect(urlsRepository.findOne).toHaveBeenCalled();
      expect(urlsRepository.save).toHaveBeenCalledWith({
        id: 'url-id',
        deleted_at: expect.any(Date),
      });
    });

    it('should throw NotFoundException if url not found', async () => {
      urlsRepository.findOne.mockResolvedValue(null);

      await expect(urlsService.remove('user-id', 'url-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('redirect', () => {
    it('should increment access count and return originalUrl', async () => {
      const url = {
        code: 'abc123',
        originalUrl: 'http://example.com',
        accesses: 0,
        expiresAt: undefined,
        deleted_at: null,
      } as unknown as Url;

      urlsRepository.findOne.mockResolvedValue(url);
      urlsRepository.save.mockResolvedValue({
        ...url,
        accesses: 1,
      } as unknown as Url);

      const result = await urlsService.redirect('abc123');

      expect(urlsRepository.findOne).toHaveBeenCalledWith({
        where: { code: 'abc123', deleted_at: IsNull() },
      });
      expect(urlsRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({ accesses: 1 }),
      );
      expect(result).toBe('http://example.com');
    });

    it('should throw NotFoundException if url not found', async () => {
      urlsRepository.findOne.mockResolvedValue(null);

      await expect(urlsService.redirect('abc123')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw GoneException if url expired', async () => {
      const expiredUrl = {
        code: 'abc123',
        originalUrl: 'http://example.com',
        accesses: 0,
        expiresAt: new Date(Date.now() - 1000),
      } as Url;

      urlsRepository.findOne.mockResolvedValue(expiredUrl);

      await expect(urlsService.redirect('abc123')).rejects.toThrow(
        GoneException,
      );
    });
  });
});
