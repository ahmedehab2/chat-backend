type Errors = {
  [key: string]: string;
};

export const errMessages: Errors = {
  USER_NOT_FOUND: 'User not found',
  USER_ALREADY_EXISTS: 'User already exists',
  INVALID_CREDENTIALS: 'Invalid email or password',
  INVALID_TOKEN: 'Invalid or expired token',
  UNAUTHORIZED: 'Unauthorized access',
  FORBIDDEN: 'Forbidden access',
  INTERNAL_SERVER_ERROR: 'Internal server error',
  NOT_FOUND: 'Resource not found',
  BAD_REQUEST: 'Bad request',
  CONFLICT: 'Conflict occurred',
  VALIDATION_ERROR: 'Validation error',
  RESOURCE_ALREADY_EXISTS: 'Resource already exists.',
  RESOURCE_ALREADY_EXISTS_GRAPHQL: 'Resource already exists',
  INVALID_MESSAGE_FORMAT:
    'Invalid message format. chatId, content, and userId are required.',
  ENV_VAR_NOT_SET: 'Environment variable is not set',
};
