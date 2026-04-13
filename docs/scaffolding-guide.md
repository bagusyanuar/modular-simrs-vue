# 🛠️ Scaffolding & Archiving Guide

Dokumentasi ini menjelaskan cara mengelola fitur dalam arsitektur **Modular Multi-Tenant SIMRS**.

## 1. Membuat Fitur Baru (Vertical Slice)

Untuk membuat kerangka fitur baru secara otomatis di ketiga layer (Core, Infra, Presentation), gunakan perintah:

```bash
pnpm create:feature [nama-fitur] [nama-modul]
```

*Contoh:* `pnpm create:feature unit simrs`

### Apa yang Terbentuk?
- **Core**: Folder flat untuk logic bisnis.
- **Infrastructure**: Folder flat untuk implementation & repositories.
- **Presentation**: Folder hybrid (Level 2) yang berisi:
  - `index.ts` (Entry point)
  - `components/` (Laci UI)
  - `composables/` (Laci Logika UI)

---

## 2. Membuat Arsip Versi (Legacy Snapshot)

Jika Bosku ingin "membekukan" versi fitur tertentu (misal sebelum melakukan update besar), gunakan perintah:

```bash
pnpm create:archive [nama-modul] [nama-fitur] [versi]
```

*Contoh:* `pnpm create:archive simrs staff v1.1.0`

### Cara Kerjanya:
- Script akan menyalin seluruh folder fitur dari `base` ke folder `_archives/[fitur]/[versi]` di semua layer.
- Versi asli di folder `base` tetap ada dan bisa lanjut dikembangkan.
- Gunakan folder `_archives` ini sebagai referensi untuk tenant yang ingin dikunci versinya.

---

## 3. Mengatur Versi Tenant

Setelah melakukan `create:archive`, Bosku bisa mengatur versi mana yang aktif untuk tiap tenant di file `manifest.ts` masing-masing:

```typescript
// features/presentation/src/simrs/_tenants/rspku/manifest.ts
export const activeModules = [
  { name: 'unit', version: '1.0.0' }, // Menggunakan versi arsip
  { name: 'staff', version: 'latest' }, // Menggunakan versi terbaru di base
];
```

## Prinsip Penting:
1. **Vertical Slice**: Satu fitur, satu nafas di semua layer.
2. **No Conflict**: Gunakan `_archives` untuk pemisahan data lama agar folder `base` tetap bersih.
3. **Automated**: Gunakan script scaffolder agar struktur folder selalu konsisten dan sesuai standar arsitektur.
