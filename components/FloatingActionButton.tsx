import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { Plus, FileText, Calendar } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Colors from '@/utils/colors';

export default function FloatingActionButton() {
  const [isOpen, setIsOpen] = useState(false);
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const handlePress = () => {
    setIsOpen(!isOpen);
  };

  const handleCreatePost = () => {
    setIsOpen(false);
    router.push('/create-post');
  };

  const handleCreateEvent = () => {
    setIsOpen(false);
    router.push('/create-event');
  };

  return (
    <>
      {isOpen && (
        <TouchableOpacity
          style={styles.overlay}
          activeOpacity={1}
          onPress={() => setIsOpen(false)}
        >
          <View style={[styles.menuContainer, { bottom: 180 + insets.bottom }]}>
            <TouchableOpacity style={styles.menuItem} onPress={handleCreatePost}>
              <View style={styles.menuItemContent}>
                <FileText size={24} color={Colors.white} />
                <Text style={styles.menuText}>Create Post</Text>
              </View>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.menuItem} onPress={handleCreateEvent}>
              <View style={styles.menuItemContent}>
                <Calendar size={24} color={Colors.white} />
                <Text style={styles.menuText}>Create Event</Text>
              </View>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      )}
      
      <View style={[
        styles.container,
        { bottom: 120 + insets.bottom }
      ]}>
        <TouchableOpacity
          style={[styles.fab, isOpen && styles.fabActive]}
          onPress={handlePress}
        >
          <Plus 
            size={24} 
            color={Colors.white}
            style={[
              styles.plusIcon,
              isOpen && styles.plusIconActive
            ]} 
          />
        </TouchableOpacity>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    position: 'absolute',
    right: 16,
    alignItems: 'flex-end',
    zIndex: 1000,
  },
  fab: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    zIndex: 2,
  },
  fabActive: {
    backgroundColor: Colors.error,
    transform: [{ rotate: '45deg' }],
  },
  plusIcon: {
    transform: [{ rotate: '0deg' }],
  },
  plusIconActive: {
    transform: [{ rotate: '45deg' }],
  },
  menuContainer: {
    position: 'absolute',
    right: 16,
    width: '80%',
    maxWidth: 300,
  },
  menuItem: {
    marginBottom: 16,
  },
  menuItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    padding: 16,
    borderRadius: 12,
    justifyContent: 'center',
  },
  menuText: {
    color: Colors.white,
    marginLeft: 12,
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
  },
});