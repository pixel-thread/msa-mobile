import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  Button,
  AlertDialogTitle,
  Text,
  AlertDialogDescription,
} from '@components/ui';
import { Ionicons } from '@expo/vector-icons';
import { useSignOut } from '@src/features/auth/hooks/use-sign-out';
import { useState } from 'react';
import { View } from 'react-native';

export const LogoutButton = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { mutate: logout, isPending } = useSignOut();

  const onConfirmLogout = async () => logout();

  const onPressLogout = () => setIsOpen(!isOpen);

  return (
    <>
      <Button
        variant="destructive"
        onPress={onPressLogout}
        disabled={isPending}
        className="h-14 rounded-2xl shadow-lg shadow-red-100 dark:shadow-none">
        <View className="flex-row items-center gap-x-2">
          <Ionicons name="log-out-outline" size={20} color="white" />
          <Text weight="bold" className="text-white">
            Logout from System
          </Text>
        </View>
      </Button>

      <AlertDialog open={isOpen} onOpenChange={onPressLogout}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are your sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot sign you out from this account
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onPress={onPressLogout} />
            <AlertDialogAction title="Logout" variant="destructive" onPress={onConfirmLogout} />
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
