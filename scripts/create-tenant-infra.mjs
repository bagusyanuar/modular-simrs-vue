import { existsSync, mkdirSync, readdirSync, statSync, writeFileSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');

const tenantName = process.argv[2];
const moduleName = process.argv[3] || 'simrs';

if (!tenantName) {
  console.error('❌ Error: Mohon masukkan nama tenant.');
  console.log('Contoh: pnpm run node scripts/create-tenant-infra.mjs rs-bunda auth');
  process.exit(1);
}

/**
 * Recursively mirrors the folder structure from base to tenant.
 */
function mirrorStructure(baseDir, targetDir) {
  if (!existsSync(baseDir)) return;

  const items = readdirSync(baseDir);

  items.forEach(item => {
    const itemPath = path.join(baseDir, item);
    const targetPath = path.join(targetDir, item);

    if (statSync(itemPath).isDirectory()) {
      if (!existsSync(targetPath)) {
        mkdirSync(targetPath, { recursive: true });
        console.log(`✅ Created directory: ${path.relative(rootDir, targetPath)}`);
      }

      const baseIndex = path.join(itemPath, 'index.ts');
      const targetIndex = path.join(targetPath, 'index.ts');
      
      if (existsSync(baseIndex) && !existsSync(targetIndex)) {
        writeFileSync(targetIndex, 'export {};\n');
        console.log(`✅ Created barrel: ${path.relative(rootDir, targetIndex)}`);
      }

      mirrorStructure(itemPath, targetPath);
    }
  });
}

function processLayer() {
  const layerName = 'infrastructure';
  const baseModulePath = path.join(rootDir, `features/${layerName}/src/${moduleName}`);
  const baseDir = path.join(baseModulePath, 'base');
  const targetDir = path.join(baseModulePath, '_tenants', tenantName);

  if (!existsSync(baseDir)) {
    console.warn(`⚠️ Warning: Folder base tidak ditemukan di layer ${layerName} module ${moduleName}`);
    return;
  }

  console.log(`\n📂 Mirroring structure for INFRASTRUCTURE...`);
  
  if (!existsSync(targetDir)) {
    mkdirSync(targetDir, { recursive: true });
  }

  const rootBaseIndex = path.join(baseDir, 'index.ts');
  const rootTargetIndex = path.join(targetDir, 'index.ts');
  if (existsSync(rootBaseIndex) && !existsSync(rootTargetIndex)) {
    writeFileSync(rootTargetIndex, 'export {};\n');
    console.log(`✅ Created root barrel: ${path.relative(rootDir, rootTargetIndex)}`);
  }

  mirrorStructure(baseDir, targetDir);
}

console.log(`🚀 Dynamic Scaffolding INFRA tenant [${tenantName}] for module [${moduleName}]...`);

try {
  processLayer();
  console.log('\n✨ Infrastructure Mirroring Berhasil!');
} catch (error) {
  console.error('❌ Terjadi kesalahan:', error.message);
  process.exit(1);
}
