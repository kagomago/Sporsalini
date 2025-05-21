import * as Location from 'expo-location';
import { EventLocation } from './types';

export async function getCurrentLocation(): Promise<Location.LocationObject | null> {
  try {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      throw new Error('Location permission denied');
    }

    const location = await Location.getCurrentPositionAsync({});
    return location;
  } catch (error) {
    console.error('Error getting location:', error);
    return null;
  }
}

export async function getAddressFromCoordinates(location: EventLocation): Promise<string> {
  try {
    const result = await Location.reverseGeocodeAsync({
      latitude: location.latitude,
      longitude: location.longitude,
    });

    if (result.length > 0) {
      const { street, city, region } = result[0];
      return `${street}, ${city}, ${region}`;
    }
    
    return 'Location not found';
  } catch (error) {
    console.error('Error getting address:', error);
    return 'Location not found';
  }
}