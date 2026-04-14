---
trigger: auto
match: ["features/**/*", "apps/**/*", "packages/**/*"]
---

### 📖 SIMRS Domain Vocabulary

- **SIMRS**: Sistem Informasi Manajemen Rumah Sakit.
- **Tenant**: Rumah Sakit / Instansi klien yang menggunakan sistem.
- **Base**: Core logic atau standar yang berlaku untuk semua tenant.
- **Override**: Modifikasi atau penambahan fitur spesifik untuk tenant tertentu.
- **Resolver**: Mekanisme Vite plugin untuk menentukan file mana yang diload (Base vs Tenant).
