import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { MessageCircle, UserPlus, MapPin } from 'lucide-react-native';
import { User } from '@/utils/types';
import Colors from '@/utils/colors';

interface BuddyCardProps {
  user: User;
}

export default function BuddyCard({ user }: BuddyCardProps) {
  return (
    <View style={styles.container}>
      <Image source={{ uri: user.avatar }} style={styles.avatar} />
      
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.name}>{user.name}</Text>
          <View style={styles.locationContainer}>
            <MapPin size={14} color={Colors.text.secondary} />
            <Text style={styles.locationText}>{user.distance} km</Text>
          </View>
        </View>
        
        <View style={styles.interestsContainer}>
          {user.interests.map((interest, index) => (
            <View key={index} style={styles.interestChip}>
              <Text style={styles.interestText}>{interest}</Text>
            </View>
          ))}
        </View>
        
        <Text style={styles.about} numberOfLines={2}>{user.about}</Text>
        
        <View style={styles.actions}>
          <TouchableOpacity style={styles.actionButton}>
            <MessageCircle size={20} color={Colors.primary} />
            <Text style={styles.actionText}>Message</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[
              styles.connectButton, 
              user.connected && styles.connectedButton
            ]}
          >
            <UserPlus size={16} color={user.connected ? Colors.primary : Colors.white} />
            <Text 
              style={[
                styles.connectButtonText,
                user.connected && styles.connectedButtonText
              ]}
            >
              {user.connected ? 'Connected' : 'Connect'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 16,
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  name: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: Colors.text.primary,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: Colors.text.secondary,
    marginLeft: 4,
  },
  interestsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 8,
  },
  interestChip: {
    backgroundColor: Colors.lightGray,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
    marginBottom: 8,
  },
  interestText: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    color: Colors.text.primary,
  },
  about: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: Colors.text.secondary,
    marginBottom: 12,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: Colors.primary,
    marginLeft: 4,
  },
  connectButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 4,
  },
  connectedButton: {
    backgroundColor: Colors.lightGray,
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  connectButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: Colors.white,
    marginLeft: 4,
  },
  connectedButtonText: {
    color: Colors.primary,
  },
});