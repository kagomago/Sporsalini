import { Stack } from 'expo-router';
import Colors from '@/utils/colors';

export default function SportsLayout() {
  return (
    <Stack>
      <Stack.Screen 
        name="index"
        options={{
          headerShown: false,
          contentStyle: {
            backgroundColor: Colors.background,
          }
        }}
      />
      <Stack.Screen 
        name="forum"
        options={{
          title: 'Facilities',
          headerStyle: {
            backgroundColor: Colors.background,
          },
          headerShadowVisible: false,
          headerTitleStyle: {
            fontFamily: 'Inter-SemiBold',
            fontSize: 20,
          },
          contentStyle: {
            backgroundColor: Colors.background,
          }
        }}
      />
      <Stack.Screen 
        name="buddy"
        options={{
          title: 'Trainers',
          headerStyle: {
            backgroundColor: Colors.background,
          },
          headerShadowVisible: false,
          headerTitleStyle: {
            fontFamily: 'Inter-SemiBold',
            fontSize: 20,
          },
          contentStyle: {
            backgroundColor: Colors.background,
          }
        }}
      />
      <Stack.Screen 
        name="events"
        options={{
          title: 'Activities',
          headerStyle: {
            backgroundColor: Colors.background,
          },
          headerShadowVisible: false,
          headerTitleStyle: {
            fontFamily: 'Inter-SemiBold',
            fontSize: 20,
          },
          contentStyle: {
            backgroundColor: Colors.background,
          }
        }}
      />
    </Stack>
  );
}