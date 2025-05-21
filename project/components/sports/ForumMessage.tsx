import { View, Text, StyleSheet, Image } from 'react-native';
import { ForumMessage as ForumMessageType } from '@/utils/types';
import Colors from '@/utils/colors';

interface ForumMessageProps {
  message: ForumMessageType;
}

export default function ForumMessage({ message }: ForumMessageProps) {
  // Format timestamp to readable time
  const formattedTime = () => {
    const messageDate = new Date(message.timestamp);
    return messageDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  return (
    <View style={[
      styles.container,
      message.isCurrentUser && styles.currentUserContainer
    ]}>
      {!message.isCurrentUser && (
        <Image source={{ uri: message.userAvatar }} style={styles.avatar} />
      )}
      <View style={[
        styles.messageContent,
        message.isCurrentUser && styles.currentUserContent
      ]}>
        {!message.isCurrentUser && (
          <Text style={styles.userName}>{message.userName}</Text>
        )}
        <View style={[
          styles.messageBubble,
          message.isCurrentUser && styles.currentUserBubble
        ]}>
          <Text style={[
            styles.messageText,
            message.isCurrentUser && styles.currentUserText
          ]}>
            {message.text}
          </Text>
        </View>
        <Text style={styles.timestamp}>{formattedTime()}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginBottom: 16,
    alignItems: 'flex-end',
  },
  currentUserContainer: {
    justifyContent: 'flex-end',
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 8,
  },
  messageContent: {
    maxWidth: '80%',
  },
  currentUserContent: {
    alignItems: 'flex-end',
  },
  userName: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: Colors.text.secondary,
    marginBottom: 4,
  },
  messageBubble: {
    backgroundColor: Colors.lightGray,
    padding: 12,
    borderRadius: 16,
    borderBottomLeftRadius: 4,
  },
  currentUserBubble: {
    backgroundColor: Colors.primary,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 4,
  },
  messageText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: Colors.text.primary,
  },
  currentUserText: {
    color: Colors.white,
  },
  timestamp: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: Colors.text.secondary,
    marginTop: 4,
  },
});