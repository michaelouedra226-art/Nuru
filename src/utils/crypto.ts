/**
 * Chiffrement local Zero-Knowledge conforme aux exigences militaires et cliniques.
 * Utilisation exclusive de la Web Crypto API native (AES-GCM 256 bits + PBKDF2).
 * Aucune donnée en clair ne transite vers un réseau ou un tiers.
 */

export interface EncryptedEnvelope {
  salt: string;       // Sel cryptographique Base64
  iv: string;         // Vecteur d'initialisation 96 bits Base64
  ciphertext: string; // Données chiffrées Base64
  tagLength: number;  // Taille du tag d'intégrité (128 bits)
  v: number;          // Version du protocole (1)
}

function bufferToBase64(buffer: ArrayBuffer | Uint8Array): string {
  const bytes = buffer instanceof Uint8Array ? buffer : new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

function base64ToBuffer(base64: string): Uint8Array {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

/**
 * Dérive une clé AES-GCM 256 bits à partir du PIN et d'un sel cryptographique
 * via PBKDF2 (100 000 itérations SHA-256).
 */
async function deriveKey(pin: string, salt: Uint8Array): Promise<CryptoKey> {
  const enc = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    enc.encode(pin),
    { name: 'PBKDF2' },
    false,
    ['deriveKey']
  );

  return crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: salt as unknown as BufferSource,
      iterations: 100000,
      hash: 'SHA-256',
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
}

/**
 * Chiffre une chaîne de caractères en AES-GCM 256 bits.
 */
export async function encryptString(plaintext: string, pin: string): Promise<EncryptedEnvelope> {
  if (!crypto.subtle) {
    throw new Error('Web Crypto API non supportée dans cet environnement.');
  }

  const salt = crypto.getRandomValues(new Uint8Array(16));
  const iv = crypto.getRandomValues(new Uint8Array(12)); // 96 bits pour GCM
  const key = await deriveKey(pin, salt);

  const enc = new TextEncoder();
  const encodedPlaintext = enc.encode(plaintext);

  const cipherBuffer = await crypto.subtle.encrypt(
    {
      name: 'AES-GCM',
      iv: iv as unknown as BufferSource,
      tagLength: 128,
    },
    key,
    encodedPlaintext
  );

  return {
    salt: bufferToBase64(salt),
    iv: bufferToBase64(iv),
    ciphertext: bufferToBase64(cipherBuffer),
    tagLength: 128,
    v: 1,
  };
}

/**
 * Déchiffre une enveloppe chiffrée AES-GCM.
 * Lève une exception si le code PIN est incorrect ou si l'intégrité est compromise.
 */
export async function decryptString(envelope: EncryptedEnvelope, pin: string): Promise<string> {
  if (!crypto.subtle) {
    throw new Error('Web Crypto API non supportée dans cet environnement.');
  }

  const salt = base64ToBuffer(envelope.salt);
  const iv = base64ToBuffer(envelope.iv);
  const cipherBytes = base64ToBuffer(envelope.ciphertext);

  const key = await deriveKey(pin, salt);

  const decryptedBuffer = await crypto.subtle.decrypt(
    {
      name: 'AES-GCM',
      iv: iv as unknown as BufferSource,
      tagLength: envelope.tagLength || 128,
    },
    key,
    cipherBytes as unknown as BufferSource
  );

  const dec = new TextDecoder();
  return dec.decode(decryptedBuffer);
}
