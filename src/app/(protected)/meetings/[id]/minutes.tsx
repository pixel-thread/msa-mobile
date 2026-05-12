import React from 'react';
import { View } from 'react-native';
import { Text } from '@src/shared/components/ui';
import { Container, StackHeader } from '@src/shared/components';

export default function MeetingMinutesPage() {
  return (
    <Container>
      <StackHeader title="Meeting Minutes" showBackButton />
      <View className="flex-1 items-center justify-center p-4">
        <Text>Meeting Minutes Screen (Coming Soon)</Text>
      </View>
    </Container>
  );
}
