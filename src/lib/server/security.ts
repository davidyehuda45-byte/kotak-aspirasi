// Modul Pengamanan Formulir Anonim: Rate Limiting & Anti-Spam (Zero-Cost)

interface RateLimitRecord {
  count: number;
  resetAt: number;
}

// In-memory cache untuk rate limiting per IP / ID perangkat
const ipCooldownMap = new Map<string, RateLimitRecord>();

// Bersihkan rekaman kedaluwarsa secara berkala (setiap 15 menit)
const CLEANUP_INTERVAL_MS = 15 * 60 * 1000;
let lastCleanup = Date.now();

function cleanupExpiredRecords() {
  const now = Date.now();
  if (now - lastCleanup < CLEANUP_INTERVAL_MS) return;
  lastCleanup = now;

  for (const [key, record] of ipCooldownMap.entries()) {
    if (now > record.resetAt) {
      ipCooldownMap.delete(key);
    }
  }
}

/**
 * Memeriksa apakah pengirim melebihi batas pengiriman aspirasi
 * Default: Maksimal 5 pengiriman per rentang 10 menit per IP
 */
export function checkRateLimit(
  clientIdentifier: string,
  limit: number = 5,
  windowMs: number = 10 * 60 * 1000
): { allowed: boolean; retryAfterSeconds: number } {
  cleanupExpiredRecords();

  const now = Date.now();
  const existing = ipCooldownMap.get(clientIdentifier);

  if (!existing || now > existing.resetAt) {
    ipCooldownMap.set(clientIdentifier, {
      count: 1,
      resetAt: now + windowMs
    });
    return { allowed: true, retryAfterSeconds: 0 };
  }

  if (existing.count >= limit) {
    const retryAfterSeconds = Math.ceil((existing.resetAt - now) / 1000);
    return { allowed: false, retryAfterSeconds };
  }

  existing.count += 1;
  return { allowed: true, retryAfterSeconds: 0 };
}

/**
 * Memvalidasi honeypot field
 * Mengembalikan true jika valid (field kosong), false jika bot terdeteksi
 */
export function validateHoneypot(honeypotValue: unknown): boolean {
  if (typeof honeypotValue !== 'string') {
    return true;
  }
  return honeypotValue.trim().length === 0;
}
