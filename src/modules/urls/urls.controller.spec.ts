import { Test, TestingModule } from '@nestjs/testing';
import { UrlsController } from './urls.controller';
import { UrlsService } from './urls.service';
import { ShortUrlRequestDto } from './dtos/short-url-request.dto';
import { Response } from 'express';
import { ShortUrlResponseDto } from './dtos/short-url-response.dto';

describe('UrlsController', () => {
  let urlsController: UrlsController;
  let urlsService: UrlsService;

  const mockUrlsService = {
    create: jest.fn(),
    findAllByUser: jest.fn(),
    redirect: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UrlsController],
      providers: [{ provide: UrlsService, useValue: mockUrlsService }],
    }).compile();

    urlsController = module.get<UrlsController>(UrlsController);
    urlsService = module.get<UrlsService>(UrlsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should call urlsService.create with correct params', async () => {
      const userId = 'user-id';
      const dto: ShortUrlRequestDto = {
        originalUrl: 'http://example.com',
        expiresAt: undefined,
      };
      const createdUrl = {
        id: '1',
        originalUrl: 'http://example.com',
        expiresAt: undefined,
      };

      mockUrlsService.create.mockResolvedValue(createdUrl);

      const result = await urlsController.create(userId, dto);

      expect(urlsService.create).toHaveBeenCalledWith(dto, userId);
      expect(result).toEqual(new ShortUrlResponseDto(createdUrl));
    });
  });

  describe('findAll', () => {
    it('should call urlsService.findAllByUser with userId', async () => {
      const userId = 'user-id';
      const urls = [{ id: '1' }, { id: '2' }];

      mockUrlsService.findAllByUser.mockResolvedValue(urls);

      const result = await urlsController.listUrls(userId);

      expect(urlsService.findAllByUser).toHaveBeenCalledWith(userId);
      expect(result).toEqual(urls);
    });
  });

  describe('redirect', () => {
    it('should call urlsService.redirect and return original URL for redirection', async () => {
      const code = 'abc123';
      const originalUrl = 'http://example.com';

      mockUrlsService.redirect.mockResolvedValue(originalUrl);

      const result = await urlsController.redirectUrl(code);

      expect(urlsService.redirect).toHaveBeenCalledWith(code);
      expect(result).toEqual({ url: originalUrl });
    });
  });
});
