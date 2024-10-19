import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Button, Alert, ActivityIndicator, ScrollView } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { useLocalSearchParams } from 'expo-router';
import axios from 'axios';

const API_BASE_URL = 'http://192.168.0.12:5000';

type SelectedSeat = { row: number; col: number };

export default function TicketConfirmationScreen() {
    const params = useLocalSearchParams();
    const selectedSeats: SelectedSeat[] = params.selectedSeats ? JSON.parse(params.selectedSeats as string) : [];
    const movieId = params.movieId as string;
    const hallId = params.hallId as string;
    const showtime = params.showtime as string;
    const movieName = params.movieName as string;
    const hallName = params.hallName as string;

    const [loading, setLoading] = useState(true);
    const [movieDetails, setMovieDetails] = useState<any>(null);

    useEffect(() => {
        const fetchMovieDetails = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/api/movies/movies/${movieId}`);
                setMovieDetails(response.data);
            } catch (error) {
                console.error('Error fetching movie details:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchMovieDetails();
    }, [movieId]);

    if (loading) {
        return <ActivityIndicator size="large" color="#0000ff" />;
    }

    if (!Array.isArray(selectedSeats)) {
        return <Text>No seats selected</Text>;
    }

    const handleTicketConfirmation = () => {
        Alert.alert('Ticket Confirmed', 'Enjoy your movie!');
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>Your Tickets</Text>
            <View style={styles.infoContainer}>
                <Text style={styles.infoText}>Movie: {movieName}</Text>
                <Text style={styles.infoText}>Hall: {hallName}</Text>
                <Text style={styles.infoText}>Showtime: {new Date(showtime).toLocaleString()}</Text>
                <Text style={styles.infoText}>Duration: {movieDetails?.duration}</Text>
                <Text style={styles.infoText}>Language: {movieDetails?.language}</Text>
            </View>

            {selectedSeats.map((seat, index) => (
                <View key={index} style={styles.ticketDetailContainer}>
                    <Text style={styles.seatText}>Seat: Row {seat.row + 1}, Col {seat.col + 1}</Text>
                    <View style={styles.qrCodeContainer}>
                        <QRCode
                            value={JSON.stringify({
                                movieId,
                                hallId,
                                showtime,
                                seat: `Row ${seat.row + 1}, Col ${seat.col + 1}`
                            })}
                            size={150}
                            color="#000"
                            backgroundColor="#fff"
                        />
                    </View>
                </View>
            ))}

            <Button title="Confirm All Tickets" onPress={handleTicketConfirmation} />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        padding: 20,
        backgroundColor: '#000',
    },
    title: {
        fontSize: 40,
        fontWeight: 'bold',
        marginTop: 40,
        marginBottom: 20,
        textAlign: 'center',
        color: '#fff',
    },
    infoContainer: {
        marginBottom: 30,
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    ticketDetailContainer: {
        marginBottom: 30,
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    infoText: {
        fontWeight: 'bold',
        fontSize: 18,
        marginBottom: 10,
        color: '#333',
    },
    qrCodeContainer: {
        marginTop: 20,
        alignItems: 'center',
        backgroundColor: '#f8f8f8',
        padding: 15,
        borderRadius: 5,
    },
    seatText: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 15,
        color: '#1a1a1a',
    },
});