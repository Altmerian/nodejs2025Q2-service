/**
 * Error messages used throughout the application
 */
export const ERROR_MESSAGES = {
  WRONG_PASSWORD: 'Old password is incorrect',
  USER_ALREADY_EXISTS: 'User with this login already exists',
} as const;

/**
 * Creates specific entity not found messages using template literals
 */
export const getEntityNotFoundMessage = (entityType: 'User' | 'Artist' | 'Album' | 'Track', id: string) =>
  `${entityType} with id ${id} not found`;

/**
 * Creates specific entity success messages using template literals
 */
export const getEntitySuccessMessage = (
  entityType: 'User' | 'Artist' | 'Album' | 'Track',
  action: 'created' | 'updated' | 'deleted',
  id: string,
) => `${entityType} with id ${id} ${action} successfully`;
