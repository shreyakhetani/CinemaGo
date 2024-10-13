import React from 'react';
import { View, Text, Button } from 'react-native';
import { useRouter } from 'expo-router';  // Use useRouter hook to navigate

export default function HomeScreen() {
  const router = useRouter();  // This replaces `navigation.navigate`

  return (
    <View>
      <Text>Available Movies</Text>
      <Button
        title="Select Seats"
        onPress={() => router.push('./seatSelection')}  // Use `push` to navigate to seat selection
      />
    </View>
  );
}
