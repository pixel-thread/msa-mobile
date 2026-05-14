import React, { useEffect } from 'react';
import { View, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Container, StackHeader } from '@src/shared/components';
import { Text, TextInput, Button } from '@src/shared/components/ui';
import { DSARStatusBadge } from '../components/DSARStatusBadge';
import { SLAIndicator } from '../components/SLAIndicator';
import { useDSARDetail } from '../hooks/use-dsar';
import { useRespondToDSAR } from '../hooks/use-dsar-mutations';
import { dsarResponseSchema, DSARResponseFormData } from '../validators/dsar.validator';
import { cn } from '@src/shared/lib/cn';

export const AdminDSARDetailScreen = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { data: request, isLoading, error } = useDSARDetail(id);
  const { mutate: respond, isPending } = useRespondToDSAR();

  const {
    control,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<DSARResponseFormData>({
    resolver: zodResolver(dsarResponseSchema),
    defaultValues: {
      status: 'IN_PROGRESS',
      notes: '',
      storageKey: '',
      rejectedReason: '',
    },
  });

  const selectedStatus = watch('status');

  useEffect(() => {
    if (request) {
      reset({
        status: request.status === 'PENDING' ? 'IN_PROGRESS' : (request.status as any),
        notes: request.notes || '',
        storageKey: request.storageKey || '',
        rejectedReason: request.rejectedReason || '',
      });
    }
  }, [request, reset]);

  const onSubmit = (data: DSARResponseFormData) => {
    respond(
      {
        ticketId: id,
        payload: data as any,
      },
      {
        onSuccess: () => {
          router.back();
        },
      }
    );
  };

  if (isLoading) {
    return (
      <Container>
        <StackHeader title="Request Detail" showBackButton />
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#4F46E5" />
        </View>
      </Container>
    );
  }

  if (error || !request) {
    return (
      <Container>
        <StackHeader title="Request Detail" showBackButton />
        <View className="flex-1 items-center justify-center px-4">
          <Text className="text-center text-red-500">Failed to load request details</Text>
        </View>
      </Container>
    );
  }

  return (
    <Container>
      <StackHeader title={`Ticket #${request.ticketNumber}`} showBackButton />
      <ScrollView className="flex-1 px-4 py-6" showsVerticalScrollIndicator={false}>
        {/* Request Info */}
        <View className="mb-6 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <View className="mb-4 flex-row items-center justify-between">
            <DSARStatusBadge status={request.status} />
            <SLAIndicator createdAt={request.createdAt} />
          </View>

          <View className="mb-4">
            <Text className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Request Type
            </Text>
            <Text weight="semibold" className="text-lg text-slate-800">
              {request.requestType}
            </Text>
          </View>

          <View className="mb-4">
            <Text className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Requested Data
            </Text>
            <View className="mt-1 flex-row flex-wrap gap-2">
              {request.requestedData.map((item) => (
                <View key={item} className="rounded-md bg-slate-100 px-2 py-1">
                  <Text className="text-xs text-slate-600">{item.replace('_', ' ')}</Text>
                </View>
              ))}
            </View>
          </View>

          <View className="mb-4">
            <Text className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Description
            </Text>
            <Text className="mt-1 text-slate-600">
              {request.description || 'No description provided'}
            </Text>
          </View>

          <View>
            <Text className="text-xs font-bold uppercase tracking-wider text-slate-400">
              User ID
            </Text>
            <Text className="mt-1 text-slate-600">{request.userId}</Text>
          </View>
        </View>

        {/* Response Form */}
        <View className="mb-8">
          <Text weight="bold" className="mb-4 text-xl text-slate-900">
            Process Request
          </Text>

          {/* Status Selection */}
          <View className="mb-4">
            <Text className="mb-2 font-medium text-slate-700">Update Status</Text>
            <View className="flex-row gap-2">
              {(['IN_PROGRESS', 'COMPLETED', 'REJECTED'] as const).map((status) => (
                <TouchableOpacity
                  key={status}
                  onPress={() => reset({ ...watch(), status })}
                  className={cn(
                    'flex-1 items-center justify-center rounded-lg border py-3',
                    selectedStatus === status
                      ? 'border-indigo-600 bg-indigo-50'
                      : 'border-slate-200 bg-white'
                  )}>
                  <Text
                    weight={selectedStatus === status ? 'semibold' : 'medium'}
                    className={cn(
                      'text-xs',
                      selectedStatus === status ? 'text-indigo-700' : 'text-slate-600'
                    )}>
                    {status.replace('_', ' ')}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Notes */}
          <View className="mb-4">
            <Text className="mb-2 font-medium text-slate-700">Notes (Internal)</Text>
            <Controller
              control={control}
              name="notes"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  multiline
                  numberOfLines={4}
                  className={cn(
                    'min-h-[100px] rounded-lg border bg-white px-4 py-2 text-start',
                    errors.notes ? 'border-red-500' : 'border-slate-200'
                  )}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  placeholder="Add processing notes..."
                  textAlignVertical="top"
                />
              )}
            />
            {errors.notes && (
              <Text className="mt-1 text-xs text-red-500">{errors.notes.message}</Text>
            )}
          </View>

          {/* Conditional: Storage Key for COMPLETED */}
          {selectedStatus === 'COMPLETED' && (
            <View className="mb-4">
              <Text className="mb-2 font-medium text-slate-700">Storage Key / Download URL</Text>
              <Controller
                control={control}
                name="storageKey"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    className={cn(
                      'h-12 rounded-lg border bg-white px-4',
                      errors.storageKey ? 'border-red-500' : 'border-slate-200'
                    )}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    placeholder="Enter storage reference..."
                  />
                )}
              />
              {errors.storageKey && (
                <Text className="mt-1 text-xs text-red-500">{errors.storageKey.message}</Text>
              )}
            </View>
          )}

          {/* Conditional: Rejected Reason for REJECTED */}
          {selectedStatus === 'REJECTED' && (
            <View className="mb-4">
              <Text className="mb-2 font-medium text-slate-700">Reason for Rejection</Text>
              <Controller
                control={control}
                name="rejectedReason"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    multiline
                    numberOfLines={3}
                    className={cn(
                      'min-h-[80px] rounded-lg border bg-white px-4 py-2',
                      errors.rejectedReason ? 'border-red-500' : 'border-slate-200'
                    )}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    placeholder="Explain why the request was rejected..."
                    textAlignVertical="top"
                  />
                )}
              />
              {errors.rejectedReason && (
                <Text className="mt-1 text-xs text-red-500">{errors.rejectedReason.message}</Text>
              )}
            </View>
          )}

          <Button
            title={isPending ? 'Updating...' : 'Update Request'}
            onPress={handleSubmit(onSubmit)}
            disabled={isPending}
            className="mt-4"
          />
        </View>
      </ScrollView>
    </Container>
  );
};
