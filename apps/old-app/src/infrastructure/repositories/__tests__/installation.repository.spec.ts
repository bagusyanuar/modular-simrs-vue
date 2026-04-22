import { describe, it, expect, vi } from 'vitest';
import { http, HttpResponse } from 'msw';
import { server } from './setup';
import { ApiInstallationRepository } from '../installation.repository';

describe('ApiInstallationRepository', () => {
  const repo = new ApiInstallationRepository();
  const baseURL = (import.meta.env.VITE_GLOBAL_API_BASE_URL as string) || '';

  it('should fetch installations correctly', async () => {
    server.use(
      http.get(`${baseURL}/installations`, () => {
        return HttpResponse.json({
          status: 'success',
          data: [
            {
              id: '1',
              code: 'RJ',
              name: 'Rawat Jalan',
              is_medical: true,
              is_active: true,
              created_at: '2024-01-01',
              updated_at: '2024-01-01',
            },
          ],
        });
      })
    );

    const result = await repo.find({});

    expect(result).toHaveLength(1);
    expect(result[0]!.id).toBe('1');
    expect(result[0]!.name).toBe('Rawat Jalan');
    expect(result[0]!.isMedical).toBe(true);
  });

  it('should fetch single installation by id', async () => {
    server.use(
      http.get(`${baseURL}/installations/1`, () => {
        return HttpResponse.json({
          status: 'success',
          data: {
            id: '1',
            code: 'RJ',
            name: 'Rawat Jalan',
            is_medical: true,
            is_active: true,
            created_at: '2024-01-01',
            updated_at: '2024-01-01',
          },
        });
      })
    );

    const result = await repo.findById('1');
    expect(result.id).toBe('1');
    expect(result.name).toBe('Rawat Jalan');
  });

  it('should create installation correctly', async () => {
    const form = {
      code: 'RI',
      name: 'Rawat Inap',
      isMedical: true,
      isActive: true,
    };

    server.use(
      http.post(`${baseURL}/installations`, async ({ request }) => {
        const body = await request.json();
        return HttpResponse.json({
          status: 'success',
          data: {
            id: '2',
            ...(body as object),
            created_at: '2024-01-01',
            updated_at: '2024-01-01',
          },
        });
      })
    );

    const result = await repo.create(form);
    expect(result.id).toBe('2');
    expect(result.name).toBe('Rawat Inap');
  });

  it('should handle 404 error correctly', async () => {
    server.use(
      http.get(`${baseURL}/installations/999`, () => {
        return new HttpResponse(null, { status: 404 });
      })
    );

    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    await expect(repo.findById('999')).rejects.toThrow();
    expect(consoleSpy).toHaveBeenCalled();
  });
});
