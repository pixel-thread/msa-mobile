import { UserStatus, UserRole } from '@src/shared/types/role';

export interface Member {
  id: string;
  name: string;
  email: string;
  role: UserRole[];
  status: UserStatus;
  membershipNumber: string | null;
  createdAt: string;
}
