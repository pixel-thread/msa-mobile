import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { Meeting } from '../types';

interface MeetingCardProps {
  meeting: Meeting;
  onPress?: (meeting: Meeting) => void;
}

/**
 * A card component to display summary information for a meeting.
 * 
 * @param meeting - The meeting data to display
 * @param onPress - Optional callback when the card is pressed
 */
export const MeetingCard = ({ meeting, onPress }: MeetingCardProps) => {
  const date = new Date(meeting.scheduledAt);
  const formattedDate = date.toLocaleDateString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
  const formattedTime = date.toLocaleTimeString(undefined, {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <TouchableOpacity 
      className="mb-4 flex-row items-center rounded-2xl bg-white p-4 shadow-sm border border-gray-100"
      activeOpacity={0.7}
      onPress={() => onPress?.(meeting)}
    >
      <View className="mr-4 items-center justify-center rounded-xl bg-indigo-50 px-3 py-2">
        <Text className="text-xs font-bold text-indigo-600 uppercase">{meeting.type}</Text>
      </View>
      
      <View className="flex-1">
        <Text className="text-base font-bold text-gray-900" numberOfLines={1}>
          {meeting.title}
        </Text>
        <View className="mt-1 flex-row items-center">
          <Ionicons name="calendar-outline" size={14} color="#6b7280" />
          <Text className="ml-1 text-xs text-gray-500">
            {formattedDate} • {formattedTime}
          </Text>
        </View>
        {meeting.venue && (
          <View className="mt-1 flex-row items-center">
            <Ionicons name="location-outline" size={14} color="#6b7280" />
            <Text className="ml-1 text-xs text-gray-500" numberOfLines={1}>
              {meeting.venue}
            </Text>
          </View>
        )}
      </View>

      <View className="items-end">
        <View className={`rounded-full px-2 py-0.5 ${
          meeting.status === 'SCHEDULED' ? 'bg-green-100' : 
          meeting.status === 'IN_PROGRESS' ? 'bg-blue-100' : 
          'bg-gray-100'
        }`}>
          <Text className={`text-[10px] font-bold ${
            meeting.status === 'SCHEDULED' ? 'text-green-700' : 
            meeting.status === 'IN_PROGRESS' ? 'text-blue-700' : 
            'text-gray-600'
          }`}>
            {meeting.status}
          </Text>
        </View>
        <Text className="mt-2 text-[10px] text-gray-400">
          {meeting._count.attendees} attendees
        </Text>
      </View>
    </TouchableOpacity>
  );
};
