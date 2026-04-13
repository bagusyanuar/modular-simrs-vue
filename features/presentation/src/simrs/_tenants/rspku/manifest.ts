/**
 * Master Manifest - RS PKU
 * Kustomisasi modul yang aktif untuk tenant RS PKU.
 */
export const activeModules = [
  'unit',
  'staff',
  'billing',
  // RS PKU bisa nambah modul baru di sini jika ada
];

export const activeModulesVersioned = [
  {
    name: 'unit',
    version: '1.0.0',
  },
  {
    name: 'staff',
    version: '1.0.0',
  },
  {
    name: 'billing',
    version: '1.0.0',
  },
];

export const schemaVersion = 1;
