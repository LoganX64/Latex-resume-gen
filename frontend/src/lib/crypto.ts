import { StateStorage } from 'zustand/middleware'

const DEFAULT_PASSPHRASE = import.meta.env.VITE_ENCRYPTION_KEY || 'latex-resume-gen-secure-vault-key-2026'

function bufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer)
  let binary = ''
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i])
  }
  return btoa(binary)
}

function base64ToBuffer(base64: string): ArrayBuffer {
  const binary = atob(base64)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i)
  }
  return bytes.buffer
}

async function deriveKey(passphrase: string, salt: Uint8Array): Promise<CryptoKey> {
  const encoder = new TextEncoder()
  const passphraseKey = await crypto.subtle.importKey(
    'raw',
    encoder.encode(passphrase),
    { name: 'PBKDF2' },
    false,
    ['deriveKey']
  )

  return crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: salt.buffer as ArrayBuffer,
      iterations: 100000,
      hash: 'SHA-256',
    },
    passphraseKey,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  )
}

export interface EncryptedPayload {
  enc: true
  v: 1
  salt: string
  iv: string
  data: string
}

/**
 * Encrypts a string using Web Crypto API (AES-GCM).
 */
export async function encryptData(data: string, passphrase: string = DEFAULT_PASSPHRASE): Promise<string> {
  if (typeof window === 'undefined' || !window.crypto || !window.crypto.subtle) {
    return data
  }

  const encoder = new TextEncoder()
  const salt = crypto.getRandomValues(new Uint8Array(16))
  const iv = crypto.getRandomValues(new Uint8Array(12))

  const key = await deriveKey(passphrase, salt)
  const encryptedBuffer = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    key,
    encoder.encode(data)
  )

  const payload: EncryptedPayload = {
    enc: true,
    v: 1,
    salt: bufferToBase64(salt.buffer),
    iv: bufferToBase64(iv.buffer),
    data: bufferToBase64(encryptedBuffer),
  }

  return JSON.stringify(payload)
}

/**
 * Decrypts an encrypted payload string back to plain text.
 * Returns raw string if it is not an encrypted payload (for backwards compatibility).
 */
export async function decryptData(encryptedString: string, passphrase: string = DEFAULT_PASSPHRASE): Promise<string> {
  if (typeof window === 'undefined' || !window.crypto || !window.crypto.subtle) {
    return encryptedString
  }

  try {
    const parsed = JSON.parse(encryptedString)
    if (!parsed || parsed.enc !== true || !parsed.salt || !parsed.iv || !parsed.data) {
      // Unencrypted legacy data
      return encryptedString
    }

    const salt = new Uint8Array(base64ToBuffer(parsed.salt))
    const iv = new Uint8Array(base64ToBuffer(parsed.iv))
    const encryptedData = base64ToBuffer(parsed.data)

    const key = await deriveKey(passphrase, salt)
    const decryptedBuffer = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv },
      key,
      encryptedData
    )

    const decoder = new TextDecoder()
    return decoder.decode(decryptedBuffer)
  } catch {
    // If parsing or decryption fails, return as unencrypted fallback
    return encryptedString
  }
}

/**
 * Custom encrypted storage adapter for Zustand persist middleware.
 */
export const encryptedStorage: StateStorage = {
  getItem: async (name: string): Promise<string | null> => {
    const value = localStorage.getItem(name)
    if (!value) return null
    return await decryptData(value)
  },
  setItem: async (name: string, value: string): Promise<void> => {
    const encrypted = await encryptData(value)
    localStorage.setItem(name, encrypted)
  },
  removeItem: async (name: string): Promise<void> => {
    localStorage.removeItem(name)
  },
}
