import { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput } from 'react-native';
import { Filter } from 'lucide-react-native';
import BuddyCard from '@/components/sports/BuddyCard';
import { mockUsers } from '@/utils/mockData';
import Colors from '@/utils/colors';

export default function BuddyFinderScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedSports, setSelectedSports] = useState<string[]>([]);
  const [maxDistance, setMaxDistance] = useState<number>(50);
  
  const sportFilters = ['Running', 'Cycling', 'Swimming', 'Yoga', 'Basketball', 'Tennis', 'Gym'];
  
  const toggleSportFilter = (sport: string) => {
    if (selectedSports.includes(sport)) {
      setSelectedSports(selectedSports.filter(s => s !== sport));
    } else {
      setSelectedSports([...selectedSports, sport]);
    }
  };
  
  const filteredUsers = mockUsers.filter(user => {
    // Filter by search query
    if (searchQuery && !user.name.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    // Filter by selected sports
    if (selectedSports.length > 0 && !user.interests.some(sport => selectedSports.includes(sport))) {
      return false;
    }
    
    // Filter by distance
    if (user.distance > maxDistance) {
      return false;
    }
    
    return true;
  });
  
  return (
    <View style={styles.container}>
      <View style={styles.searchBar}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search buddies..."
          placeholderTextColor={Colors.text.secondary}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <TouchableOpacity 
          style={[styles.filterButton, showFilters && styles.filterButtonActive]} 
          onPress={() => setShowFilters(!showFilters)}
        >
          <Filter size={20} color={showFilters ? Colors.white : Colors.text.primary} />
        </TouchableOpacity>
      </View>
      
      {showFilters && (
        <View style={styles.filtersContainer}>
          <Text style={styles.filterTitle}>Sports</Text>
          <View style={styles.sportsFilter}>
            {sportFilters.map(sport => (
              <TouchableOpacity
                key={sport}
                style={[
                  styles.sportChip,
                  selectedSports.includes(sport) && styles.sportChipSelected,
                ]}
                onPress={() => toggleSportFilter(sport)}
              >
                <Text
                  style={[
                    styles.sportChipText,
                    selectedSports.includes(sport) && styles.sportChipTextSelected,
                  ]}
                >
                  {sport}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          
          <Text style={styles.filterTitle}>Max Distance: {maxDistance} km</Text>
          <View style={styles.sliderContainer}>
            <Text style={styles.sliderLabel}>0</Text>
            <View style={styles.sliderTrack}>
              <View 
                style={[
                  styles.sliderFill, 
                  { width: `${(maxDistance / 100) * 100}%` }
                ]} 
              />
              <TouchableOpacity
                style={[
                  styles.sliderThumb, 
                  { left: `${(maxDistance / 100) * 100}%` }
                ]}
                onStartShouldSetResponder={() => true}
                onResponderMove={(event) => {
                  const { locationX } = event.nativeEvent;
                  const sliderWidth = 280; // width of slider minus thumb width
                  const percentage = Math.max(0, Math.min(1, locationX / sliderWidth));
                  setMaxDistance(Math.round(percentage * 100));
                }}
              />
            </View>
            <Text style={styles.sliderLabel}>100</Text>
          </View>
        </View>
      )}
      
      <FlatList
        data={filteredUsers}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <BuddyCard user={item} />
        )}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No buddies match your filters</Text>
            <TouchableOpacity 
              style={styles.resetButton}
              onPress={() => {
                setSearchQuery('');
                setSelectedSports([]);
                setMaxDistance(50);
              }}
            >
              <Text style={styles.resetButtonText}>Reset Filters</Text>
            </TouchableOpacity>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  searchInput: {
    flex: 1,
    height: 40,
    backgroundColor: Colors.lightGray,
    borderRadius: 8,
    paddingHorizontal: 12,
    color: Colors.text.primary,
    fontFamily: 'Inter-Regular',
  },
  filterButton: {
    marginLeft: 12,
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: Colors.lightGray,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterButtonActive: {
    backgroundColor: Colors.primary,
  },
  filtersContainer: {
    padding: 16,
    backgroundColor: Colors.background,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  filterTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: Colors.text.primary,
    marginBottom: 8,
  },
  sportsFilter: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  sportChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: Colors.lightGray,
    marginRight: 8,
    marginBottom: 8,
  },
  sportChipSelected: {
    backgroundColor: Colors.primary,
  },
  sportChipText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: Colors.text.primary,
  },
  sportChipTextSelected: {
    color: Colors.white,
  },
  sliderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  sliderLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: Colors.text.secondary,
    width: 30,
  },
  sliderTrack: {
    height: 4,
    backgroundColor: Colors.lightGray,
    borderRadius: 2,
    flex: 1,
    position: 'relative',
    marginHorizontal: 8,
  },
  sliderFill: {
    height: 4,
    backgroundColor: Colors.primary,
    borderRadius: 2,
    position: 'absolute',
    left: 0,
  },
  sliderThumb: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: Colors.primary,
    position: 'absolute',
    top: -8,
    marginLeft: -10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  listContent: {
    padding: 16,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: Colors.text.secondary,
    marginBottom: 16,
  },
  resetButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  resetButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: Colors.white,
  },
});