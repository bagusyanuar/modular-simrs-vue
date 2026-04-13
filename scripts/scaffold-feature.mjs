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
    subfolders: ['pages', 'routes', 'components'],
  },
  core: {
    base: `features/core/src/${moduleName}/base`,
    subfolders: ['domains', 'usecases', 'repositories'],
  },
  infrastructure: {
    base: `features/infrastructure/src/${moduleName}/base`,
    subfolders: ['repositories', 'mappers', 'providers', 'schemas', 'keys'],
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

    config.subfolders.forEach(sub => {
      const subDir = path.join(featureBaseDir, sub);
      if (!existsSync(subDir)) {
        mkdirSync(subDir, { recursive: true });
        console.log(`✅ Created directory: ${path.relative(rootDir, subDir)}`);
      }

      // Create index.ts for barrel export
      const indexPath = path.join(subDir, 'index.ts');
      if (!existsSync(indexPath)) {
        writeFileSync(indexPath, '// export * from \'./...\';\n');
        console.log(`✅ Created barrel: ${path.relative(rootDir, indexPath)}`);
      }
    });

    // Create root index.ts for the feature
    const rootIndexPath = path.join(featureBaseDir, 'index.ts');
    if (!existsSync(rootIndexPath)) {
        const exports = config.subfolders.map(sub => `export * from './${sub}';`).join('\n');
        writeFileSync(rootIndexPath, `${exports}\n`);
        console.log(`✅ Created root feature barrel: ${path.relative(rootDir, rootIndexPath)}`);
    }
  });

  console.log('\n✨ Scaffolding Berhasil! Sekarang pindahkan file Bosku ke folder baru tersebut.');
}

scaffold();
