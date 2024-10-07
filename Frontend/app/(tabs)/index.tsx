import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import MovieList from '../../Screens/MovieList';

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
