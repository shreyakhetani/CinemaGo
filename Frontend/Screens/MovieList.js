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
        return <ActivityIndicator size="large" color="#0000ff" />;
    }

    if (error) {
        return <Text>Error: {error}</Text>;
    }

    return (
        <FlatList
            data={movies}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => (
                <View style={styles.item}>
                    <Text style={styles.title}>{item.title}</Text>
                    <Text>{item.genre}</Text>
                    {/* Display the raw releaseDate for debugging */}
                    <Text>Raw Release Date: {item.releaseDate}</Text>
                    {/* Format the release date */}
                    <Text>Formatted Date: {formatDate(item.releaseDate)}</Text>
                    <Text>{item.duration} minutes</Text>
                    <Text>{item.description}</Text>
                </View>
            )}
        />
    );
};

// Function to format date
const formatDate = (dateString) => {
    console.log("Received dateString:", dateString); // Log the input
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? "Invalid Date" : date.toLocaleDateString();
};

const styles = StyleSheet.create({
    item: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default MovieList; // Ensure this is at the end of the file
