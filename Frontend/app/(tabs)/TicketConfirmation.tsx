import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Button, Alert, ActivityIndicator } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { useLocalSearchParams } from 'expo-router';
import axios from 'axios';

const API_BASE_URL = 'http://192.168.32.196:5000';

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

    const ticketData = {
        movieId,
        hallId,
        showtime,
        seats: selectedSeats.map(seat => `Row ${seat.row + 1}, Col ${seat.col + 1}`).join(', '),
    };

    const handleTicketConfirmation = () => {
        Alert.alert('Ticket Confirmed', 'Enjoy your movie!');
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Your Ticket</Text>

            <View style={styles.infoContainer}>
                <Text style={styles.infoText}>Movie: {movieName}</Text>
                <Text style={styles.infoText}>Hall: {hallName}</Text>
                <Text style={styles.infoText}>Showtime: {new Date(showtime).toLocaleString()}</Text>
                <Text style={styles.infoText}>Duration: {movieDetails?.duration}</Text>
                <Text style={styles.infoText}>Language: {movieDetails?.language}</Text>
                <Text style={styles.infoText}>Seats:</Text>
                {selectedSeats.map((seat, index) => (
                    <Text key={index} style={styles.seatText}>
                        Row {seat.row + 1}, Col {seat.col + 1}
                    </Text>
                ))}
            </View>

            <View style={styles.qrCodeContainer}>
                <QRCode
                    value={JSON.stringify(ticketData)}
                    size={200}
                    color="#000"
                    backgroundColor="#fff"
                />
            </View>

            <Button title="Confirm Ticket" onPress={handleTicketConfirmation} />
        </View>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    infoContainer: {
        marginBottom: 30,
        alignItems: 'center',
    },
    infoText: {
        fontSize: 18,
        marginBottom: 5, // Adjust spacing between seats
    },
    qrCodeContainer: {
        marginBottom: 30,
        alignItems: 'center',
    },
    seatText: {
        fontSize: 16,
        marginLeft: 10,
    },
});
