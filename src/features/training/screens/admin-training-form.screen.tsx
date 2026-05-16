import React, { useState, useEffect } from 'react';
import { View, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useTrainingModule, useCreateTrainingModule, useUpdateTrainingModule } from '../hooks';
import { LoadingScreen, ErrorScreen } from '@src/shared/components/screens';
import { Container, StackHeader } from '@src/shared/components';
import { Text } from '@src/shared/components/ui';
import { TextInput } from '@src/shared/components/ui/text-input';
import { Button } from '@src/shared/components/ui/button';
import type { UserRole } from '@src/shared/types/role';

const ROLE_OPTIONS: UserRole[] = [
  'MEMBER',
  'ADMIN',
  'SECRETARY',
  'PRESIDENT',
  'DPO',
  'SUPER_ADMIN',
];

export const AdminTrainingFormScreen = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const isEditing = !!id;

  const { data: module, isLoading, isError, refetch } = useTrainingModule(id || '');
  const createModule = useCreateTrainingModule();
  const updateModule = useUpdateTrainingModule({ moduleId: id || '' });

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [content, setContent] = useState('');
  const [requiredForRoles, setRequiredForRoles] = useState<UserRole[]>([]);
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    if (module) {
      setTitle(module.title);
      setDescription(module.description || '');
      setContent(module.content);
      setRequiredForRoles(module.requiredForRoles as UserRole[]);
      setIsActive(module.isActive);
    }
  }, [module]);

  const toggleRole = (role: UserRole) => {
    setRequiredForRoles((prev) =>
      prev.includes(role) ? prev.filter((r) => r !== role) : [...prev, role]
    );
  };

  const handleSubmit = async () => {
    if (!title.trim() || !content.trim()) {
      return;
    }

    const data = {
      title: title.trim(),
      description: description.trim() || null,
      content: content.trim(),
      requiredForRoles,
      isActive,
    };

    if (isEditing) {
      const result = await updateModule.mutateAsync(data);
      if (result.success) {
        router.back();
      }
    } else {
      const result = await createModule.mutateAsync(data);
      if (result.success) {
        router.back();
      }
    }
  };

  if (isLoading) return <LoadingScreen message="Loading..." />;

  if (isError) {
    return (
      <>
        <StackHeader showBackButton title={isEditing ? 'Edit Training' : 'Create Training'} />
        <ErrorScreen
          title="Failed to load"
          message="There was an error loading this module."
          onRetry={() => refetch()}
        />
      </>
    );
  }

  const isPending = createModule.isPending || updateModule.isPending;

  return (
    <Container>
      <StackHeader showBackButton title={isEditing ? 'Edit Training' : 'Create Training'} />

      <ScrollView
        className="flex-1"
        contentContainerClassName="p-4"
        showsVerticalScrollIndicator={false}>
        <View className="gap-4">
          <TextInput
            label="Title"
            value={title}
            onChangeText={setTitle}
            placeholder="Enter training title"
          />

          <TextInput
            label="Description"
            value={description}
            onChangeText={setDescription}
            placeholder="Enter description (optional)"
            multiline
            numberOfLines={3}
          />

          <View className="flex gap-1">
            <Text variant="label" className="mb-1">
              Content
            </Text>
            <TextInput
              value={content}
              onChangeText={setContent}
              placeholder="Enter training content (JSON or text)"
              multiline
              numberOfLines={8}
              className="text-top min-h-[160px]"
            />
          </View>

          <View className="flex gap-2">
            <Text variant="label" className="mb-1">
              Required For Roles
            </Text>
            <View className="flex-row flex-wrap gap-2">
              {ROLE_OPTIONS.map((role) => (
                <TouchableOpacity
                  key={role}
                  onPress={() => toggleRole(role)}
                  className={`rounded-full px-3 py-2 ${
                    requiredForRoles.includes(role)
                      ? 'bg-indigo-600'
                      : 'border border-slate-300 bg-white dark:border-slate-600 dark:bg-slate-800'
                  }`}>
                  <Text
                    size="sm"
                    className={
                      requiredForRoles.includes(role)
                        ? 'text-white'
                        : 'text-slate-600 dark:text-slate-400'
                    }>
                    {role.replace('_', ' ')}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View className="flex-row items-center justify-between rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800">
            <View>
              <Text variant="heading" size="lg" className="text-slate-900 dark:text-white">
                Active
              </Text>
              <Text variant="subtext" size="sm" className="text-slate-500">
                Training module is visible to users
              </Text>
            </View>
            <Switch
              value={isActive}
              onValueChange={setIsActive}
              trackColor={{ false: '#e2e8f0', true: '#818cf8' }}
              thumbColor={isActive ? '#4f46e5' : '#f1f5f9'}
            />
          </View>
        </View>
      </ScrollView>

      <View className="border-t border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800">
<Button
          onPress={handleSubmit}
          disabled={isPending || !title.trim() || !content.trim()}
          className="w-full"
          title={isPending ? 'Saving...' : isEditing ? 'Update Training' : 'Create Training'}
        />
      </View>
    </Container>
  );
};

