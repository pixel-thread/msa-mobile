import React, { useState } from 'react';
import { View, Modal, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { Text, Button } from '@src/shared/components/ui';
import { useAddMemberRole, useRemoveMemberRole } from '../hooks';
import type { UserRole } from '@src/shared/types/role';
import { Ionicons } from '@expo/vector-icons';
import { cn } from '@src/shared/lib/cn';

interface ManageRolesModalProps {
  memberId: string;
  currentRoles: UserRole[];
  isVisible: boolean;
  onClose: () => void;
}

const ALL_ROLES: UserRole[] = ['SUPER_ADMIN', 'ADMIN', 'MEMBER', 'PRESIDENT', 'SECRETARY'];

export const ManageRolesModal = ({ memberId, currentRoles, isVisible, onClose }: ManageRolesModalProps) => {
  const { mutate: addRole, isPending: isAdding } = useAddMemberRole();
  const { mutate: removeRole, isPending: isRemoving } = useRemoveMemberRole();
  const isUpdating = isAdding || isRemoving;

  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);

  const availableRoles = ALL_ROLES.filter(r => !currentRoles.includes(r));

  const handleAdd = () => {
    if (!selectedRole) return;
    addRole(
      { id: memberId, role: selectedRole },
      {
        onSuccess: () => {
          setSelectedRole(null);
        },
        onError: () => Alert.alert('Error', 'Failed to add role.')
      }
    );
  };

  const handleRemove = (role: UserRole) => {
    Alert.alert('Remove Role', `Are you sure you want to remove the ${role} role?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Remove',
        style: 'destructive',
        onPress: () => {
          removeRole(
            { id: memberId, role },
            {
              onError: () => Alert.alert('Error', 'Failed to remove role.')
            }
          );
        }
      }
    ]);
  };

  return (
    <Modal visible={isVisible} transparent animationType="slide" onRequestClose={onClose}>
      <View className="flex-1 justify-end bg-black/50">
        <View className="min-h-[50%] rounded-t-3xl bg-white p-6 dark:bg-slate-900">
          <View className="mb-4 flex-row items-center justify-between">
            <Text variant="heading" size="xl" className="text-slate-900 dark:text-white">Manage Roles</Text>
            <TouchableOpacity onPress={onClose} disabled={isUpdating}>
              <Ionicons name="close" size={24} color="#64748b" />
            </TouchableOpacity>
          </View>

          <Text variant="subtext" className="mb-2">Current Roles</Text>
          <View className="mb-6 flex-row flex-wrap gap-2">
            {currentRoles.map((role) => (
              <View key={role} className="flex-row items-center gap-x-1 rounded-full bg-indigo-100 px-3 py-1.5 dark:bg-indigo-900/30">
                <Text size="sm" weight="medium" className="text-indigo-700 dark:text-indigo-300">{role}</Text>
                <TouchableOpacity onPress={() => handleRemove(role)} disabled={isUpdating}>
                  <Ionicons name="close-circle" size={16} color="#6366f1" className="opacity-70" />
                </TouchableOpacity>
              </View>
            ))}
            {currentRoles.length === 0 && <Text variant="subtext" size="sm">No roles assigned.</Text>}
          </View>

          <Text variant="subtext" className="mb-2">Add New Role</Text>
          <ScrollView className="mb-4 max-h-40" showsVerticalScrollIndicator={false}>
            {availableRoles.length === 0 ? (
              <Text variant="subtext" size="sm" className="italic">All roles are already assigned.</Text>
            ) : (
              <View className="flex-row flex-wrap gap-2">
                {availableRoles.map((role) => (
                  <TouchableOpacity
                    key={role}
                    onPress={() => setSelectedRole(role)}
                    disabled={isUpdating}
                    className={cn(
                      'rounded-md border px-3 py-2',
                      selectedRole === role 
                        ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20' 
                        : 'border-slate-200 bg-transparent dark:border-slate-700'
                    )}
                  >
                    <Text size="sm" className={selectedRole === role ? 'text-indigo-700 dark:text-indigo-300' : 'text-slate-700 dark:text-slate-300'}>
                      {role}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </ScrollView>

          <Button 
            variant="default" 
            onPress={handleAdd} 
            disabled={!selectedRole || isUpdating}
            loading={isAdding}
            className="mt-auto"
          >
            Add Selected Role
          </Button>
        </View>
      </View>
    </Modal>
  );
};