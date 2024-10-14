import React from 'react';
import { View, Text, StyleSheet, Button, Alert } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { useLocalSearchParams } from 'expo-router'; // Import for route params

type SelectedSeat = { row: number; col: number };

export default function TicketConfirmationScreen() {
    const params = useLocalSearchParams();
    const selectedSeats: SelectedSeat[] = params.selectedSeats ? JSON.parse(params.selectedSeats as string) : [];
    
    if (!Array.isArray(selectedSeats)) {
        return <Text>No seats selected</Text>;
    }

    const ticketData = {
        seats: selectedSeats.map(seat => `Row ${seat.row + 1}, Col ${seat.col + 1}`).join(', '),
    };

    const handleTicketConfirmation = () => {
        Alert.alert('Ticket Confirmed', 'Enjoy your movie!');
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Your Ticket</Text>

            {/* Display Seat Information */}
            <View style={styles.infoContainer}>
                <Text style={styles.infoText}>Seats: {ticketData.seats}</Text>
            </View>

            {/* QR Code */}
            <View style={styles.qrCodeContainer}>
                <QRCode
                    value={JSON.stringify(ticketData)} // Encode ticket data in QR code
                    size={200}
                    color="#000"
                    backgroundColor="#fff"
                />
            </View>

            {/* Confirm Ticket Button */}
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
        marginBottom: 10,
    },
    qrCodeContainer: {
        marginBottom: 30,
        alignItems: 'center',
    },
});
