import { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput } from 'react-native';
import { Send } from 'lucide-react-native';
import ForumRoom from '@/components/sports/ForumRoom';
import ForumMessage from '@/components/sports/ForumMessage';
import { mockForumRooms, mockForumMessages } from '@/utils/mockData';
import Colors from '@/utils/colors';

export default function ForumScreen() {
  const [selectedRoom, setSelectedRoom] = useState(mockForumRooms[0].id);
  const [newMessage, setNewMessage] = useState('');
  const [messages, setMessages] = useState(mockForumMessages);
  
  const filteredMessages = messages.filter(msg => msg.roomId === selectedRoom);
  const currentRoom = mockForumRooms.find(room => room.id === selectedRoom);
  
  const handleSendMessage = () => {
    if (newMessage.trim() === '') return;
    
    const newMsg = {
      id: `msg-${Date.now()}`,
      roomId: selectedRoom,
      userId: 'current-user',
      userName: 'You',
      userAvatar: 'https://images.pexels.com/photos/1722198/pexels-photo-1722198.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
      text: newMessage,
      timestamp: new Date().toISOString(),
      isCurrentUser: true,
    };
    
    setMessages([...messages, newMsg]);
    setNewMessage('');
  };
  
  return (
    <View style={styles.container}>
      <View style={styles.roomList}>
        <FlatList
          data={mockForumRooms}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <ForumRoom
              room={item}
              isActive={item.id === selectedRoom}
              onPress={() => setSelectedRoom(item.id)}
            />
          )}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.roomListContent}
        />
      </View>
      
      <View style={styles.messagesContainer}>
        <View style={styles.roomHeader}>
          <Text style={styles.roomName}>{currentRoom?.name}</Text>
          <Text style={styles.roomMembers}>{currentRoom?.memberCount} members</Text>
        </View>
        
        <FlatList
          data={filteredMessages}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <ForumMessage message={item} />
          )}
          inverted
          contentContainerStyle={styles.messageList}
        />
        
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Type a message..."
            placeholderTextColor={Colors.text.secondary}
            value={newMessage}
            onChangeText={setNewMessage}
            multiline
          />
          <TouchableOpacity 
            style={[
              styles.sendButton,
              newMessage.trim() === '' && styles.sendButtonDisabled
            ]}
            onPress={handleSendMessage}
            disabled={newMessage.trim() === ''}
          >
            <Send size={20} color={Colors.white} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  roomList: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  roomListContent: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  messagesContainer: {
    flex: 1,
  },
  roomHeader: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  roomName: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: Colors.text.primary,
  },
  roomMembers: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: Colors.text.secondary,
  },
  messageList: {
    padding: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  input: {
    flex: 1,
    backgroundColor: Colors.lightGray,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    maxHeight: 120,
    color: Colors.text.primary,
    fontFamily: 'Inter-Regular',
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  sendButtonDisabled: {
    backgroundColor: Colors.disabled,
  },
});