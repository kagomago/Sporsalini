import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, TextInput, Modal, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Settings, CreditCard as Edit, MapPin, X, Plus, Camera } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import Colors from '@/utils/colors';

export default function ProfileScreen() {
  const [isEditing, setIsEditing] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [user, setUser] = useState({
    name: 'Alex Johnson',
    username: '@alexj',
    bio: 'Fitness enthusiast | Marathon runner | Yoga lover',
    avatar: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
    location: 'San Francisco, CA',
    followers: 583,
    following: 267,
    interests: ['🏃‍♂️ Running', '🧘‍♀️ Yoga', '🏊‍♂️ Swimming', '🚴‍♂️ Cycling'],
    activities: [
      { 
        id: '1',
        type: 'event',
        title: 'Morning Run Club',
        date: '3 days ago',
        description: 'Joined the local running club for a 5k run',
        image: 'https://images.pexels.com/photos/2774556/pexels-photo-2774556.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940'
      },
      { 
        id: '2',
        type: 'post',
        title: 'New Personal Record!',
        date: '1 week ago',
        description: 'Just beat my 10k record by 3 minutes!',
        image: 'https://images.pexels.com/photos/2526878/pexels-photo-2526878.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940'
      },
      { 
        id: '3',
        type: 'event',
        title: 'Yoga in the Park',
        date: '2 weeks ago',
        description: 'Hosted a yoga session at Golden Gate Park',
        image: 'https://images.pexels.com/photos/1051838/pexels-photo-1051838.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940'
      },
    ]
  });

  const [editingUser, setEditingUser] = useState({ ...user });
  const [newInterest, setNewInterest] = useState('');

  useEffect(() => {
    (async () => {
      if (Platform.OS !== 'web') {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          alert('Sorry, we need camera roll permissions to make this work!');
        }
      }
    })();
  }, []);

  const sportEmojis: { [key: string]: string } = {
    'Running': '🏃‍♂️',
    'Yoga': '🧘‍♀️',
    'Swimming': '🏊‍♂️',
    'Cycling': '🚴‍♂️',
    'Basketball': '🏀',
    'Tennis': '🎾',
    'Soccer': '⚽️',
    'Weightlifting': '🏋️‍♂️',
    'Boxing': '🥊',
    'Hiking': '🏃‍♂️',
    'Surfing': '🏄‍♂️',
    'Rock Climbing': '🧗‍♂️',
    'Golf': '⛳️',
    'Dancing': '💃',
    'Martial Arts': '🥋',
  };

  const handleEditPress = () => {
    setEditingUser({ ...user });
    setEditModalVisible(true);
  };

  const handleSave = () => {
    setUser(editingUser);
    setEditModalVisible(false);
  };

  const handlePickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const selectedAsset = result.assets[0];
        setEditingUser(prev => ({ ...prev, avatar: selectedAsset.uri }));
      }
    } catch (error) {
      console.error('Error picking image:', error);
      alert('Failed to pick image. Please try again.');
    }
  };

  const handleAddInterest = () => {
    if (newInterest.trim()) {
      const sport = newInterest.trim();
      const emoji = sportEmojis[sport] || '🎯';
      const formattedInterest = `${emoji} ${sport}`;
      
      setEditingUser({
        ...editingUser,
        interests: [...editingUser.interests, formattedInterest]
      });
      setNewInterest('');
    }
  };

  const handleRemoveInterest = (index: number) => {
    setEditingUser({
      ...editingUser,
      interests: editingUser.interests.filter((_, i) => i !== index)
    });
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.settingsButton}>
            <Settings size={24} color={Colors.text.primary} />
          </TouchableOpacity>
          <View style={styles.profileImageContainer}>
            <Image source={{ uri: user.avatar }} style={styles.profileImage} />
            <TouchableOpacity style={styles.editButton} onPress={handleEditPress}>
              <Edit size={16} color={Colors.white} />
            </TouchableOpacity>
          </View>
          <Text style={styles.name}>{user.name}</Text>
          <Text style={styles.username}>{user.username}</Text>
          <View style={styles.locationContainer}>
            <MapPin size={16} color={Colors.text.secondary} />
            <Text style={styles.location}>{user.location}</Text>
          </View>
          
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{user.followers}</Text>
              <Text style={styles.statLabel}>Followers</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{user.following}</Text>
              <Text style={styles.statLabel}>Following</Text>
            </View>
          </View>

          <View style={styles.interestsContainer}>
            {user.interests.map((interest, index) => (
              <View key={index} style={styles.interestChip}>
                <Text style={styles.interestText}>{interest}</Text>
              </View>
            ))}
          </View>
          
          <Text style={styles.bio}>{user.bio}</Text>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          {user.activities.map((activity) => (
            <View key={activity.id} style={styles.activityCard}>
              <View style={styles.activityHeader}>
                <View style={styles.activityTitleContainer}>
                  <Text style={styles.activityTitle}>{activity.title}</Text>
                  <Text style={styles.activityDate}>{activity.date}</Text>
                </View>
              </View>
              <Text style={styles.activityDescription}>{activity.description}</Text>
              {activity.image && (
                <Image source={{ uri: activity.image }} style={styles.activityImage} />
              )}
            </View>
          ))}
        </View>
      </ScrollView>

      <Modal
        visible={editModalVisible}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Edit Profile</Text>
              <TouchableOpacity 
                style={styles.closeButton}
                onPress={() => setEditModalVisible(false)}
              >
                <X size={24} color={Colors.text.primary} />
              </TouchableOpacity>
            </View>

            <ScrollView>
              <TouchableOpacity 
                style={styles.imagePickerContainer}
                onPress={handlePickImage}
              >
                <Image 
                  source={{ uri: editingUser.avatar }} 
                  style={styles.profileImagePreview} 
                />
                <View style={styles.cameraIconContainer}>
                  <Camera size={20} color={Colors.white} />
                </View>
              </TouchableOpacity>

              <Text style={styles.inputLabel}>Name</Text>
              <TextInput
                style={styles.input}
                value={editingUser.name}
                onChangeText={(text) => setEditingUser({ ...editingUser, name: text })}
              />

              <Text style={styles.inputLabel}>Username</Text>
              <TextInput
                style={styles.input}
                value={editingUser.username}
                onChangeText={(text) => setEditingUser({ ...editingUser, username: text })}
              />

              <Text style={styles.inputLabel}>Location</Text>
              <TextInput
                style={styles.input}
                value={editingUser.location}
                onChangeText={(text) => setEditingUser({ ...editingUser, location: text })}
              />

              <Text style={styles.inputLabel}>Bio</Text>
              <TextInput
                style={[styles.input, styles.bioInput]}
                value={editingUser.bio}
                onChangeText={(text) => setEditingUser({ ...editingUser, bio: text })}
                multiline
              />

              <Text style={styles.inputLabel}>Interests</Text>
              <View style={styles.interestsEditContainer}>
                {editingUser.interests.map((interest, index) => (
                  <View key={index} style={styles.interestChip}>
                    <Text style={styles.interestChipText}>{interest}</Text>
                    <TouchableOpacity
                      onPress={() => handleRemoveInterest(index)}
                      style={styles.removeInterestButton}
                    >
                      <X size={16} color={Colors.text.secondary} />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>

              <View style={styles.addInterestContainer}>
                <TextInput
                  style={styles.addInterestInput}
                  value={newInterest}
                  onChangeText={setNewInterest}
                  placeholder="Add new interest..."
                  placeholderTextColor={Colors.text.secondary}
                />
                <TouchableOpacity 
                  style={styles.addInterestButton}
                  onPress={handleAddInterest}
                >
                  <Plus size={20} color={Colors.white} />
                </TouchableOpacity>
              </View>

              <TouchableOpacity 
                style={styles.saveButton}
                onPress={handleSave}
              >
                <Text style={styles.saveButtonText}>Save Changes</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    position: 'relative',
  },
  settingsButton: {
    position: 'absolute',
    top: 8,
    right: 16,
    zIndex: 10,
  },
  profileImageContainer: {
    position: 'relative',
    marginBottom: 12,
  },
  profileImage: {
    width: 96,
    height: 96,
    borderRadius: 48,
  },
  editButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Colors.white,
  },
  name: {
    fontFamily: 'Inter-Bold',
    fontSize: 20,
    color: Colors.text.primary,
  },
  username: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: Colors.text.secondary,
    marginBottom: 8,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  location: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: Colors.text.secondary,
    marginLeft: 4,
  },
  statsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  statItem: {
    paddingHorizontal: 20,
  },
  divider: {
    width: 1,
    height: 24,
    backgroundColor: Colors.border,
  },
  statValue: {
    fontFamily: 'Inter-Bold',
    fontSize: 16,
    color: Colors.text.primary,
    textAlign: 'center',
  },
  statLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: Colors.text.secondary,
    textAlign: 'center',
  },
  interestsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginVertical: 8,
    paddingHorizontal: 8,
  },
  interestChip: {
    backgroundColor: Colors.lightGray,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginHorizontal: 4,
    marginVertical: 4,
  },
  interestText: {
    fontSize: 14,
    color: Colors.text.primary,
    fontFamily: 'Inter-Medium',
  },
  bio: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: Colors.text.primary,
    textAlign: 'center',
    lineHeight: 20,
    marginTop: 8,
  },
  section: {
    padding: 16,
    marginTop: -8,
  },
  sectionTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: Colors.text.primary,
    marginBottom: 16,
  },
  activityCard: {
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
  activityHeader: {
    marginBottom: 12,
  },
  activityTitleContainer: {
    flex: 1,
  },
  activityTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: Colors.text.primary,
  },
  activityDate: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: Colors.text.secondary,
  },
  activityDescription: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: Colors.text.primary,
    marginBottom: 12,
    lineHeight: 20,
  },
  activityImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
  },
  modalContent: {
    backgroundColor: Colors.background,
    borderRadius: 20,
    margin: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  modalTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 20,
    color: Colors.text.primary,
  },
  closeButton: {
    padding: 4,
  },
  imagePickerContainer: {
    alignItems: 'center',
    marginVertical: 16,
    position: 'relative',
  },
  profileImagePreview: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  cameraIconContainer: {
    position: 'absolute',
    bottom: 0,
    right: -4,
    backgroundColor: Colors.primary,
    padding: 12,
    borderRadius: 24,
    borderWidth: 3,
    borderColor: Colors.white,
  },
  inputLabel: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: Colors.text.primary,
    marginBottom: 8,
    marginHorizontal: 16,
  },
  input: {
    backgroundColor: Colors.white,
    borderRadius: 8,
    padding: 12,
    marginHorizontal: 16,
    marginBottom: 16,
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: Colors.text.primary,
  },
  bioInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  interestsEditContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 16,
  },
  interestChipText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: Colors.text.primary,
    marginRight: 4,
  },
  removeInterestButton: {
    padding: 2,
  },
  addInterestContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginBottom: 16,
  },
  addInterestInput: {
    flex: 1,
    backgroundColor: Colors.white,
    borderRadius: 8,
    padding: 12,
    marginRight: 8,
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: Colors.text.primary,
  },
  addInterestButton: {
    backgroundColor: Colors.primary,
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveButton: {
    backgroundColor: Colors.primary,
    borderRadius: 8,
    padding: 16,
    margin: 16,
    alignItems: 'center',
  },
  saveButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: Colors.white,
  },
});