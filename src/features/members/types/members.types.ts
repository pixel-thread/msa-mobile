import { UserRole } from '@src/features/auth';
import { UserStatus } from '@src/shared/types/role';

export interface Member {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  membershipNumber: string | null;
  createdAt: string;
}
