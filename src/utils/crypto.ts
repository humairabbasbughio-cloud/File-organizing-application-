import { EncryptedBackupPayload } from '../types';

/**
 * Derives an AES-GCM Key from password and salt using PBKDF2
 */
async function deriveKey(password: string, salt: Uint8Array): Promise<CryptoKey> {
  const enc = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    enc.encode(password),
    'PBKDF2',
    false,
    ['deriveKey']
  );

  return crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt,
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
 * Converts ArrayBuffer / Uint8Array to Base64 string
 */
function bufferToBase64(buffer: ArrayBuffer | Uint8Array): string {
  const bytes = buffer instanceof Uint8Array ? buffer : new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

/**
 * Converts Base64 string to Uint8Array
 */
function base64ToBuffer(base64: string): Uint8Array {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

/**
 * Compute SHA-256 checksum of string or object
 */
export async function computeChecksum(dataStr: string): Promise<string> {
  const enc = new TextEncoder();
  const hashBuffer = await crypto.subtle.digest('SHA-256', enc.encode(dataStr));
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Encrypt arbitrary JSON serializable object using AES-256-GCM and user password
 */
export async function encryptBackupData(
  data: any,
  password: string,
  createdBy: string
): Promise<EncryptedBackupPayload> {
  const jsonStr = JSON.stringify(data);
  const enc = new TextEncoder();
  const plainText = enc.encode(jsonStr);

  const salt = crypto.getRandomValues(new Uint8Array(16));
  const iv = crypto.getRandomValues(new Uint8Array(12));

  const key = await deriveKey(password, salt);

  const encryptedBuffer = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    key,
    plainText
  );

  const checksum = await computeChecksum(jsonStr);

  return {
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    createdBy,
    algorithm: 'AES-256-GCM',
    salt: bufferToBase64(salt),
    iv: bufferToBase64(iv),
    cipherText: bufferToBase64(encryptedBuffer),
    checksum,
  };
}

/**
 * Decrypt AES-256-GCM backup payload with password
 */
export async function decryptBackupData(
  payload: EncryptedBackupPayload,
  password: string
): Promise<any> {
  try {
    const salt = base64ToBuffer(payload.salt);
    const iv = base64ToBuffer(payload.iv);
    const cipherText = base64ToBuffer(payload.cipherText);

    const key = await deriveKey(password, salt);

    const decryptedBuffer = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv },
      key,
      cipherText
    );

    const dec = new TextDecoder();
    const jsonStr = dec.decode(decryptedBuffer);

    // Verify SHA-256 checksum
    const calculatedChecksum = await computeChecksum(jsonStr);
    if (calculatedChecksum !== payload.checksum) {
      console.warn('Backup checksum mismatch!');
    }

    return JSON.parse(jsonStr);
  } catch (err) {
    throw new Error('Decryption failed. Please verify your password and backup file integrity.');
  }
}
