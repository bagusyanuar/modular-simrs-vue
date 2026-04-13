import { existsSync, readdirSync, readFileSync, rmSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');

const moduleName = process.argv[2];
const featureName = process.argv[3];
const version = process.argv[4];

if (!moduleName || !featureName || !version) {
  console.error('❌ Error: Parameter tidak lengkap.');
  console.log('Usage: pnpm create:cleanup <module> <feature> <version>');
  console.log('Example: pnpm create:cleanup simrs staff v1.0.1');
  process.exit(1);
}

// Format version ensures it starts with 'v' if not already
const formattedVersion = version.startsWith('v') ? version : `v${version}`;
const layers = ['presentation', 'core', 'infrastructure'];

function cleanup() {
  console.log(`🧹 Checking usage for [${featureName}] version [${formattedVersion}] in module [${moduleName}]...`);

  // 1. Safety Check: Verify if any tenant is still using this version
  const tenantsDir = path.join(rootDir, `features/presentation/src/${moduleName}/_tenants`);
  const activeTenantsUsingVersion = [];

  if (existsSync(tenantsDir)) {
    const tenants = readdirSync(tenantsDir, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())
      .map(dirent => dirent.name);

    tenants.forEach(tenant => {
      const manifestPath = path.join(tenantsDir, tenant, 'manifest.ts');
      if (existsSync(manifestPath)) {
        const content = readFileSync(manifestPath, 'utf-8');
        // Simple regex to detect { name: 'featureName', version: 'formattedVersion' }
        // We look for name and version in the same object block
        const regex = new RegExp(`name:\\s*['"]${featureName}['"]\\s*,\\s*version:\\s*['"]${formattedVersion}['"]`, 'g');
        
        if (regex.test(content)) {
          activeTenantsUsingVersion.push(tenant);
        }
      }
    });
  }

  if (activeTenantsUsingVersion.length > 0) {
    console.error(`\n❌ ERROR: Gagal menghapus legacy!`);
    console.error(`Versi [${formattedVersion}] masih digunakan oleh tenant berikut:`);
    activeTenantsUsingVersion.forEach(t => console.error(`   - ${t}`));
    console.error(`\nMohon update tenant-tenant di atas ke 'latest' atau versi lain sebelum menghapus archive ini.`);
    process.exit(1);
  }

  console.log(`✅ No active usage found. Proceeding with deletion...`);

  // 2. Execution: Delete the archive from all layers
  let deletedCount = 0;
  layers.forEach((layer) => {
    const targetDir = path.join(rootDir, `features/${layer}/src/${moduleName}/_archives/${featureName}/${formattedVersion}`);

    if (existsSync(targetDir)) {
      try {
        rmSync(targetDir, { recursive: true, force: true });
        console.log(`🗑️  Deleted: ${path.relative(rootDir, targetDir)}`);
        deletedCount++;
      } catch (err) {
        console.error(`❌ Failed to delete for layer ${layer}:`, err.message);
      }
    } else {
      console.log(`ℹ️  Layer ${layer}: Archive folder not found, skipping.`);
    }
  });

  if (deletedCount > 0) {
    console.log(`\n✨ Proses Cleanup Selesai! [${featureName}] ${formattedVersion} telah dihapus.`);
  } else {
    console.log(`\nℹ️ Tidak ada folder yang dihapus (mungkin folder sudah tidak ada).`);
  }
}

cleanup();
