import { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Platform, TouchableOpacity } from 'react-native';
import { MapPin, Navigation } from 'lucide-react-native';
import * as Location from 'expo-location';
import EventCallout from '@/components/sports/EventCallout';
import EventManager from '@/utils/eventManager';
import Colors from '@/utils/colors';

// Define map types without direct imports
interface MapViewProps {
  ref: any;
  style: any;
  initialRegion: {
    latitude: number;
    longitude: number;
    latitudeDelta: number;
    longitudeDelta: number;
  };
  showsUserLocation?: boolean;
  onPress?: (e: any) => void;
  children?: React.ReactNode;
}

interface MarkerProps {
  coordinate: {
    latitude: number;
    longitude: number;
  };
  children?: React.ReactNode;
}

interface CalloutProps {
  tooltip?: boolean;
  children?: React.ReactNode;
}

// Only import map components on native platforms
let MapView: React.ComponentType<MapViewProps>;
let Marker: React.ComponentType<MarkerProps>;
let Callout: React.ComponentType<CalloutProps>;

if (Platform.OS !== 'web') {
  const Maps = require('react-native-maps');
  MapView = Maps.default;
  Marker = Maps.Marker;
  Callout = Maps.Callout;
}

export default function SportsMap() {
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [mapRef, setMapRef] = useState<any>(null);
  const [events, setEvents] = useState(EventManager.getInstance().getEvents());

  useEffect(() => {
    (async () => {
      if (Platform.OS === 'web') return;
      
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    })();

    // Listen for new events
    const eventManager = EventManager.getInstance();
    const handleEventsUpdate = (updatedEvents: any[]) => {
      setEvents(updatedEvents);
    };
    
    eventManager.addEventListener(handleEventsUpdate);
    
    return () => {
      eventManager.removeEventListener(handleEventsUpdate);
    };
  }, []);

  const goToMyLocation = () => {
    if (location && mapRef) {
      mapRef.animateToRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });
    }
  };

  if (Platform.OS === 'web') {
    return (
      <View style={styles.webContainer}>
        <Text style={styles.webMessage}>
          Map view is not available on web. Please use the mobile app for full functionality.
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

  if (errorMsg) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{errorMsg}</Text>
      </View>
    );
  }

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const d = R * c; // Distance in km
    return d.toFixed(1);
  };

  const deg2rad = (deg: number) => {
    return deg * (Math.PI/180);
  };

  return (
    <>
      <MapView
        ref={setMapRef}
        style={styles.map}
        initialRegion={{
          latitude: location?.coords.latitude || 37.78825,
          longitude: location?.coords.longitude || -122.4324,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
        showsUserLocation={true}
      >
        {events.map((event) => (
          <Marker
            key={event.id}
            coordinate={{
              latitude: event.latitude,
              longitude: event.longitude,
            }}
          >
            <View style={styles.markerContainer}>
              <View style={[styles.marker, { backgroundColor: event.color }]}>
                <MapPin size={16} color={Colors.white} />
              </View>
            </View>
            <Callout tooltip>
              <EventCallout 
                event={event} 
                distance={
                  location ? 
                  calculateDistance(
                    location.coords.latitude,
                    location.coords.longitude,
                    event.latitude,
                    event.longitude
                  ) : '?'
                }
              />
            </Callout>
          </Marker>
        ))}
      </MapView>
      
      <TouchableOpacity 
        style={styles.locationButton}
        onPress={goToMyLocation}
      >
        <Navigation size={24} color={Colors.primary} />
      </TouchableOpacity>
    </>
  );
}

const styles = StyleSheet.create({
  map: {
    width: '100%',
    height: '100%',
  },
  webContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  markerContainer: {
    alignItems: 'center',
  },
  marker: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Colors.white,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 5,
  },
  locationButton: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 5,
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  errorText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: Colors.text.primary,
    textAlign: 'center',
  },
  webMessage: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: Colors.text.primary,
    textAlign: 'center',
  },
});