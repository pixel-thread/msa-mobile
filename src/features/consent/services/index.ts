import axios from 'axios';
import { ConsentPurpose, ConsentReceipt, ConsentReport } from '../types';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || '';

export const fetchMyConsents = async (): Promise<ConsentReceipt[]> => {
  const { data } = await axios.get(`${API_BASE_URL}/api/consent/my`);
  return data;
};

export const fetchMyConsentHistory = async (): Promise<ConsentReceipt[]> => {
  const { data } = await axios.get(`${API_BASE_URL}/api/consent/history`);
  return data;
};

export const grantConsent = async (purpose: ConsentPurpose): Promise<void> => {
  await axios.post(`${API_BASE_URL}/api/consent/grant`, { purpose });
};

export const revokeConsent = async (purpose: ConsentPurpose): Promise<void> => {
  await axios.post(`${API_BASE_URL}/api/consent/revoke`, { purpose });
};

export const fetchAllConsents = async (filters?: any): Promise<ConsentReceipt[]> => {
  const { data } = await axios.get(`${API_BASE_URL}/api/consent/all`, { params: filters });
  return data;
};

export const fetchConsentReport = async (): Promise<ConsentReport> => {
  const { data } = await axios.get(`${API_BASE_URL}/api/consent/report`);
  return data;
};
