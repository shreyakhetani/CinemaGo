import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Button, Alert, ActivityIndicator, ScrollView } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { useLocalSearchParams } from 'expo-router';
import axios from 'axios';
import * as FileSystem from 'expo-file-system';
import { useRouter } from 'expo-router';



const API_BASE_URL = 'http://192.168.0.103:5000';



type SelectedSeat = { row: number; col: number };
interface UserData {
    email?: string;
    firstName?: string;
    avatar?: string | number;
}

export default function TicketConfirmationScreen() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const selectedSeats: SelectedSeat[] = params.selectedSeats ? JSON.parse(params.selectedSeats as string) : [];
    const Email = params.Email as string;
    const movieId = params.movieId as string;
    const hallId = params.hallId as string;
    const showtime = params.showtime as string;
    const movieName = params.movieName as string;
    const hallName = params.hallName as string;
    const [UserEmail, setUserEmail] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [movieDetails, setMovieDetails] = useState<any>(null);
    const filePath = `${FileSystem.documentDirectory}userData.json`;
    const [firstName, setFirstName] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const getTodayDate = (): string => {
        const today = new Date();
        const year = today.getFullYear();
        const month = (today.getMonth() + 1).toString().padStart(2, '0');
        const day = today.getDate().toString().padStart(2, '0');
        return `${day}.${month}.${year}`;
    };
    const todayDate = getTodayDate();


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
        loadUserDataFromFile();
    }, [movieId]);

    useEffect(() => {
        if (UserEmail) {
            handleTicketConfirmation();
        }
    }, [UserEmail]);

    const loadUserDataFromFile = async () => {
        try {
            const fileInfo = await FileSystem.getInfoAsync(filePath);
            if (!fileInfo.exists) {
                setLoading(false);
                return;
            }

            const fileContent = await FileSystem.readAsStringAsync(filePath);
            const userData: UserData = JSON.parse(fileContent);
            const useremail = userData.email;

            if (useremail) {
                setUserEmail(useremail);
            } else {
                setError('No email found in user data.');
                setLoading(false);
            }
        } catch (error) {
            console.error('Error loading user data from file:', error);
            setError('Error loading user data from file.');
        }
    };

    const handleTicketConfirmation = async () => {
        if (!movieDetails) {
            console.log('Movie details not yet available.');
            return;
        }

        if (Email === UserEmail) {
            const ticketData = {
                movieName: movieDetails.name,
                hallName: hallName,
                showtime: new Date(showtime).toLocaleString('en-US', {
                    timeZone: 'Europe/Helsinki',
                    hour12: false
                }),
                duration: movieDetails.duration,
                language: movieDetails.language,
                seat: selectedSeats.map((seat) => `Row ${seat.row + 1}, Col ${seat.col + 1}`).join(', '),
                userEmail: UserEmail,
            };

            try {
                const response = await fetch(`${API_BASE_URL}/api/tickets/new`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(ticketData),
                });

                if (response.ok) {
                    Alert.alert('Success', 'Your ticket has been successfully confirmed! Please check your profile for more details.', [
                        {
                            text: 'OK',
                            onPress: () => {
                                router.push('/');
                            },
                        },
                    ]);
                } else {
                    console.log('Failed to confirm the ticket.');
                }
            } catch (error) {
                console.error('Error confirming the ticket:', error);
            }
        } else {
            try {
                // Create separate ticket data for each seat
                const ticketPromises = selectedSeats.map(async (seat) => {
                    const ticketData = {
                        movieName: movieDetails.name,
                        hallName: hallName,
                        showtime: new Date(showtime).toLocaleString('en-US', {
                            timeZone: 'Europe/Helsinki',
                            hour12: false
                        }),
                        duration: movieDetails.duration,
                        language: movieDetails.language,
                        seat: `Row ${seat.row + 1}, Col ${seat.col + 1}`,
                        userEmail: Email,
                    };

                    return fetch(`${API_BASE_URL}/api/email/send-ticket-email`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(ticketData),
                    });
                });

                await Promise.all(ticketPromises);
                Alert.alert('Success', 'Check your email for the tickets!', [
                    {
                        text: 'OK',
                        onPress: () => {
                            router.push('/');
                        },
                    }
                ]);
            } catch (error) {
                console.error('Error sending the emails:', error);
            }
        }
    };

    if (loading) {
        return <ActivityIndicator size="large" color="#0000ff" />;
    }

    if (!Array.isArray(selectedSeats)) {
        return <Text>No seats selected</Text>;
    }

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>Your Tickets</Text>
            <View style={styles.infoContainer}>
                <Text style={styles.infoText}>Movie: {movieName}</Text>
                <Text style={styles.infoText}>Hall: {hallName}</Text>
                <Text style={styles.infoText}>Showtime: {todayDate} - {new Date(new Date(showtime).getTime() + 3 * 60 * 60 * 1000).toLocaleString('en-US', { 
                                hour: '2-digit', 
                                minute: '2-digit',
                                hour12: false,
                                timeZone: 'Europe/Helsinki'  // Set Helsinki time zone
                            })}</Text>
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