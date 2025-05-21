import { View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { Bell, MessageSquare } from 'lucide-react-native';
import { useState } from 'react';
import NotificationsScreen from '@/components/notifications/NotificationsScreen';
import Colors from '@/utils/colors';

export default function Header() {
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <>
      <View style={styles.container}>
        <Text style={styles.logo}>Sporsal</Text>
        <View style={styles.actions}>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => setShowNotifications(true)}
          >
            <Bell size={24} color={Colors.text.primary} />
            <View style={styles.notificationBadge} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <MessageSquare size={24} color={Colors.text.primary} />
          </TouchableOpacity>
        </View>
      </View>

      <Modal
        visible={showNotifications}
        animationType="slide"
        onRequestClose={() => setShowNotifications(false)}
      >
        <NotificationsScreen onClose={() => setShowNotifications(false)} />
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    backgroundColor: Colors.background,
  },
  logo: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
    color: Colors.primary,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    marginLeft: 16,
    position: 'relative',
  },
  notificationBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.error,
    borderWidth: 1,
    borderColor: Colors.white,
  },
});