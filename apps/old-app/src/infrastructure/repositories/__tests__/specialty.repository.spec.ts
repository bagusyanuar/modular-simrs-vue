import { describe, it, expect, vi } from 'vitest';
import { http, HttpResponse } from 'msw';
import { server } from './setup';
import { ApiSpecialtyRepository } from '../specialty.repository';

describe('ApiSpecialtyRepository', () => {
  const repo = new ApiSpecialtyRepository();
  const baseURL = (import.meta.env.VITE_GLOBAL_API_BASE_URL as string) || '';

  it('should fetch specialties correctly', async () => {
    // 1. Mock the API Response
    server.use(
      http.get(`${baseURL}/specialties`, () => {
        return HttpResponse.json({
          status: 'success',
          data: [
            {
              id: '1',
              code: 'SP001',
              name: 'Bedah Umum',
              created_at: '2024-01-01',
              updated_at: '2024-01-01',
            },
          ],
        });
      })
    );

    // 2. Call the repository method
    const result = await repo.find({});

    // 3. Assertions
    expect(result).toHaveLength(1);
    expect(result[0]!.id).toBe('1');
    expect(result[0]!.name).toBe('Bedah Umum');
  });

  it('should fetch single specialty by id', async () => {
    server.use(
      http.get(`${baseURL}/specialties/1`, () => {
        return HttpResponse.json({
          status: 'success',
          data: {
            id: '1',
            code: 'SP001',
            name: 'Bedah Umum',
            created_at: '2024-01-01',
            updated_at: '2024-01-01',
          },
        });
      })
    );

    const result = await repo.findById('1');
    expect(result.id).toBe('1');
    expect(result.name).toBe('Bedah Umum');
  });

  it('should handle 404 error correctly', async () => {
    server.use(
      http.get(`${baseURL}/specialties/999`, () => {
        return new HttpResponse(null, { status: 404 });
      })
    );

    // Silence console.error for expected error
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    await expect(repo.findById('999')).rejects.toThrow();

    expect(consoleSpy).toHaveBeenCalled();
  });
});
