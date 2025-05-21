import { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Platform, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Calendar, Clock, MapPin, Image as ImageIcon, Users, X } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import { SafeAreaView } from 'react-native-safe-area-context';
import DateTimePicker from '@react-native-community/datetimepicker';
import Colors from '@/utils/colors';
import EventManager from '@/utils/eventManager';
import { getAddressFromCoordinates } from '@/utils/locationService';
import { EventLocation } from '@/utils/types';

interface MapViewProps {
  ref: any;
  style: any;
  onPress: (e: any) => void;
  initialRegion: {
    latitude: number;
    longitude: number;
    latitudeDelta: number;
    longitudeDelta: number;
  };
}

interface MarkerProps {
  coordinate: {
    latitude: number;
    longitude: number;
  };
}

let MapView: React.ComponentType<MapViewProps>;
let Marker: React.ComponentType<MarkerProps>;

if (Platform.OS !== 'web') {
  try {
    const Maps = require('react-native-maps');
    MapView = Maps.default;
    Marker = Maps.Marker;
  } catch (e) {
    console.warn('Failed to load react-native-maps:', e);
  }
}

const defaultImages = [
  'https://images.pexels.com/photos/2774556/pexels-photo-2774556.jpeg',
  'https://images.pexels.com/photos/1051838/pexels-photo-1051838.jpeg',
  'https://images.pexels.com/photos/2526878/pexels-photo-2526878.jpeg',
];

const categories = [
  { name: 'Running', color: '#4F46E5' },
  { name: 'Yoga', color: '#059669' },
  { name: 'Cycling', color: '#F97316' },
  { name: 'Basketball', color: '#EF4444' },
  { name: 'Swimming', color: '#3B82F6' },
  { name: 'Tennis', color: '#16A34A' },
  { name: 'Soccer', color: '#DC2626' },
  { name: 'Hiking', color: '#854D0E' },
];

