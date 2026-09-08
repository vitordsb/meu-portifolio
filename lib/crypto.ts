import { scrypt, randomBytes, timingSafeEqual } from "crypto";
import { promisify } from "util";

// Assíncrono de propósito: `scryptSync` trava o event loop por ~100ms a cada
// chamada, então uma rajada de logins derrubava o servidor inteiro junto.
const scryptAsync = promisify(scrypt) as (
  password: string,
  salt: string,
  keylen: number,
) => Promise<Buffer>;

const KEY_LENGTH = 64;

export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16).toString("hex");
  const hash = await scryptAsync(password, salt, KEY_LENGTH);
  return `${salt}:${hash.toString("hex")}`;
}

export async function verifyPassword(password: string, stored: string): Promise<boolean> {
  const [salt, hash] = stored.split(":");
  if (!salt || !hash) return false;

  const storedBuffer = Buffer.from(hash, "hex");
  // `timingSafeEqual` lança quando os tamanhos diferem, e um hash corrompido no
  // banco viraria erro 500 em vez de "senha inválida".
  if (storedBuffer.length !== KEY_LENGTH) return false;

  const inputHash = await scryptAsync(password, salt, KEY_LENGTH);
  return timingSafeEqual(storedBuffer, inputHash);
}

/**
 * Queima o mesmo tempo de um `verifyPassword` sem verificar nada.
 *
 * Serve para o caso "usuário não existe": sem isso, a resposta volta na hora e
 * dá pra descobrir quais usuários existem só cronometrando o login.
 */
export async function fakePasswordWork(): Promise<void> {
  await scryptAsync("senha-que-nao-existe", "0".repeat(32), KEY_LENGTH);
}
