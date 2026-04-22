# Unit Testing Strategy - Modular SIMRS

Strategi pengujian unit (unit testing) untuk memastikan kualitas kode dan stabilitas logika bisnis dalam ekosistem Modular SIMRS.

## 1. Tooling & Framework
- **Framework**: [Vitest](https://vitest.dev/) (Native Vite-ready, fast, and feature-rich).
- **Environment**: Node.js (untuk Core & Infrastructure).
- **Assertion**: Vitest built-in matchers (Jest-compatible).

## 2. Layered Testing Strategy
Sesuai dengan arsitektur Clean DDD yang dianut, testing dibagi menjadi beberapa layer utama:

### 2.1 Domain & Use Cases (@genrs/core)
- **Fokus Utama**: Validasi aturan bisnis dan alur kerja (use cases).
- **Strategi**: Mocking Repository. Kita mengisolasi use case dari dunia luar (API/DB) menggunakan Dependency Injection.
- **Goal**: Memastikan "Apa" yang dilakukan sistem sudah benar.
- **Lokasi**: File `.spec.ts` diletakkan bersampingan dengan file `.usecases.ts`.

### 2.2 Infrastructure Implementation (@genrs/infrastructure)
- **Fokus Utama**: Validasi pemetaan data (Mappers) dan kontrak API.
- **Strategi**: Mocking HTTP Client (Axios/Fetch/GHttp).
- **Goal**: Memastikan "Bagaimana" sistem berkomunikasi dengan pihak luar tidak merusak format data.
- **Lokasi**: File `.spec.ts` diletakkan bersampingan dengan mappers atau repository implementation.

### 2.3 Store & UI Logic (@genrs/presentation)
- **Fokus Utama**: State management (Pinia) dan logika komponen yang kompleks.
- **Strategi**: Vue Test Utils + Vitest Mocking.
- **Goal**: Memastikan state aplikasi berubah sesuai aksi user.

## 3. Analogi & Contoh Ekspektasi (Expectations)

Setiap layer memiliki fokus pengujian yang berbeda, sehingga hal yang kita "pastikan" (assert) juga berbeda.

### 3.1 Contoh di `@genrs/core` (Behavioral Test)
Fokus: **"Apakah perintahnya benar?"**
Kita memastikan interaksi antara Use Case dan Repository berjalan sesuai rencana.

```typescript
// unit.usecases.spec.ts
it('harus memanggil repository.find dengan parameter yang benar', async () => {
  const params = { keyword: 'Bed' };
  await usecase.execute(params);
  
  // Expectation: Memastikan fungsi di-call dengan argumen yang pas
  expect(mockRepo.find).toHaveBeenCalledWith(params);
});
```

### 3.2 Contoh di `@genrs/infrastructure` (Mapping Test)
Fokus: **"Apakah barangnya benar?"**
Kita memastikan transformasi data dari API ke Domain Model akurat.

```typescript
// unit.mapper.spec.ts
it('harus mengubah "kd_unit" dari API menjadi "code" di domain model', () => {
  const apiResponse = { kd_unit: 'U001', nama: 'IGD' };
  const result = mapper.toDomain(apiResponse);
  
  // Expectation: Memastikan akurasi nilai data
  expect(result.code).toBe('U001');
  expect(result.name).toBe('IGD');
});
```

## 4. Mocking & Dependency Injection
Kunci dari testability di GenRS adalah penggunaan **Dependency Injection**.
- Setiap Use Case menerima Repository Interface di constructor.
- Di dalam test, kita membuat `MockRepository` yang mengimplementasikan interface tersebut.

Contoh Mocking sederhana:
```typescript
const mockRepository = {
  find: vi.fn().mockResolvedValue([...])
} as unknown as UnitRepository;
```

## 4. Folder Structure & Naming
Gunakan konvensi penamaan yang konsisten untuk memudahkan penemuan test:
- Source: `unit.usecases.ts`
- Test: `unit.usecases.spec.ts`

Lokasi file test disarankan berada di folder yang sama dengan source code demi prinsip **Co-location** (lebih mudah dimaintain).

## 5. Menjalankan Test
Gunakan Turbo untuk menjalankan test secara paralel di seluruh workspace:
```bash
# Menjalankan semua test
pnpm test

# Menjalankan test di package tertentu
pnpm run test --filter=@genrs/core
```

---
> [!TIP]
> Prioritaskan testing pada `core` terlebih dahulu karena di situlah "otak" aplikasi berada. Testing pada infra bisa ditambahkan jika logic pemetaan (mapper) dirasa cukup kompleks.
