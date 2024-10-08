import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import MovieList from '../../Screens/MovieList';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
// import LoginScreen from './screens/LoginScreen';
// import SignupScreen from './screens/SignupScreen';

const Stack = createStackNavigator();

export default function App() {
    return (
        <SafeAreaView style={styles.container}>
            <MovieList />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 20,
    },
});
