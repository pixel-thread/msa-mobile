import { UserRole } from '@src/shared/types/role';

export const TRAINING_ADMIN_ROLES: UserRole[] = ['SUPER_ADMIN', 'DPO', 'SECRETARY'];

export const canManageTraining = (role?: UserRole[]): boolean => {
  if (!role) return false;
  return TRAINING_ADMIN_ROLES.some((r) => role.includes(r));
};

export const canViewAllCompletions = (role?: UserRole[]): boolean => {
  if (!role) return false;
  return TRAINING_ADMIN_ROLES.some((r) => role.includes(r));
};

export const canViewTrainingModules = (role?: UserRole[]): boolean => {
  return !!role && role.length > 0;
};