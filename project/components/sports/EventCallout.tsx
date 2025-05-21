import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { CalendarDays, Users, Clock } from 'lucide-react-native';
import { Event } from '@/utils/types';
import Colors from '@/utils/colors';

interface EventCalloutProps {
  event: Event;
  distance: string;
}

export default function EventCallout({ event, distance }: EventCalloutProps) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={[styles.categoryBadge, { backgroundColor: event.color }]}>
          <Text style={styles.categoryText}>{event.category}</Text>
        </View>
        <Text style={styles.distance}>{distance} km</Text>
      </View>
      
      <Text style={styles.title}>{event.title}</Text>
      
      <View style={styles.infoRow}>
        <CalendarDays size={16} color={Colors.text.secondary} />
        <Text style={styles.infoText}>{event.date}</Text>
      </View>
      
      <View style={styles.infoRow}>
        <Clock size={16} color={Colors.text.secondary} />
        <Text style={styles.infoText}>{event.time}</Text>
      </View>
      
      <View style={styles.infoRow}>
        <Users size={16} color={Colors.text.secondary} />
        <Text style={styles.infoText}>{event.attendees} attendees</Text>
      </View>
      
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>View Details</Text>
      </TouchableOpacity>
      
      <View style={styles.arrow} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    borderRadius: 8,
    padding: 12,
    width: 200,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  categoryText: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    color: Colors.white,
  },
  distance: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 12,
    color: Colors.text.secondary,
  },
  title: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: Colors.text.primary,
    marginBottom: 8,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  infoText: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: Colors.text.secondary,
    marginLeft: 8,
  },
  button: {
    backgroundColor: Colors.primary,
    paddingVertical: 8,
    borderRadius: 4,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: Colors.white,
  },
  arrow: {
    position: 'absolute',
    bottom: -10,
    left: '50%',
    marginLeft: -10,
    width: 0,
    height: 0,
    borderLeftWidth: 10,
    borderRightWidth: 10,
    borderTopWidth: 10,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: Colors.white,
  },
});