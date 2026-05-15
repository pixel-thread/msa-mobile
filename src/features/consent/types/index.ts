export enum ConsentPurpose {
  PAYMENTS = 'PAYMENTS',
  COMMUNICATIONS = 'COMMUNICATIONS',
  MEETINGS = 'MEETINGS',
  ANALYTICS = 'ANALYTICS',
  MARKETING = 'MARKETING',
}

export enum ConsentStatus {
  GRANTED = 'GRANTED',
  WITHDRAWN = 'WITHDRAWN',
}

export type ConsentChannel = 'web' | 'mobile' | 'email';

export interface ConsentReceiptRecord {
  id: string;
  userId: string;
  purpose: ConsentPurpose;
  status: ConsentStatus;
  ipAddress: string | null;
  userAgent: string | null;
  channel: string;
  metadata: Record<string, unknown>;
  createdAt: string;
}

export interface UserConsentState {
  purpose: ConsentPurpose;
  status: ConsentStatus;
  updatedAt: string;
}

export interface MyConsentResponse {
  consentState: UserConsentState[];
  association: string;
}

export interface ConsentSummaryReport {
  purpose: ConsentPurpose;
  grantedCount: number;
  withdrawnCount: number;
  totalCount: number;
}

export interface GrantConsentRequest {
  purposes: ConsentPurpose[];
  channel?: ConsentChannel;
  metadata?: Record<string, unknown>;
}

export interface RevokeConsentRequest {
  purposes: ConsentPurpose[];
  channel?: ConsentChannel;
  metadata?: Record<string, unknown>;
}

export interface ConsentActionResponse {
  message: string;
  data: ConsentReceiptRecord[];
}