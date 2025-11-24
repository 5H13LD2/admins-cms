export const DIFFICULTY_LEVELS = {
  EASY: 'EASY',
  NORMAL: 'NORMAL',
  HARD: 'HARD',
} as const;

export const ASSESSMENT_TYPES = {
  CODE_FIX: 'code_fix',
  SQL_QUERY: 'sql_query',
} as const;

export const USER_STATUS = {
  ONLINE: 'online',
  OFFLINE: 'offline',
} as const;

export const ASSESSMENT_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
} as const;

export const DIFFICULTY_COLORS = {
  EASY: 'text-green-600 bg-green-100',
  Easy: 'text-green-600 bg-green-100',
  NORMAL: 'text-yellow-600 bg-yellow-100',
  Medium: 'text-yellow-600 bg-yellow-100',
  HARD: 'text-red-600 bg-red-100',
  Hard: 'text-red-600 bg-red-100',
} as const;
