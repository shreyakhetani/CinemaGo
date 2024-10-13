import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, Alert, StyleSheet } from 'react-native';
import axios from 'axios';

// Define the types for seat statuses
type SeatStatus = 'free' | 'booked' | 'selected';
type Seats = SeatStatus[][];
type SelectedSeat = { row: number; col: number };

export default function SeatSelectionScreen() {
    const [seats, setSeats] = useState<Seats>([]);
    const [loading, setLoading] = useState(true);
    const [selectedSeats, setSelectedSeats] = useState<SelectedSeat[]>([]);

    const showId = '670a3162df788823e60e38b6'; // Replace with the actual show ID

    useEffect(() => {
        // Fetch available seats from the backend
        axios
            .get(`http://192.168.32.196:5000/api/movies/showtimes/${showId}/seats`)
            .then((response) => {
                setSeats(response.data); // Expecting a 2D array of seats
                setLoading(false);
            })
            .catch((error) => {
                console.error('Error fetching seat data:', error);
                setLoading(false);
            });
    }, []);

    const handleSeatSelect = (rowIndex: number, colIndex: number) => {
        const selectedSeat = { row: rowIndex, col: colIndex };

        const isAlreadySelected = selectedSeats.some(
            (seat) => seat.row === rowIndex && seat.col === colIndex
        );

        if (isAlreadySelected) {
            const updatedSelectedSeats = selectedSeats.filter(
                (seat) => !(seat.row === rowIndex && seat.col === colIndex)
            );
            setSelectedSeats(updatedSelectedSeats);

            const updatedSeats = [...seats];
            updatedSeats[rowIndex][colIndex] = 'free';
            setSeats(updatedSeats);
        } else {
            setSelectedSeats([...selectedSeats, selectedSeat]);

            const updatedSeats = [...seats];
            updatedSeats[rowIndex][colIndex] = 'selected';
            setSeats(updatedSeats);
        }
    };

    const handleConfirmBooking = async () => {
        if (selectedSeats.length > 0) {
            try {
                const response = await axios.post('http://192.168.32.196:5000/api/movies/book-seats', {
                    showId,
                    seats: selectedSeats,
                });

                if (response.status === 201) {
                    const updatedSeats = [...seats];
                    selectedSeats.forEach(({ row, col }) => {
                        updatedSeats[row][col] = 'booked';
                    });
                    setSeats(updatedSeats);
                    setSelectedSeats([]);

                    Alert.alert('Booking Confirmed', `You have successfully booked ${selectedSeats.length} seat(s).`);
                } else {
                    Alert.alert('Booking Error', 'There was an error booking the seats.');
                }
            } catch (error) {
                console.error('Error booking seats:', error);
                Alert.alert('Booking Failed', 'The seats could not be booked. Please try again.');
            }
        } else {
            Alert.alert('No Seats Selected', 'Please select at least one seat before confirming the booking.');
        }
    };

    if (loading) {
        return <ActivityIndicator size="large" color="#0000ff" />;
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Choose your seats</Text>

            {/* SCREEN label with screen effect */}
            <View style={styles.screenContainer}>
                <Text style={styles.screenText}>SCREEN</Text>
                <View style={styles.screenEffect} /> {/* Screen-like visual effect */}
            </View>

            {/* Display row labels and seats as a grid */}
            {seats.map((row: SeatStatus[], rowIndex: number) => (
                <View key={rowIndex} style={styles.rowContainer}>
                    <View style={styles.rowLabel}>
                        <Text style={styles.rowLabelText}>{rowIndex + 1}</Text> {/* Row label inside Text */}
                    </View>
                    {row.map((seat: SeatStatus, colIndex: number) => (
                        <TouchableOpacity
                            key={colIndex}
                            style={[
                                styles.seat,
                                seat === 'free'
                                    ? styles.freeSeat
                                    : seat === 'booked'
                                    ? styles.bookedSeat
                                    : styles.selectedSeat,
                            ]}
                            disabled={seat === 'booked'}
                            onPress={() => handleSeatSelect(rowIndex, colIndex)}
                        >
                            <Text style={styles.seatText}>{colIndex + 1}</Text> {/* Seat number inside Text */}
                        </TouchableOpacity>
                    ))}
                </View>
            ))}

            {selectedSeats.length > 0 && (
                <View style={styles.selectedSeatsContainer}>
                    {/* Display selected seats on separate lines */}
                    <Text style={styles.selectedSeatText}>
                        Selected Seats:{'\n'}
                        {selectedSeats.map((seat) => `Row ${seat.row + 1}, Col ${seat.col + 1}`).join('\n')}
                    </Text>
                    <TouchableOpacity style={styles.confirmButton} onPress={handleConfirmBooking}>
                        <Text style={styles.confirmButtonText}>Confirm Selection</Text>
                    </TouchableOpacity>
                </View>
            )}

            <Text style={styles.instructionText}>
                Choose the seats you want. The reserved places are shown{'\n'}
                in red and your choices in yellow.
            </Text>

            {/* Legend centered below the seat selection area */}
            <View style={styles.legendContainer}>
                <View style={styles.legendItem}>
                    <View style={[styles.legendColorBox, styles.freeSeat]} />
                    <Text style={styles.legendText}>Free seat</Text>
                </View>
                <View style={styles.legendItem}>
                    <View style={[styles.legendColorBox, styles.bookedSeat]} />
                    <Text style={styles.legendText}>Booked seat</Text>
                </View>
                <View style={styles.legendItem}>
                    <View style={[styles.legendColorBox, styles.selectedSeat]} />
                    <Text style={styles.legendText}>Your choice</Text>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 16,
        backgroundColor: '#fff',
        flex: 1,
        alignItems: 'center',
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 16,
        textAlign: 'center',
    },
    screenContainer: {
        marginBottom: 16,
        alignItems: 'center',
        width: '95%',
        maxWidth: 450,
    },
    screenText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#555',
        marginBottom: 8,
        textAlign: 'center',
    },
    screenEffect: {
        width: '100%',
        height: 10,
        backgroundColor: '#D3D3D3',
        borderTopLeftRadius: 50,
        borderTopRightRadius: 50,
        opacity: 0.5,
    },
    rowContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 10,
    },
    rowLabel: {
        width: 30,
        justifyContent: 'center',
        alignItems: 'center',
    },
    rowLabelText: {
        fontSize: 16,
        color: '#000',
    },
    seat: {
        width: 40,
        height: 40,
        margin: 5,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 4,
        borderWidth: 1,
    },
    freeSeat: {
        backgroundColor: '#4CAF50',
        borderColor: '#388E3C',
    },
    bookedSeat: {
        backgroundColor: '#f44336',
        borderColor: '#d32f2f',
    },
    selectedSeat: {
        backgroundColor: '#FFEB3B',
        borderColor: '#FBC02D',
    },
    seatText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    selectedSeatsContainer: {
        alignItems: 'center',
        marginBottom: 16,
        width: '95%',
        maxWidth: 450,
    },
    selectedSeatText: {
        textAlign: 'center',
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 10,
        lineHeight: 24,
    },
    confirmButton: {
        backgroundColor: '#2196F3',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
    },
    confirmButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    instructionText: {
        fontSize: 14,
        marginTop: 20,
        marginBottom: 20,
        textAlign: 'center',
        color: '#333',
        fontWeight: 'bold',
        lineHeight: 20,
    },
    legendContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 20,
        width: '95%',
        maxWidth: 450,
    },
    legendItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 10,
    },
    legendColorBox: {
        width: 20,
        height: 20,
        marginRight: 8,
        borderWidth: 1,
    },
    legendText: {
        fontSize: 14,
    },
});
