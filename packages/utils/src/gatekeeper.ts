/**
 * GateKeeper Utility
 * Mencegah developer mengakses aplikasi langsung via port internal atau hostname salah saat mode dev.
 * Memastikan semua akses selalu lewat Gateway (Contoh: neurovi-simulation.test:3000).
 */
export function enforceGateway(gatewayPort: number = 3000, gatewayHost?: string) {
  // Hanya aktif di mode development
  if (!import.meta.env.DEV) return;

  const currentPort = window.location.port ? parseInt(window.location.port) : 80;
  const currentHost = window.location.hostname;

  const isPortMismatch = currentPort !== gatewayPort;
  const isHostMismatch = gatewayHost && currentHost !== gatewayHost;

  if (isPortMismatch || isHostMismatch) {
    const targetHost = gatewayHost || currentHost;
    const gatewayUrl = `${window.location.protocol}//${targetHost}:${gatewayPort}${window.location.pathname}${window.location.search}${window.location.hash}`;
    
    console.warn(
      `[GateKeeper] 🔥 Access mismatch detected (${currentHost}:${currentPort}). Redirecting to Gateway (${targetHost}:${gatewayPort})...`
    );

    // Redirect paksa ke gateway
    window.location.replace(gatewayUrl);
  }
}
