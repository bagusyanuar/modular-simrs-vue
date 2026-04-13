import { existsSync, mkdirSync, writeFileSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');

const featureName = process.argv[2];
const moduleName = process.argv[3] || 'simrs';

if (!featureName) {
  console.error('❌ Error: Mohon masukkan nama fitur.');
  console.log('Contoh: node scripts/scaffold-feature.mjs unit simrs');
  process.exit(1);
}

const layers = {
  presentation: {
    base: `features/presentation/src/${moduleName}/base`,
    subfolders: ['components', 'composables'],
  },
  core: {
    base: `features/core/src/${moduleName}/base`,
  },
  infrastructure: {
    base: `features/infrastructure/src/${moduleName}/base`,
  },
};

function scaffold() {
  console.log(`🚀 Scaffolding Vertikal Fitur [${featureName}] untuk Modul [${moduleName}]...`);

  Object.entries(layers).forEach(([layerName, config]) => {
    console.log(`\n📂 Processing Layer: ${layerName.toUpperCase()}`);
    
    const featureBaseDir = path.join(rootDir, config.base, featureName);

    if (!existsSync(featureBaseDir)) {
      mkdirSync(featureBaseDir, { recursive: true });
      console.log(`✅ Created feature root: ${path.relative(rootDir, featureBaseDir)}`);
    }

    // Create subfolders if they exist (Level 2 for Presentation)
    if (config.subfolders) {
      config.subfolders.forEach(sub => {
        const subDir = path.join(featureBaseDir, sub);
        if (!existsSync(subDir)) {
          mkdirSync(subDir, { recursive: true });
          console.log(`✅ Created local helper: ${path.relative(rootDir, subDir)}`);
        }
      });
    }

    // Create root index.ts for the feature
    const rootIndexPath = path.join(featureBaseDir, 'index.ts');
    if (!existsSync(rootIndexPath)) {
        writeFileSync(rootIndexPath, `// export * from './${featureName}.model';\n`);
        console.log(`✅ Created feature barrel: ${path.relative(rootDir, rootIndexPath)}`);
    }
  });

  console.log('\n✨ Scaffolding Berhasil! Sekarang buat file Bosku di folder baru tersebut.');
}

scaffold();
