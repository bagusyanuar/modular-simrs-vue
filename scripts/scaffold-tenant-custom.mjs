import { existsSync, mkdirSync, writeFileSync, readFileSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');

const tenantName = process.argv[2];
const featureName = process.argv[3];
const moduleName = process.argv[4] || 'simrs';

if (!tenantName || !featureName) {
  console.error('❌ Error: Mohon masukkan nama tenant dan nama fitur.');
  console.log('Usage: pnpm create:custom <tenant-name> <feature-name> [module-name]');
  console.log('Example: pnpm create:custom rspku unit simrs');
  process.exit(1);
}

const layers = ['presentation', 'core', 'infrastructure'];

function scaffold() {
  console.log(`🚀 Scaffolding Customization for Tenant: [${tenantName}] - Feature: [${featureName}]...`);

  layers.forEach((layer) => {
    console.log(`\n📂 Processing Layer: ${layer.toUpperCase()}`);
    
    // Path: features/[layer]/src/[module]/_tenants/[tenant]/[feature]
    const featureBase = path.join(rootDir, `features/${layer}/src/${moduleName}`, '_tenants', tenantName, featureName);

    if (!existsSync(featureBase)) {
      mkdirSync(featureBase, { recursive: true });
      console.log(`✅ Created custom root: ${path.relative(rootDir, featureBase)}`);
    }

    // Layer Specific Scaffolding
    if (layer === 'presentation') {
      // 1. Create extra.routes.ts boilerplate
      const extraRoutesPath = path.join(featureBase, 'extra.routes.ts');
      if (!existsSync(extraRoutesPath)) {
        const template = `import type { RouteRecordRaw } from 'vue-router';

/**
 * Extension Point - ${featureName.toUpperCase()} Module (${tenantName.toUpperCase()})
 * Menambahkan rute eksklusif yang hanya ada di tenant ini.
 */
export const ${featureName}ExtraRoutes: RouteRecordRaw[] = [
  // {
  //   path: '/${featureName}/custom-page',
  //   component: () => import('./pages/CustomPage.vue'),
  // },
];
`;
        writeFileSync(extraRoutesPath, template);
        console.log(`✅ Created boilerplate: extra.routes.ts`);
      }
    }

    // Create Barrel index.ts for all layers
    const indexPath = path.join(featureBase, 'index.ts');
    if (!existsSync(indexPath)) {
      writeFileSync(indexPath, `export * from './extra.routes';\n`);
      console.log(`✅ Created barrel: index.ts`);
    } else if (layer !== 'presentation') {
        // For Core & Infra, we might not have extra.routes so default barrel
        writeFileSync(indexPath, `// Export tenant-specific overrides here\n`);
    }
  });

  console.log(`\n✨ Customization Scaffold Berhasil!`);
  console.log(`Silakan mulai ngoding di: features/presentation/src/${moduleName}/_tenants/${tenantName}/${featureName}/`);
}

scaffold();
