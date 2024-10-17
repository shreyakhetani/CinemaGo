import React from 'react';
import { SafeAreaView, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';

// First screen component
function HomeScreen({ navigation }) {
    return (
        <SafeAreaView style={styles.container}>
            <Text>
                hello this is test    
            </Text>
            {/* Circle button on the right */}
            <TouchableOpacity style={styles.circleButton} onPress={() => navigation.navigate('AnotherPage')}>
                <Text style={styles.circleButtonText}>Go</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
}

// Another page to navigate to
function AnotherPage() {
    return (
        <SafeAreaView style={styles.container}>
            <Text>
                You are on another page!
            </Text>
        </SafeAreaView>
    );
}

const Stack = createStackNavigator();

export default function App() {
    return (
        <Stack.Navigator>
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="AnotherPage" component={AnotherPage} />
        </Stack.Navigator>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    circleButton: {
        position: 'absolute',
        right: 20,
        bottom: 20,
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: 'blue',
        justifyContent: 'center',
        alignItems: 'center',
    },
    circleButtonText: {
        color: 'white',
        fontSize: 18,
    },
});
