import { describe, it, expect } from 'vitest';

describe('APIError', () => {
  it('should create an error with status code and message', async () => {
    const error = new (await import('../src/utils/APIError.js')).APIError(404, 'Not Found');
    expect(error.statusCode).toBe(404);
    expect(error.message).toBe('Not Found');
  });
});