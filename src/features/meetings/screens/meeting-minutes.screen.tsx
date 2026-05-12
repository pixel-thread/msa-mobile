import React, { useState } from 'react';
import { View, ScrollView, RefreshControl, TouchableOpacity, Alert } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { 
  useMeetingMinuite, 
  useCreateMeetingMinuite, 
  useUpdateMeetingMinuite, 
  useDeleteMeetingMinute 
} from '../hooks';
import { Container, StackHeader } from '@src/shared/components';
import { LoadingScreen } from '@src/shared/components/screens';
import {
  Card,
  CardContent,
  Text,
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  FieldInput,
} from '@src/shared/components/ui';
import { useAuthStore } from '@src/features/auth';
import { hasHighRoleAccess } from '../utils/permission';
import { CreateMeetingMinuteSchema, CreateMeetingMinuteInput } from '../validators/minuites';
import { cn } from '@lib/cn';

interface MeetingMinute {
  id: string;
  agendaPoint: string;
  decision: string;
  actionItems?: any[];
  createdAt: string;
}

export const MeetingMinutesScreen = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { user } = useAuthStore();
  const isAdmin = hasHighRoleAccess(user?.role);

  const { data: minutes = [], isLoading, isError, refetch, isRefetching } = useMeetingMinuite({ meetingId: id as string });
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMinute, setEditingMinute] = useState<MeetingMinute | null>(null);

  const createMutation = useCreateMeetingMinuite({ meetingId: id as string });
  const deleteMutation = useDeleteMeetingMinute({ meetingId: id as string });

  const handleAdd = () => {
    setEditingMinute(null);
    setIsModalOpen(true);
  };

  const handleEdit = (minute: MeetingMinute) => {
    setEditingMinute(minute);
    setIsModalOpen(true);
  };

  const handleDelete = (minuteId: string) => {
    Alert.alert(
      'Delete Minute',
      'Are you sure you want to delete this meeting minute?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive', 
          onPress: () => deleteMutation.mutate(minuteId) 
        },
      ]
    );
  };

  if (isLoading) return <LoadingScreen message="Loading meeting minutes..." />;

  return (
    <Container>
      <StackHeader
        showBackButton
        title="Meeting Minutes"
        rightAction={
          isAdmin ? (
            <TouchableOpacity onPress={handleAdd}>
              <Ionicons name="add-circle-outline" size={28} color="#4f46e5" />
            </TouchableOpacity>
          ) : null
        }
      />
      
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ padding: 16 }}
        refreshControl={
          <RefreshControl refreshing={isRefetching} onRefresh={refetch} tintColor="#6366f1" />
        }
      >
        {minutes.length === 0 ? (
          <View className="items-center justify-center py-20">
            <Ionicons name="document-text-outline" size={64} color="#cbd5e1" />
            <Text variant="subtext" className="mt-4">No minutes recorded for this meeting.</Text>
            {isAdmin && (
              <Button 
                title="Add First Minute" 
                variant="outline" 
                className="mt-6"
                onPress={handleAdd}
              />
            )}
          </View>
        ) : (
          minutes.map((minute: MeetingMinute) => (
            <MinuteCard 
              key={minute.id} 
              minute={minute} 
              isAdmin={isAdmin}
              onEdit={() => handleEdit(minute)}
              onDelete={() => handleDelete(minute.id)}
            />
          ))
        )}
      </ScrollView>

      <MinuteFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        meetingId={id as string}
        minute={editingMinute}
      />
    </Container>
  );
};

const MinuteCard = ({ 
  minute, 
  isAdmin, 
  onEdit, 
  onDelete 
}: { 
  minute: MeetingMinute; 
  isAdmin: boolean;
  onEdit: () => void;
  onDelete: () => void;
}) => (
  <Card className="mb-4 border-slate-100 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
    <CardContent className="p-4">
      <View className="flex-row justify-between">
        <View className="flex-1">
          <Text weight="bold" size="lg" className="text-slate-900 dark:text-white">
            {minute.agendaPoint}
          </Text>
          <View className="mt-2 rounded-lg bg-slate-50 p-3 dark:bg-slate-800">
            <Text size="sm" className="leading-relaxed text-slate-700 dark:text-slate-300">
              {minute.decision}
            </Text>
          </View>
        </View>
        
        {isAdmin && (
          <View className="ml-4 flex-col gap-y-4">
            <TouchableOpacity onPress={onEdit}>
              <Ionicons name="create-outline" size={20} color="#6366f1" />
            </TouchableOpacity>
            <TouchableOpacity onPress={onDelete}>
              <Ionicons name="trash-outline" size={20} color="#ef4444" />
            </TouchableOpacity>
          </View>
        )}
      </View>
    </CardContent>
  </Card>
);

const MinuteFormModal = ({ 
  isOpen, 
  onClose, 
  meetingId, 
  minute 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  meetingId: string;
  minute: MeetingMinute | null;
}) => {
  const methods = useForm<CreateMeetingMinuteInput>({
    resolver: zodResolver(CreateMeetingMinuteSchema),
    defaultValues: {
      agendaPoint: minute?.agendaPoint || '',
      decision: minute?.decision || '',
    },
  });

  // Reset form when modal opens or minute changes
  React.useEffect(() => {
    if (isOpen) {
      methods.reset({
        agendaPoint: minute?.agendaPoint || '',
        decision: minute?.decision || '',
      });
    }
  }, [isOpen, minute, methods]);

  const createMutation = useCreateMeetingMinuite({ meetingId });
  const updateMutation = useUpdateMeetingMinuite({ 
    meetingId, 
    meetingMinuiteId: minute?.id || '' 
  });

  const onSubmit = (data: CreateMeetingMinuteInput) => {
    if (minute) {
      updateMutation.mutate(data, {
        onSuccess: () => onClose(),
      });
    } else {
      createMutation.mutate(data, {
        onSuccess: () => onClose(),
      });
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent onClose={onClose}>
        <DialogHeader>
          <DialogTitle>{minute ? 'Edit Minute' : 'Add Minute'}</DialogTitle>
        </DialogHeader>

        <FormProvider {...methods}>
          <FieldInput
            name="agendaPoint"
            label="Agenda Point"
            placeholder="What was discussed?"
            multiline
            numberOfLines={2}
          />
          <FieldInput
            name="decision"
            label="Decision"
            placeholder="What was decided?"
            multiline
            numberOfLines={4}
            className="mt-4"
          />
        </FormProvider>

        <DialogFooter className="mt-8">
          <Button 
            title="Cancel" 
            variant="ghost" 
            onPress={onClose} 
            disabled={isPending}
          />
          <Button 
            title={minute ? 'Save Changes' : 'Add Minute'} 
            onPress={methods.handleSubmit(onSubmit)}
            loading={isPending}
          />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
