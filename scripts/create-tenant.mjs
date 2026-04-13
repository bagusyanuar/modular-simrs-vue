import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');

const tenantName = process.argv[2];

if (!tenantName) {
  console.error('❌ Error: Mohon masukkan nama tenant.');
  console.log('Usage: pnpm create:tenant <tenant-name>');
  console.log('Example: pnpm create:tenant rs-taman-sari');
  process.exit(1);
}

const layers = ['presentation', 'core', 'infrastructure'];
const moduleName = 'simrs'; // Default module

function scaffold() {
  console.log(`🚀 Unified Scaffolding for Tenant: [${tenantName}]...`);

  // 1. Setup Layers
  layers.forEach((layer) => {
    console.log(`\n📂 Processing Layer: ${layer.toUpperCase()}`);
    
    const layerBase = path.join(rootDir, `features/${layer}/src/${moduleName}`);
    const tenantDir = path.join(layerBase, '_tenants', tenantName);

    if (!existsSync(tenantDir)) {
      mkdirSync(tenantDir, { recursive: true });
      console.log(`✅ Created tenant root: ${path.relative(rootDir, tenantDir)}`);
    }

    // Special logic for Presentation: Create helper folders and Manifest
    if (layer === 'presentation') {
      const helperFolders = ['components', 'composables'];
      helperFolders.forEach(sub => {
        const subDir = path.join(tenantDir, sub);
        if (!existsSync(subDir)) {
          mkdirSync(subDir, { recursive: true });
        }
      });
      console.log(`✅ Created local helper folders (Level 2).`);

      // CREATE MANIFEST (SMART CLONE FROM BASE)
      const baseManifestPath = path.join(layerBase, 'base/manifest.ts');
      const tenantManifestPath = path.join(tenantDir, 'manifest.ts');

      if (existsSync(baseManifestPath)) {
        const content = readFileSync(baseManifestPath, 'utf-8');
        
        // Transform the content to include tenant name in comments
        const newContent = content
            .replace(/Master Manifest - Base Product/, `Master Manifest - Tenant: ${tenantName}`)
            .replace(/default di SIMRS/, `khusus ${tenantName}`);
        
        writeFileSync(tenantManifestPath, newContent);
        console.log(`✅ Created smart manifest: ${path.relative(rootDir, tenantManifestPath)}`);
      }
    } else {
      // For Core & Infra: Add .gitkeep if empty to allow tracking
      const gitKeepPath = path.join(tenantDir, '.gitkeep');
      if (!existsSync(gitKeepPath)) {
        writeFileSync(gitKeepPath, '');
        console.log(`✅ Created .gitkeep for layer ${layer}.`);
      }
    }
  });

  // 2. Setup Environment Variable
  const appsSimrsDir = path.join(rootDir, 'apps/simrs');
  const envPath = path.join(appsSimrsDir, `.env.${tenantName}`);
  
  if (existsSync(appsSimrsDir)) {
    const envContent = `VITE_TENANT=${tenantName}
VITE_APP_TITLE="SIMRS - ${tenantName.toUpperCase().replace(/-/g, ' ')}"
`;
    writeFileSync(envPath, envContent);
    console.log(`\n✅ Created: ${path.relative(rootDir, envPath)}`);
  }

  console.log(`\n✨ Onboarding Tenant [${tenantName}] Berhasil!`);
  console.log(`\nJalankan aplikasi dengan:`);
  console.log(`pnpm dev:simrs --mode ${tenantName}\n`);
}

scaffold();
