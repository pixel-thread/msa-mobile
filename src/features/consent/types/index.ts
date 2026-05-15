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

export interface ConsentReceipt {
  id: string;
  associationId: string;
  userId: string;
  purpose: ConsentPurpose;
  status: ConsentStatus;
  ipAddress?: string;
  userAgent?: string;
  channel: string;
  metadata?: Record<string, any>;
  createdAt: string;
}

export interface ConsentReport {
  [purpose: string]: {
    granted: number;
    withdrawn: number;
    rate: string;
  };
}
