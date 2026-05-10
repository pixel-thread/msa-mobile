export const REGEX = {
  NAME: /^[a-zA-Z\s'-]+$/,
  EMAIL: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  PASSWORD_STRONG:
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/,
  PASSWORD_UPPER: /[A-Z]/,
  PASSWORD_LOWER: /[a-z]/,
  PASSWORD_DIGIT: /\d/,
  PASSWORD_SPECIAL: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/,
  PHONE: /^\+?[1-9]\d{1,14}$/,
  URL: /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/,
  ALPHANUMERIC: /^[a-zA-Z0-9]+$/,
  ONLY_LETTERS: /^[a-zA-Z]+$/,
  ONLY_NUMBERS: /^\d+$/,
  HEX_COLOR: /^#?([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$/,
  USERNAME: /^[a-zA-Z0-9_-]{3,20}$/,
  POSTAL_CODE_US: /^\d{5}(-\d{4})?$/,
  POSTAL_CODE_UK: /^[a-zA-Z]{1,2}\d[a-zA-Z\d]?\s?\d[a-zA-Z]{2}$/,
  UUID: /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
} as const;

export const MESSAGES = {
  NAME: 'Name can only contain letters, spaces, hyphens, and apostrophes',
  EMAIL: 'Please enter a valid email address',
  PASSWORD_STRONG:
    'Password must be at least 8 characters with uppercase, lowercase, number, and special character',
  PHONE: 'Please enter a valid phone number',
  URL: 'Please enter a valid URL',
  ALPHANUMERIC: 'Only letters and numbers are allowed',
  ONLY_LETTERS: 'Only letters are allowed',
  ONLY_NUMBERS: 'Only numbers are allowed',
  HEX_COLOR: 'Please enter a valid hex color code',
  USERNAME:
    'Username must be 3-20 characters and contain only letters, numbers, hyphens, and underscores',
  POSTAL_CODE: 'Please enter a valid postal code',
  UUID: 'Please enter a valid UUID',
} as const;
