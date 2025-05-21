import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { CalendarDays, MapPin, Users, ChevronRight } from 'lucide-react-native';
import { Event } from '@/utils/types';
import Colors from '@/utils/colors';

interface EventCardProps {
  event: Event;
}

export default function EventCard({ event }: EventCardProps) {
  return (
    <TouchableOpacity style={styles.container}>
      <View style={styles.content}>
        <View style={[styles.categoryBar, { backgroundColor: event.color }]} />
        
        <View style={styles.details}>
          <View style={styles.header}>
            <Text style={styles.title}>{event.title}</Text>
            <View style={[styles.categoryBadge, { backgroundColor: event.color }]}>
              <Text style={styles.categoryText}>{event.category}</Text>
            </View>
          </View>
          
          <View style={styles.infoContainer}>
            <View style={styles.infoRow}>
              <CalendarDays size={16} color={Colors.text.secondary} />
              <Text style={styles.infoText}>{event.date} • {event.time}</Text>
            </View>
            
            <View style={styles.infoRow}>
              <MapPin size={16} color={Colors.text.secondary} />
              <Text style={styles.infoText} numberOfLines={1}>
                {event.location} ({event.distance} km away)
              </Text>
            </View>
            
            <View style={styles.infoRow}>
              <Users size={16} color={Colors.text.secondary} />
              <Text style={styles.infoText}>{event.attendees} attendees</Text>
            </View>
          </View>
          
          <View style={styles.footer}>
            <TouchableOpacity style={styles.button}>
              <Text style={styles.buttonText}>Join</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.arrowButton}>
              <ChevronRight size={20} color={Colors.text.secondary} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
    overflow: 'hidden',
  },
  content: {
    flexDirection: 'row',
  },
  categoryBar: {
    width: 6,
    height: '100%',
  },
  details: {
    flex: 1,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: Colors.text.primary,
    flex: 1,
  },
  categoryBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginLeft: 8,
  },
  categoryText: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    color: Colors.white,
  },
  infoContainer: {
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: Colors.text.secondary,
    marginLeft: 8,
    flex: 1,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  button: {
    backgroundColor: Colors.primary,
    paddingVertical: 8,
    paddingHorizontal: 24,
    borderRadius: 4,
  },
  buttonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: Colors.white,
  },
  arrowButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 'auto',
  },
});