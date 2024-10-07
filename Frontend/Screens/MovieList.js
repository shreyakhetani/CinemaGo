import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet } from 'react-native';
import axios from 'axios';

const MovieList = () => {
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchMovies = async () => {
            try {
                // Use your local IP address to access the API
                const response = await axios.get('http://192.168.0.12:5000/api/movies');
                setMovies(response.data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchMovies();
    }, []);

    if (loading) {
        return <ActivityIndicator size="large" color="#00ffcc" style={styles.loader} />;
    }

    if (error) {
        return <Text style={styles.errorText}>Error: {error}</Text>;
    }

    return (
        <FlatList
            data={movies}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => (
                <View style={styles.item}>
                    <Text style={styles.title}>{item.title}</Text>
                    <Text style={styles.genre}>{item.genre}</Text>
                    {/* Display the raw releaseDate for debugging */}
                    <Text style={styles.releaseDate}>Raw Release Date: {item.releaseDate}</Text>
                    {/* Format the release date */}
                    <Text style={styles.formattedDate}>Formatted Date: {formatDate(item.releaseDate)}</Text>
                    <Text style={styles.duration}>{item.duration} minutes</Text>
                    <Text style={styles.description}>{item.description}</Text>
                </View>
            )}
        />
    );
};

// Function to format date
const formatDate = (dateString) => {
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? "Invalid Date" : date.toLocaleDateString();
};

const styles = StyleSheet.create({
    loader: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#1a1a2e', // Dark cyber background
    },
    errorText: {
        color: '#ff005c', // Vibrant error color
        fontSize: 18,
        textAlign: 'center',
        marginTop: 20,
    },
    item: {
        padding: 15,
        marginVertical: 10,
        backgroundColor: '#0f0f1f', // Darker background for cyber effect
        borderRadius: 8,
        borderWidth: 2,
        borderColor: '#00ffcc', // Neon glow border
        shadowColor: '#00ffcc',
        shadowOpacity: 0.7,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 0 },
        elevation: 5, // Shadow for Android
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#00ffcc', // Neon blue
        marginBottom: 5,
        fontFamily: 'monospace', // Cyber-style font
    },
    genre: {
        color: '#f72585', // Vibrant pink
        fontSize: 16,
    },
    releaseDate: {
        color: '#ffba08', // Neon yellow
        fontSize: 14,
    },
    formattedDate: {
        color: '#00ffcc', // Neon blue
        fontSize: 14,
        marginBottom: 5,
    },
    duration: {
        color: '#ffba08', // Neon yellow
        fontSize: 14,
    },
    description: {
        color: '#adb5bd', // Light gray text for description
        fontSize: 14,
        marginTop: 10,
        fontStyle: 'italic',
    },
});

export default MovieList;
