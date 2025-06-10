import { v4 as uuidv4, validate as uuidValidate, version as uuidVersion } from 'uuid';

/**
 * Generates a new UUID v4
 * @returns A new UUID v4 string
 */
export function generateUuid(): string {
  return uuidv4();
}

/**
 * Validates if a string is a valid UUID v4
 * @param uuid - The string to validate
 * @returns true if the string is a valid UUID v4, false otherwise
 */
export function isValidUuidV4(uuid: string): boolean {
  return uuidValidate(uuid) && uuidVersion(uuid) === 4;
}
