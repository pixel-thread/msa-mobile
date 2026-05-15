import React from 'react';
import { View, ScrollView, Text, ActivityIndicator } from 'react-native';
import { Link } from 'expo-router';
import { useMyConsent, useGrantConsent } from '@src/features/consent/hooks';
import { ConsentToggleCard } from '@src/features/consent/components';
import { ConsentPurpose } from '@src/features/consent/types';
import { Container, StackHeader } from '@src/shared/components';

export default function MemberConsentScreen() {
  const { data: consents, isLoading } = useMyConsent();
  const updateConsent = useGrantConsent();

  const handleToggle = (purpose: ConsentPurpose, grant: boolean) => {
    updateConsent.mutate({ purpose, grant });
  };

  const getStatus = (purpose: ConsentPurpose) => {
    return consents?.find((c) => c.purpose === purpose)?.status;
  };

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" color="#4f46e5" />
      </View>
    );
  }

  return (
    <>
      <StackHeader title="Manage Consent" />
      <Container>
        <ScrollView className="flex-1">
          <Text className="mb-4 text-lg font-bold text-slate-800">Your Data Preferences</Text>

          {Object.values(ConsentPurpose).map((purpose) => (
            <ConsentToggleCard
              key={purpose}
              purpose={purpose}
              status={getStatus(purpose)}
              isLoading={updateConsent.isPending && updateConsent.variables?.purpose === purpose}
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
