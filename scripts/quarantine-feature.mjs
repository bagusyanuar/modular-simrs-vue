import { existsSync, mkdirSync, cpSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');

const moduleName = process.argv[2];
const featureName = process.argv[3];
const version = process.argv[4];

if (!moduleName || !featureName || !version) {
  console.error('❌ Error: Parameter tidak lengkap.');
  console.log('Usage: pnpm create:legacy <module> <feature> <version>');
  console.log('Example: pnpm create:legacy simrs staff v1.0.1');
  process.exit(1);
}

// Format version ensures it starts with 'v' if not already
const formattedVersion = version.startsWith('v') ? version : `v${version}`;

const layers = ['presentation', 'core', 'infrastructure'];

function quarantine() {
  console.log(`🛡️  Quarantining Fitur [${featureName}] ke Legacy [${formattedVersion}]...`);

  layers.forEach((layer) => {
    console.log(`\n📂 Processing Layer: ${layer.toUpperCase()}`);
    
    const sourceDir = path.join(rootDir, `features/${layer}/src/${moduleName}/base/${featureName}`);
    const targetDir = path.join(rootDir, `features/${layer}/src/${moduleName}/_archives/${featureName}/${formattedVersion}`);

    if (!existsSync(sourceDir)) {
      console.warn(`⚠️  Source folder not found, skipping layer ${layer}: ${path.relative(rootDir, sourceDir)}`);
      return;
    }

    if (existsSync(targetDir)) {
      console.error(`❌ Error: Folder target sudah ada! (${path.relative(rootDir, targetDir)})`);
      console.log('Mohon hapus manual atau gunakan versi lain.');
      process.exit(1);
    }

    // Create target parent directory
    mkdirSync(path.dirname(targetDir), { recursive: true });

    // Copying files recursively
    try {
      cpSync(sourceDir, targetDir, { recursive: true });
      console.log(`✅ Success: ${path.relative(rootDir, sourceDir)} -> ${path.relative(rootDir, targetDir)}`);
    } catch (err) {
      console.error(`❌ Failed to copy for layer ${layer}:`, err.message);
    }
  });

  console.log('\n✨ Proses Quarantine Selesai! Versi Legacy Berhasil Dibuat.');
}

quarantine();
