import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Button, Alert, ActivityIndicator, ScrollView } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { useLocalSearchParams } from 'expo-router';
import axios from 'axios';
import * as FileSystem from 'expo-file-system';
import { useRouter } from 'expo-router'; // or import { useNavigation } from '@react-navigation/native';

const API_BASE_URL = 'http://192.168.0.12:5000';

type SelectedSeat = { row: number; col: number };
interface UserData {
    email?: string;
    firstName?: string;
    avatar?: string | number;
}

export default function TicketConfirmationScreen() {
    const router = useRouter();  // Initialize the router here
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

    useEffect(() => {
        console.log('Email:', Email); // Log the email for verification
        const fetchMovieDetails = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/api/movies/movies/${movieId}`);
                console.log('Movie Details Response:', response.data); // Add this to log the response
                setMovieDetails(response.data);
            } catch (error) {
                console.error('Error fetching movie details:', error);
            } finally {
                setLoading(false);
            }
        };
    
        fetchMovieDetails();
        loadUserDataFromFile(); // Ensure this is called after fetching movie details
    }, [movieId]);
    
    // Use another useEffect to run the ticket confirmation after UserEmail is updated
    useEffect(() => {
        if (UserEmail) {
            handleTicketConfirmation(); // Run the confirmation logic when UserEmail is available
        }
    }, [UserEmail]);
    
    const loadUserDataFromFile = async () => {
        try {
            const fileInfo = await FileSystem.getInfoAsync(filePath);
            if (!fileInfo.exists) {
                console.log('User data file does not exist.');
                setLoading(false);
                return;
            }
    
            const fileContent = await FileSystem.readAsStringAsync(filePath);
            const userData: UserData = JSON.parse(fileContent);
    
            const useremail = userData.email;
    
            console.log("Email for ticket from file:", useremail);  // Log the email
    
            if (useremail) {
                setUserEmail(useremail);  // Fetch user data if email exists
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
            return;  // Wait until the movie details are fetched
        }
    
        if (Email === UserEmail) {
            const ticketData = {
                movieName: movieDetails.name,
                hallName: movieDetails.halls,
                showtime: showtime,
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
                    Alert.alert('Success', 'Your ticket has been confirmed!', [
                        {
                            text: 'OK',
                            onPress: () => {
                                router.push('/');  // Navigate to index.tsx after the success alert
                            },
                        },
                    ]);
                } else {
                    console.log('Failed to confirm the ticket.');
                }
            } catch (error) {
                console.error('Error confirming the ticket:', error);
            }
        }
    };
    
    const fetchUserData = async (email: string) => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/auth/user?email=${email}`);
            const userData: UserData = await response.json();
            if (response.ok && userData) {
                setFirstName(userData.firstName || null);
            } else {
                setError('Unable to fetch user data.');
            }
        } catch (error) {
            console.error('Error fetching user data:', error);
            setError('Error fetching user data.');
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
