import { UserRole } from "@src/features/auth";

export const HIGH_ROLE_USERS: UserRole[] = ['SUPER_ADMIN', 'PRESIDENT', 'SECRETARY'];

export const hasHighRoleAccess = (role?: UserRole): boolean => {
  if (!role) return false;
  return HIGH_ROLE_USERS.includes(role);
};
