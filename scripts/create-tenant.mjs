import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');

const tenantName = process.argv[2];

if (!tenantName) {
  console.error('❌ Error: Mohon masukkan nama tenant (RS).');
  console.log('Contoh: node scripts/create-tenant.mjs rs-bunda');
  process.exit(1);
}

const presentationBase = path.join(rootDir, 'features/presentation/src/simrs');
const tenantDir = path.join(presentationBase, '_tenants', tenantName);
const appsSimrsDir = path.join(rootDir, 'apps/simrs');

function scaffold() {
  console.log(`🚀 Scaffolding tenant baru di layer Presentation: ${tenantName}...`);

  // 1. Buat folder structure
  const folders = [
    tenantDir,
    path.join(tenantDir, 'routes'),
    path.join(tenantDir, 'pages'),
    path.join(tenantDir, 'components'),
  ];

  folders.forEach(dir => {
    if (!existsSync(dir)) {
      mkdirSync(dir, { recursive: true });
      console.log(`✅ Created directory: ${path.relative(rootDir, dir)}`);
    }
  });

  // 2. Buat manifest.ts (Copy dari base)
  const baseManifestPath = path.join(presentationBase, 'base', 'manifest.ts');
  const tenantManifestPath = path.join(tenantDir, 'manifest.ts');
  
  if (existsSync(baseManifestPath)) {
    const content = readFileSync(baseManifestPath, 'utf-8')
      .replace('Base Product', `Tenant: ${tenantName}`)
      .replace('default di SIMRS', `khusus ${tenantName}`);
    writeFileSync(tenantManifestPath, content);
    console.log(`✅ Created: ${path.relative(rootDir, tenantManifestPath)}`);
  }

  // 3. Buat boilerplate extra routes
  const modules = ['unit', 'staff'];
  modules.forEach(mod => {
    const extraRoutePath = path.join(tenantDir, 'routes', `${mod}.extra.ts`);
    const content = `import type { RouteRecordRaw } from 'vue-router';

/**
 * Extension Point - ${mod.toUpperCase()} Module (${tenantName})
 * Tambahkan rute eksklusif yang hanya ada di tenant ini.
 */
export const ${mod}ExtraRoutes: RouteRecordRaw[] = [];
`;
    writeFileSync(extraRoutePath, content);
    console.log(`✅ Created: ${path.relative(rootDir, extraRoutePath)}`);
  });

  // 4. Buat .env.[tenant] di apps/simrs
  const envPath = path.join(appsSimrsDir, `.env.${tenantName}`);
  const envContent = `VITE_TENANT=${tenantName}
`;
  writeFileSync(envPath, envContent);
  console.log(`✅ Created: ${path.relative(rootDir, envPath)}`);

  console.log('\n✨ Onboarding Berhasil!');
  console.log(`\nJalankan dengan perintah:`);
  console.log(`pnpm dev:simrs --mode ${tenantName}`);
}

scaffold();
