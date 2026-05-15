import React from 'react';
import { ScrollView, Text, ActivityIndicator } from 'react-native';
import { Link } from 'expo-router';
import { useGrantConsent, useRevokeConsent } from '@src/features/consent/hooks';
import { ConsentToggleCard } from '@src/features/consent/components';
import { ConsentPurpose } from '@src/features/consent/types';
import { Container, StackHeader } from '@src/shared/components';

export default function MemberConsentScreen() {
  const grantConsent = useGrantConsent();
  const revokeConsent = useRevokeConsent();

  const handleToggle = (purpose: ConsentPurpose, grant: boolean) => {
    if (grant) {
      grantConsent.mutate({ purposes: [purpose], channel: 'mobile' });
    } else {
      revokeConsent.mutate({ purposes: [purpose], channel: 'mobile' });
    }
  };

  return (
    <>
      <StackHeader title="Manage Consent" />
      <Container>
        <ScrollView className="p-4">
          <Text className="mb-4 text-lg font-bold text-slate-800">Your Data Preferences</Text>

          {Object.values(ConsentPurpose).map((purpose) => (
            <ConsentToggleCard
              key={purpose}
              purpose={purpose}
              // status={getStatus(purpose)}
              isLoading={
                (grantConsent.isPending && grantConsent.variables?.purposes.includes(purpose)) ||
                (revokeConsent.isPending && revokeConsent.variables?.purposes.includes(purpose))
              }
              onToggle={handleToggle}
            />
          ))}

          <Link
            href="/consent/history"
            className="mt-6 rounded-lg bg-indigo-50 p-4 text-center font-semibold text-indigo-700">
            View Consent Audit History
          </Link>
        </ScrollView>
      </Container>
    </>
  );
}