export default function CreateEventScreen() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [categoryColor, setCategoryColor] = useState('');
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [location, setLocation] = useState<EventLocation | null>(null);
  const [address, setAddress] = useState('');
  const [maxAttendees, setMaxAttendees] = useState('');
  const [image, setImage] = useState('');
  const [showDefaultImages, setShowDefaultImages] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const mapRef = useRef(null);

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!title.trim()) newErrors.title = 'Event name is required';
    if (!category) newErrors.category = 'Category is required';
    if (!location) newErrors.location = 'Location is required';
    if (!image) newErrors.image = 'Event image is required';
    if (!maxAttendees || isNaN(Number(maxAttendees))) {
      newErrors.maxAttendees = 'Valid max attendees number is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLocationSelect = async (e: any) => {
    const { latitude, longitude } = e.nativeEvent.coordinate;
    const newLocation = { latitude, longitude };
    setLocation(newLocation);
    const addr = await getAddressFromCoordinates(newLocation);
    setAddress(addr);
  };

  const handleImagePick = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.images,
        allowsEditing: true,
        aspect: [16, 9],
        quality: 1,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setImage(result.assets[0].uri);
        setShowDefaultImages(false);
      }
    } catch (error) {
      console.error('Error picking image:', error);
    }
  };

  const handleCreate = () => {
    if (!validateForm()) return;

    const eventManager = EventManager.getInstance();
    const newEvent = {
      id: `event-${Date.now()}`,
      title,
      category,
      color: categoryColor,
      date: date.toLocaleDateString(),
      time: time.toLocaleTimeString(),
      location: address,
      latitude: location!.latitude,
      longitude: location!.longitude,
      description: '',
      attendees: 0,
      maxAttendees: parseInt(maxAttendees),
      distance: 0,
      isPrivate: false,
      image,
      createdBy: 'Alex Johnson',
      createdAt: new Date().toISOString(),
    };

    eventManager.addEvent(newEvent);
    eventManager.createEventNotification(newEvent);
    router.back();
  };

  const handleDateTimeChange = (event: any, selectedDate: Date | undefined, type: 'date' | 'time') => {
    if (Platform.OS === 'web') {
      if (type === 'date') {
        setDate(selectedDate || date);
      } else {
        setTime(selectedDate || time);
      }
    } else {
      if (event.type === 'set' && selectedDate) {
        if (type === 'date') {
          setDate(selectedDate);
          setShowDatePicker(false);
        } else {
          setTime(selectedDate);
          setShowTimePicker(false);
        }
      } else {
        setShowDatePicker(false);
        setShowTimePicker(false);
      }
    }
  };

  const renderDateTimePicker = () => {
    if (Platform.OS === 'web') {
      return (
        <View style={styles.dateTimeContainer}>
          <View style={styles.dateTimeButton}>
            <Calendar size={20} color={Colors.text.primary} />
            <input
              type="date"
              value={date.toISOString().split('T')[0]}
              onChange={(e) => {
                const newDate = new Date(e.target.value);
                handleDateTimeChange(null, newDate, 'date');
              }}
              style={{
                marginLeft: 8,
                fontFamily: 'Inter-Regular',
                fontSize: 16,
                color: Colors.text.primary,
                border: 'none',
                background: 'transparent',
              }}
            />
          </View>
          <View style={styles.dateTimeButton}>
            <Clock size={20} color={Colors.text.primary} />
            <input
              type="time"
              value={time.toTimeString().split(' ')[0].slice(0, 5)}
              onChange={(e) => {
                const [hours, minutes] = e.target.value.split(':');
                const newTime = new Date(time);
                newTime.setHours(parseInt(hours), parseInt(minutes));
                handleDateTimeChange(null, newTime, 'time');
              }}
              style={{
                marginLeft: 8,
                fontFamily: 'Inter-Regular',
                fontSize: 16,
                color: Colors.text.primary,
                border: 'none',
                background: 'transparent',
              }}
            />
          </View>
        </View>
      );
    }

    return (
      <>
        <View style={styles.dateTimeContainer}>
          <TouchableOpacity
            style={styles.dateTimeButton}
            onPress={() => setShowDatePicker(true)}
          >
            <Calendar size={20} color={Colors.text.primary} />
            <Text style={styles.dateTimeText}>
              {date.toLocaleDateString()}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.dateTimeButton}
            onPress={() => setShowTimePicker(true)}
          >
            <Clock size={20} color={Colors.text.primary} />
            <Text style={styles.dateTimeText}>
              {time.toLocaleTimeString()}
            </Text>
          </TouchableOpacity>
        </View>

        {Platform.OS !== 'web' && showDatePicker && (
          <DateTimePicker
            value={date}
            mode="date"
            is24Hour={true}
            onChange={(event, selectedDate) => 
              handleDateTimeChange(event, selectedDate, 'date')
            }
          />
        )}

        {Platform.OS !== 'web' && showTimePicker && (
          <DateTimePicker
            value={time}
            mode="time"
            is24Hour={true}
            onChange={(event, selectedDate) => 
              handleDateTimeChange(event, selectedDate, 'time')
            }
          />
        )}
      </>
    );
  };

  const renderLocationPicker = () => {
    if (Platform.OS === 'web') {
      return (
        <View style={styles.webLocationContainer}>
          <Text style={styles.webLocationText}>
            Location selection is not available on web. Please use the mobile app for full functionality.
          </Text>
        </View>
      );
    }

    if (!MapView) {
      return (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Map components failed to load. Please try again.</Text>
        </View>
      );
    }

    return (
      <View style={styles.mapContainer}>
        <MapView
          ref={mapRef}
          style={styles.map}
          onPress={handleLocationSelect}
          initialRegion={{
            latitude: 37.78825,
            longitude: -122.4324,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        >
          {location && (
            <Marker
              coordinate={{
                latitude: location.latitude,
                longitude: location.longitude,
              }}
            />
          )}
        </MapView>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => router.back()}
        >
          <X size={24} color={Colors.text.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Create Event</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.label}>Event Name*</Text>
          <TextInput
            style={[styles.input, errors.title && styles.inputError]}
            value={title}
            onChangeText={setTitle}
            placeholder="Enter event name"
            placeholderTextColor={Colors.text.secondary}
          />
          {errors.title && <Text style={styles.errorText}>{errors.title}</Text>}
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Category*</Text>
          <View style={styles.categoryGrid}>
            {categories.map((cat) => (
              <TouchableOpacity
                key={cat.name}
                style={[
                  styles.categoryButton,
                  category === cat.name && { backgroundColor: cat.color }
                ]}
                onPress={() => {
                  setCategory(cat.name);
                  setCategoryColor(cat.color);
                }}
              >
                <Text
                  style={[
                    styles.categoryText,
                    category === cat.name && styles.categoryTextSelected
                  ]}
                >
                  {cat.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          {errors.category && <Text style={styles.errorText}>{errors.category}</Text>}
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Date and Time*</Text>
          {renderDateTimePicker()}
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Location*</Text>
          {renderLocationPicker()}
          {location && (
            <View style={styles.locationInfo}>
              <MapPin size={16} color={Colors.text.secondary} />
              <Text style={styles.locationText}>{address}</Text>
            </View>
          )}
          {errors.location && <Text style={styles.errorText}>{errors.location}</Text>}
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Max Attendees*</Text>
          <View style={styles.attendeesInput}>
            <Users size={20} color={Colors.text.secondary} />
            <TextInput
              style={styles.numberInput}
              value={maxAttendees}
              onChangeText={setMaxAttendees}
              keyboardType="number-pad"
              placeholder="Enter maximum number of attendees"
              placeholderTextColor={Colors.text.secondary}
            />
          </View>
          {errors.maxAttendees && (
            <Text style={styles.errorText}>{errors.maxAttendees}</Text>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Event Image*</Text>
          {image ? (
            <View style={styles.imagePreviewContainer}>
              <Image source={{ uri: image }} style={styles.imagePreview} />
              <TouchableOpacity
                style={styles.changeImageButton}
                onPress={() => setShowDefaultImages(true)}
              >
                <Text style={styles.changeImageText}>Change Image</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity
              style={styles.imageButton}
              onPress={() => setShowDefaultImages(true)}
            >
              <ImageIcon size={24} color={Colors.text.secondary} />
              <Text style={styles.imageButtonText}>Add Event Image</Text>
            </TouchableOpacity>
          )}
          {errors.image && <Text style={styles.errorText}>{errors.image}</Text>}
        </View>

        {showDefaultImages && (
          <View style={styles.defaultImagesContainer}>
            <Text style={styles.defaultImagesTitle}>Choose an Image</Text>
            <View style={styles.defaultImagesGrid}>
              {defaultImages.map((img, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.defaultImageButton}
                  onPress={() => {
                    setImage(img);
                    setShowDefaultImages(false);
                  }}
                >
                  <Image source={{ uri: img }} style={styles.defaultImage} />
                </TouchableOpacity>
              ))}
              <TouchableOpacity
                style={styles.uploadButton}
                onPress={handleImagePick}
              >
                <ImageIcon size={24} color={Colors.text.secondary} />
                <Text style={styles.uploadButtonText}>Upload Custom</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        <TouchableOpacity style={styles.createButton} onPress={handleCreate}>
          <Text style={styles.createButtonText}>Create Event</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
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
    marginTop: 8,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 20,
    color: Colors.text.primary,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  label: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: Colors.text.primary,
    marginBottom: 8,
  },
  input: {
    backgroundColor: Colors.white,
    borderRadius: 8,
    padding: 12,
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: Colors.text.primary,
  },
  inputError: {
    borderWidth: 1,
    borderColor: Colors.error,
  },
  errorText: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: Colors.error,
    marginTop: 4,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -4,
  },
  categoryButton: {
    backgroundColor: Colors.lightGray,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    margin: 4,
  },
  categoryText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: Colors.text.primary,
  },
  categoryTextSelected: {
    color: Colors.white,
  },
  dateTimeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dateTimeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    padding: 12,
    borderRadius: 8,
    marginHorizontal: 4,
  },
  dateTimeText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: Colors.text.primary,
    marginLeft: 8,
  },
  mapContainer: {
    height: 200,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: Colors.lightGray,
  },
  map: {
    flex: 1,
  },
  webLocationContainer: {
    height: 200,
    borderRadius: 8,
    backgroundColor: Colors.lightGray,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  webLocationText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: Colors.text.secondary,
    textAlign: 'center',
  },
  locationInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
  },
  locationText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: Colors.text.primary,
    marginLeft: 8,
  },
  attendeesInput: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    padding: 12,
    borderRadius: 8,
  },
  numberInput: {
    flex: 1,
    marginLeft: 8,
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: Colors.text.primary,
  },
  imageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.white,
    padding: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: Colors.lightGray,
    borderStyle: 'dashed',
  },
  imageButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: Colors.text.secondary,
    marginLeft: 8,
  },
  imagePreviewContainer: {
    borderRadius: 8,
    overflow: 'hidden',
  },
  imagePreview: {
    width: '100%',
    height: 200,
    borderRadius: 8,
  },
  changeImageButton: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  changeImageText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: Colors.white,
  },
  defaultImagesContainer: {
    marginBottom: 24,
  },
  defaultImagesTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: Colors.text.primary,
    marginBottom: 12,
  },
  defaultImagesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -4,
  },
  defaultImageButton: {
    width: '48%',
    aspectRatio: 16 / 9,
    margin: 4,
    borderRadius: 8,
    overflow: 'hidden',
  },
  defaultImage: {
    width: '100%',
    height: '100%',
  },
  uploadButton: {
    width: '48%',
    aspectRatio: 16 / 9,
    margin: 4,
    borderRadius: 8,
    backgroundColor: Colors.lightGray,
    alignItems: 'center',
    justifyContent: 'center',
  },
  uploadButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: Colors.text.secondary,
    marginTop: 8,
  },
  createButton: {
    backgroundColor: Colors.primary,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 32,
  },
  createButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: Colors.white,
  },
  errorContainer: {
    height: 200,
    borderRadius: 8,
    backgroundColor: Colors.lightGray,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
});