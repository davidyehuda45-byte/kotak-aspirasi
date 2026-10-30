import { randomBytes, createHash } from 'node:crypto';

// Format kode rahasia: KAS-XXXX-XXXX (menggunakan karakter alfanumerik yang mudah dibaca tanpa ambigu seperti 0/O, 1/I)
const CHARSET = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';

export function generateSecretCode(): string {
  const bytes = randomBytes(8);
  let part1 = '';
  let part2 = '';

  for (let i = 0; i < 4; i++) {
    part1 += CHARSET[bytes[i] % CHARSET.length];
  }
  for (let i = 4; i < 8; i++) {
    part2 += CHARSET[bytes[i] % CHARSET.length];
  }

  return `KAS-${part1}-${part2}`;
}

export function generatePublicReference(): string {
  const bytes = randomBytes(3);
  let ref = '';
  for (let i = 0; i < 4; i++) {
    ref += CHARSET[bytes[i % 3] % CHARSET.length];
  }
  return `ASP-${ref}`;
}

// SHA-256 salted hash untuk token rahasia pelacakan
const PEPPER = process.env.TOKEN_PEPPER || 'kotak-aspirasi-school-salt-2026';

export function hashSecretToken(token: string): string {
  const normalized = token.trim().toUpperCase().replace(/[^A-Z0-9-]/g, '');
  return createHash('sha256')
    .update(`${PEPPER}:${normalized}`)
    .digest('hex');
}

export function verifySecretToken(token: string, hashed: string): boolean {
  const computed = hashSecretToken(token);
  return computed === hashed;
}
