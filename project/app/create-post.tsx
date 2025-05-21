import { useState, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Image, 
  TextInput, 
  Platform, 
  ActivityIndicator, 
  KeyboardAvoidingView, 
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
  Dimensions
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { X, Image as ImageIcon } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Colors from '@/utils/colors';

const { width } = Dimensions.get('window');

export default function CreatePostScreen() {
  const router = useRouter();
  const [text, setText] = useState('');
  const [media, setMedia] = useState<{ type: 'image', uri: string } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleMediaPick = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        setError('Permission to access media library was denied');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        setMedia({
          type: 'image',
          uri: asset.uri
        });
      }
    } catch (error) {
      console.error('Error picking media:', error);
      setError('Failed to pick media. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePost = async () => {
    if (!text.trim() && !media) {
      setError('Please add some text or media');
      return;
    }

    try {
      setIsLoading(true);
      
      const newPost = {
        id: `post-${Date.now()}`,
        userName: 'Alex Johnson',
        userAvatar: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
        timeAgo: 'Just now',
        text: text.trim(),
        image: media?.type === 'image' ? media.uri : undefined,
        likes: 0,
        comments: 0,
        liked: false,
      };

      const existingPosts = await AsyncStorage.getItem('posts');
      const parsedPosts = existingPosts ? JSON.parse(existingPosts) : [];
      await AsyncStorage.setItem('posts', JSON.stringify([newPost, ...parsedPosts]));
      
      router.back();
    } catch (error) {
      console.error('Error saving post:', error);
      setError('Failed to save post');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardAvoid}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
        >
          <View style={styles.header}>
            <TouchableOpacity 
              style={styles.closeButton} 
              onPress={() => router.back()}
            >
              <X size={24} color={Colors.text.primary} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Create Post</Text>
            <TouchableOpacity 
              style={[
                styles.postButton,
                (!text.trim() && !media) && styles.postButtonDisabled
              ]} 
              onPress={handlePost}
              disabled={(!text.trim() && !media) || isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color={Colors.white} size="small" />
              ) : (
                <Text style={[
                  styles.postButtonText,
                  (!text.trim() && !media) && styles.postButtonTextDisabled
                ]}>
                  Post
                </Text>
              )}
            </TouchableOpacity>
          </View>

          <ScrollView 
            style={styles.content}
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
          >
            <TextInput
              style={styles.textInput}
              value={text}
              onChangeText={setText}
              placeholder="Write something..."
              placeholderTextColor={Colors.text.secondary}
              multiline
              maxLength={2200}
              editable={!isLoading}
            />

            {media ? (
              <View style={styles.mediaPreviewContainer}>
                <Image source={{ uri: media.uri }} style={styles.mediaPreview} />
                <TouchableOpacity
                  style={styles.removeMediaButton}
                  onPress={() => setMedia(null)}
                  disabled={isLoading}
                >
                  <X size={20} color={Colors.white} />
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.mediaButtons}>
                {isLoading ? (
                  <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={Colors.primary} />
                    <Text style={styles.loadingText}>Processing media...</Text>
                  </View>
                ) : (
                  <TouchableOpacity 
                    style={styles.mediaButton}
                    onPress={handleMediaPick}
                  >
                    <ImageIcon size={32} color={Colors.text.primary} />
                    <Text style={styles.mediaButtonText}>Photo</Text>
                  </TouchableOpacity>
                )}
              </View>
            )}

            {error && (
              <Text style={styles.errorText}>{error}</Text>
            )}
          </ScrollView>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  keyboardAvoid: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    backgroundColor: Colors.background,
    zIndex: 10,
  },
  closeButton: {
    padding: 8,
  },
  headerTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: Colors.text.primary,
  },
  postButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: Colors.primary,
    minWidth: 80,
    alignItems: 'center',
  },
  postButtonDisabled: {
    backgroundColor: Colors.lightGray,
  },
  postButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: Colors.white,
  },
  postButtonTextDisabled: {
    color: Colors.text.secondary,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  textInput: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 16,
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: Colors.text.primary,
    minHeight: 120,
    textAlignVertical: 'top',
    marginBottom: 16,
  },
  mediaButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 32,
  },
  mediaButton: {
    alignItems: 'center',
    padding: 24,
    borderWidth: 2,
    borderColor: Colors.border,
    borderRadius: 12,
    borderStyle: 'dashed',
    backgroundColor: Colors.white,
    width: '45%',
  },
  mediaButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: Colors.text.primary,
    marginTop: 8,
  },
  mediaPreviewContainer: {
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: Colors.lightGray,
  },
  mediaPreview: {
    width: width - 32,
    height: (width - 32) * 0.75,
    borderRadius: 12,
  },
  removeMediaButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: Colors.error,
    marginTop: 16,
    textAlign: 'center',
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  loadingText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: Colors.text.secondary,
    marginTop: 16,
  },
});