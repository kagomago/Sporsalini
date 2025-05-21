import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { ForumRoom as ForumRoomType } from '@/utils/types';
import Colors from '@/utils/colors';

interface ForumRoomProps {
  room: ForumRoomType;
  isActive: boolean;
  onPress: () => void;
}

export default function ForumRoom({ room, isActive, onPress }: ForumRoomProps) {
  return (
    <TouchableOpacity 
      style={[
        styles.container,
        isActive && styles.activeContainer
      ]}
      onPress={onPress}
    >
      <Text 
        style={[
          styles.name,
          isActive && styles.activeName
        ]}
      >
        {room.name}
      </Text>
      <View 
        style={[
          styles.badge,
          isActive && styles.activeBadge
        ]}
      >
        <Text style={styles.badgeText}>{room.memberCount}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginRight: 8,
    backgroundColor: Colors.lightGray,
    flexDirection: 'row',
    alignItems: 'center',
  },
  activeContainer: {
    backgroundColor: Colors.primary,
  },
  name: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: Colors.text.primary,
  },
  activeName: {
    color: Colors.white,
  },
  badge: {
    backgroundColor: Colors.background,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
    marginLeft: 8,
  },
  activeBadge: {
    backgroundColor: Colors.white,
  },
  badgeText: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    color: Colors.text.primary,
  },
});