/**
 * Error messages used throughout the application
 */
export const ERROR_MESSAGES = {
  // General validation errors
  INVALID_UUID: 'Invalid UUID format',
  REQUIRED_FIELDS_MISSING: 'Required fields are missing',
  INVALID_REQUEST_BODY: 'Invalid request body',
  INVALID_EMAIL: 'Invalid email format',
  INVALID_PASSWORD: 'Password does not meet requirements',
  
  // User-specific errors
  WRONG_PASSWORD: 'Password is incorrect',
  USER_ALREADY_EXISTS: 'User with this login already exists',
  
  // Not found error
  ENTITY_NOT_FOUND: 'Entity not found',
  
  // Favorites-specific errors
  ALREADY_IN_FAVORITES: 'Already added to favorites',
  NOT_IN_FAVORITES: 'Not in favorites',
  
} as const;

/**
 * Success messages used throughout the application
 */
export const SUCCESS_MESSAGES = {
  // User messages
  USER_CREATED: 'User created successfully',
  USER_UPDATED: 'User updated successfully',
  USER_DELETED: 'User deleted successfully',
  PASSWORD_UPDATED: 'Password updated successfully',
  
  // Artist messages
  ARTIST_CREATED: 'Artist created successfully',
  ARTIST_UPDATED: 'Artist updated successfully',
  ARTIST_DELETED: 'Artist deleted successfully',
  
  // Album messages
  ALBUM_CREATED: 'Album created successfully',
  ALBUM_UPDATED: 'Album updated successfully',
  ALBUM_DELETED: 'Album deleted successfully',
  
  // Track messages
  TRACK_CREATED: 'Track created successfully',
  TRACK_UPDATED: 'Track updated successfully',
  TRACK_DELETED: 'Track deleted successfully',
  
  // Favorites messages
  ADDED_TO_FAVORITES: 'Added to favorites successfully',
  REMOVED_FROM_FAVORITES: 'Removed from favorites successfully',
} as const;
