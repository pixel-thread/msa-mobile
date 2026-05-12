import { StackHeader } from '@src/shared/components';
import { ErrorScreen } from '@src/shared/components/screens';
import React from 'react';

type Props = {
  refetch: () => void;
};
export const MemberErrorScreen = (props: Props) => {
  return (
    <>
      <StackHeader showBackButton title="Members" />
      <ErrorScreen
        title="Failed to load members"
        message="There was an error retrieving the member list. Please try again."
        onRetry={() => props.refetch()}
      />
    </>
  );
};