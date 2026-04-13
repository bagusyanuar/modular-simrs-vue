import { existsSync, readFileSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '../..');

const VIRTUAL_MODULE_ID = 'virtual:page-registry';
const RESOLVED_VIRTUAL_ID = `\0${VIRTUAL_MODULE_ID}`;

interface ModuleConfig {
  name: string;
  version: string;
}

/**
 * Vite Plugin for Multi-Tenant File Resolution (Versioned Edition)
 * 1. Resolves @page/* based on manifest.ts versioning
 * 2. Priorities: Tenant Extension > Legacy Folder > Base Latest
 * 3. Generates virtual:page-registry for optimal tree-shaking
 */
export function tenantResolver(moduleDir: string, tenantCode: string) {
  const REQUIRED_SCHEMA_VERSION = 1;
  const presentationBase = path.resolve(__dirname, 'src', moduleDir);

  // Cache manifest data
  let _cachedModules: ModuleConfig[] | null = null;

  function getAppVersion() {
    try {
      const pkgPath = path.resolve(rootDir, 'package.json');
      const pkg = JSON.parse(readFileSync(pkgPath, 'utf-8'));
      const baseVersion = pkg.version || '0.0.0';

      let revision = 'rev-0';
      if (tenantCode !== 'base') {
        try {
          const tenantPath = path.join(presentationBase, '_tenants', tenantCode);
          if (existsSync(tenantPath)) {
            const count = execSync(`git rev-list --count HEAD -- "${tenantPath}"`, {
              encoding: 'utf-8',
            }).trim();
            revision = `rev-${count}`;
          }
        } catch (e) {
          revision = 'rev-unknown';
        }
      }

      // Detect if any module is an archive version
      const activeModules = getActiveModules();
      const hasArchives = activeModules.some(m => m.version !== 'latest');
      const suffix = hasArchives ? '.m' : '';

      return `${baseVersion}+${tenantCode}.${revision}${suffix}`;
    } catch (e) {
      return '0.0.0-unknown';
    }
  }

  // Helper: Ambil list modul aktif (Format Baru: Object Array)
  function getActiveModules(): ModuleConfig[] {
    if (_cachedModules) return _cachedModules;

    const manifestRelativePath = tenantCode !== 'base' 
        ? `_tenants/${tenantCode}/manifest` 
        : `base/manifest`;
    
    let manifestPath = path.join(presentationBase, `${manifestRelativePath}.ts`).replace(/\\/g, '/');
    
    if (!existsSync(manifestPath)) {
        // Fallback to base manifest if tenant manifest missing
        manifestPath = path.join(presentationBase, 'base/manifest.ts').replace(/\\/g, '/');
    }

    try {
      const content = readFileSync(manifestPath, 'utf-8');
      const modules: ModuleConfig[] = [];
      
      // Regex Robust untuk menangkap { name: '...', version: '...' }
      const regex = /\{\s*name:\s*['"](.*?)['"]\s*,\s*version:\s*['"](.*?)['"]\s*\}/g;
      let match;
      while ((match = regex.exec(content)) !== null) {
        modules.push({ name: match[1], version: match[2] });
      }

      _cachedModules = modules;
      return modules;
    } catch (e) {
      console.error('[TenantResolver] Failed to parse manifest:', e);
      return [];
    }
  }

  // CORE: Resolusi path dengan kesadaran Versi
  function resolvePath(subPath: string): string | null {
    const extensions = ['.vue', '.ts'];
    
    // Tentukan Nama Fitur (Biasanya segmen pertama path)
    const parts = subPath.split('/');
    let featureName = parts[0];
    
    // Handle mapping khusus untuk routes (jika masih pakai pola lama routes/unit.routes)
    if (featureName === 'routes' || featureName === 'components') {
        featureName = parts[1]?.split('.')[0] || '';
    }

    const configs = getActiveModules();
    const config = configs.find(m => m.name === featureName);
    const version = config?.version || 'latest';

    const findInDir = (dir: string, customSubPath?: string) => {
      const targetPath = customSubPath || subPath;
      for (const ext of extensions) {
        const file = path
          .join(presentationBase, dir, targetPath.endsWith(ext) ? targetPath : `${targetPath}${ext}`)
          .replace(/\\/g, '/');
        if (existsSync(file)) return file;
      }
      return null;
    };

    // Hirarki Resolusi:
    // 1. Tenant Override (Highest Priority)
    if (tenantCode !== 'base') {
      const tenantFile = findInDir(`_tenants/${tenantCode}`);
      if (tenantFile) return tenantFile;
    }

    // 2. Legacy Archive (Jika versi spesifik diminta dan bukan 'latest')
    if (version !== 'latest') {
      // Archive structure is usually flat inside version folder, 
      // so we strip the feature name prefix (e.g., '@page/unit/Unit.vue' -> 'Unit.vue')
      const archiveSubPath = subPath.startsWith(`${featureName}/`) 
        ? subPath.replace(`${featureName}/`, '') 
        : subPath;

      const archiveFile = findInDir(`_archives/${featureName}/v${version}`, archiveSubPath);
      if (archiveFile) return archiveFile;
    }

    // 3. Base Latest (Default/Fallback)
    const baseFile = findInDir('base');
    
    // Log info if we are falling back from a specific version that wasn't found
    if (version !== 'latest' && baseFile) {
        console.warn(`[TenantResolver] ⚠️ Version "${version}" for module "${featureName}" not found in archives. Falling back to [latest].`);
    }

    return baseFile;
  }

  function validateSchema() {
    if (tenantCode === 'base') return;
    const manifestPath = path.join(presentationBase, `_tenants/${tenantCode}/manifest.ts`).replace(/\\/g, '/');
    if (!existsSync(manifestPath)) return;

    try {
      const content = readFileSync(manifestPath, 'utf-8');
      const match = content.match(/schemaVersion\s*=\s*(\d+)/);
      const version = match ? parseInt(match[1], 10) : 0;

      if (version < REQUIRED_SCHEMA_VERSION) {
        throw new Error(`[TenantResolver] ❌ Incompatible Schema Version for tenant "${tenantCode}"`);
      }
    } catch (e) {
        // Silently fail or rethrow if schema mismatch
    }
  }

  validateSchema();

  function generateRegistry(): string {
    const modules = getActiveModules();
    const imports: string[] = [];
    const entries: string[] = [];

    modules.forEach((mod, i) => {
      // Logic pencarian rute: fitur-flat (unit/unit.routes) atau legacy
      const mainPath = resolvePath(`${mod.name}/${mod.name}.routes`);
      
      if (mainPath) {
        const varName = `module_${i}`;
        imports.push(`import * as ${varName} from '${mainPath}';`);
        entries.push(`  "${mod.name}": [${varName}]`);
      }
    });

    return [
      '// Auto-generated by vite-plugin-tenant. DO NOT EDIT.',
      ...imports,
      '',
      `export const moduleLibrary = {\n${entries.join(',\n')}\n};`,
    ].join('\n');
  }

  return {
    name: 'tenant-resolver',
    config() {
      const activeModules = getActiveModules();
      const versionStr = getAppVersion();
      
      return {
        define: {
          __APP_VERSION__: JSON.stringify(versionStr),
          __TENANT_CODE__: JSON.stringify(tenantCode),
          __MANIFEST__: JSON.stringify(activeModules),
        },
      };
    },
    resolveId(id: string) {
      if (id === VIRTUAL_MODULE_ID) return RESOLVED_VIRTUAL_ID;
      if (id.startsWith('@page/')) {
        return resolvePath(id.replace('@page/', ''));
      }
    },
    load(id: string) {
      if (id === RESOLVED_VIRTUAL_ID) return generateRegistry();
    },
  };
}
