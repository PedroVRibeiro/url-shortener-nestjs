import { UrlShortenerService } from './url-shortener.service';
import { createHash } from 'crypto';

describe('UrlShortenerService', () => {
  let urlShortenerService: UrlShortenerService;

  beforeEach(() => {
    urlShortenerService = new UrlShortenerService();
  });

  describe('generateCodeFromHash', () => {
    it('should generate a code with the specified length', () => {
      const originalUrl = 'https://example.com';
      const length = 8;

      const code = urlShortenerService.generateCodeFromHash(
        originalUrl,
        length,
      );

      expect(code).toHaveLength(length);
    });

    it('should generate different codes for different inputs', () => {
      const url1 = 'https://example1.com';
      const url2 = 'https://example2.com';
      const length = 8;

      const code1 = urlShortenerService.generateCodeFromHash(url1, length);
      const code2 = urlShortenerService.generateCodeFromHash(url2, length);

      expect(code1).not.toEqual(code2);
    });

    it('should generate different codes even for the same URL at different times', async () => {
      const url = 'https://example.com';
      const length = 8;

      const code1 = urlShortenerService.generateCodeFromHash(url, length);
      await new Promise((resolve) => setTimeout(resolve, 10)); // Pequeno delay para mudar o timestamp
      const code2 = urlShortenerService.generateCodeFromHash(url, length);

      expect(code1).not.toEqual(code2);
    });

    it('should include userId in the hash generation if provided', () => {
      const url = 'https://example.com';
      const length = 8;
      const userId = 'user-123';

      const codeWithUserId = urlShortenerService.generateCodeFromHash(
        url,
        length,
        userId,
      );
      const codeWithoutUserId = urlShortenerService.generateCodeFromHash(
        url,
        length,
        null,
      );

      expect(codeWithUserId).not.toEqual(codeWithoutUserId);
    });
  });

  describe('base62Encode', () => {
    it('should encode a buffer to a non-empty string', () => {
      const buffer = createHash('sha256').update('test').digest();

      // Acesso ao método privado simulando via casting
      const base62 = (urlShortenerService as any).base62Encode(buffer);

      expect(typeof base62).toBe('string');
      expect(base62.length).toBeGreaterThan(0);
    });

    it('should return "0" when the buffer represents zero', () => {
      const zeroBuffer = Buffer.alloc(32, 0); // Um buffer de 32 bytes com tudo 0

      const base62 = (urlShortenerService as any).base62Encode(zeroBuffer);

      expect(base62).toBe('0');
    });
  });
});
