import { StackHeader } from '@src/shared/components';
import { ErrorScreen } from '@src/shared/components/screens';

type Props = {
  refetch: () => void;
};
export const MeetingErrorScreen = (props: Props) => {
  return (
    <>
      <StackHeader showBackButton title="Meetings" />
      <ErrorScreen
        title="Failed to load meetings"
        message="There was an error retrieving the meeting list. Please try again."
        onRetry={() => props.refetch()}
      />
    </>
  );
};
