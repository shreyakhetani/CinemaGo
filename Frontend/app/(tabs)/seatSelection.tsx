import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, Alert, ScrollView, StyleSheet, Dimensions, Button } from 'react-native';
import axios from 'axios';

const { width: screenWidth } = Dimensions.get('window');

type SeatStatus = 'free' | 'booked' | 'selected';
type Seats = SeatStatus[][];
type SelectedSeat = { row: number; col: number };

export default function SeatSelectionScreen() {
    const [seats, setSeats] = useState<Seats>([]);
    const [loading, setLoading] = useState(true);
    const [selectedSeats, setSelectedSeats] = useState<SelectedSeat[]>([]);
    const [adultTickets, setAdultTickets] = useState(0);
    const [childTickets, setChildTickets] = useState(0);
    const [pensionerTickets, setPensionerTickets] = useState(0);
    const [studentTickets, setStudentTickets] = useState(0);

    const showId = '670a3162df788823e60e38b6';

    useEffect(() => {
        axios.get(`http://192.168.32.196:5000/api/movies/showtimes/${showId}/seats`)
            .then((response) => {
                setSeats(response.data);
                setLoading(false);
            })
            .catch((error) => {
                console.error('Error fetching seat data:', error);
                setLoading(false);
            });
    }, []);

    const handleSeatSelect = (rowIndex: number, colIndex: number) => {
        const newSelected = { row: rowIndex, col: colIndex };
        const index = selectedSeats.findIndex(seat => seat.row === rowIndex && seat.col === colIndex);
        if (index >= 0) {
            const newSelectedSeats = selectedSeats.filter((_, i) => i !== index);
            setSelectedSeats(newSelectedSeats);
            adjustTicketCounts(newSelectedSeats.length);
        } else {
            setSelectedSeats([...selectedSeats, newSelected]);
            adjustTicketCounts(selectedSeats.length + 1);
        }
    };

    const adjustTicketCounts = (maxSeats: number) => {
        const totalTickets = adultTickets + childTickets + pensionerTickets + studentTickets;
        if (totalTickets > maxSeats) {
            setAdultTickets(Math.min(adultTickets, maxSeats));
            setChildTickets(Math.min(childTickets, maxSeats - adultTickets));
            setPensionerTickets(Math.min(pensionerTickets, maxSeats - adultTickets - childTickets));
            setStudentTickets(Math.min(studentTickets, maxSeats - adultTickets - childTickets - pensionerTickets));
        }
    };

    const fetchSeatsData = () => {
        setLoading(true); // Show loading indicator
        axios.get(`http://192.168.32.196:5000/api/movies/showtimes/${showId}/seats`)
            .then((response) => {
                setSeats(response.data);
                setLoading(false); // Hide loading indicator after fetching
            })
            .catch((error) => {
                console.error('Error fetching seat data:', error);
                setLoading(false);
            });
    };
    
    // Fetch seat data on component load
    useEffect(() => {
        fetchSeatsData(); // Call this function when the component loads
    }, []);
    
    const handleConfirmBooking = async () => {
        const totalTickets = adultTickets + childTickets + pensionerTickets + studentTickets;
    
        // Check if the total tickets match the number of selected seats
        if (selectedSeats.length === 0) {
            Alert.alert('No Seats Selected', 'Please select at least one seat before confirming the booking.');
            return;
        }
    
        if (totalTickets !== selectedSeats.length) {
            Alert.alert('Incomplete Ticket Selection', 'Please ensure that you have selected ticket types for all the selected seats.');
            return;
        }
    
        try {
            const response = await axios.post('http://192.168.32.196:5000/api/movies/book-seats', {
                showId,
                seats: selectedSeats,
            });
            if (response.status === 201) {
                // Reset state variables after booking confirmation
                setSelectedSeats([]);
                setAdultTickets(0);
                setChildTickets(0);
                setPensionerTickets(0);
                setStudentTickets(0);
    
                // Show confirmation alert
                Alert.alert('Booking Confirmed', `You have successfully booked ${selectedSeats.length} seat(s). Total price: €${(adultTickets * 15) + (childTickets * 12) + (pensionerTickets * 10) + (studentTickets * 10)}.`);
    
                // Re-fetch the seat data to refresh the view
                fetchSeatsData(); // Calling the function to reload seat data
            } else {
                Alert.alert('Booking Error', 'There was an error booking the seats.');
            }
        } catch (error) {
            console.error('Error booking seats:', error);
            Alert.alert('Booking Failed', 'The seats could not be booked. Please try again.');
        }
    };       

    if (loading) {
        return <ActivityIndicator size="large" color="#0000ff" />;
    }

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollViewContent} horizontal={false}>
                <View style={styles.innerContainer}>
                    <Text style={styles.title}>Choose your seats</Text>

                    {/* SCREEN label */}
                    <View style={styles.screenContainer}>
                        <Text style={styles.screenText}>SCREEN</Text>
                        <View style={styles.screenEffect} />
                    </View>

                    {/* Display seat grid */}
                    <View style={styles.seatGrid}>
                        {seats.map((row, rowIndex) => (
                            <View key={rowIndex} style={styles.rowContainer}>
                                {/* Row Labels on the left*/}
                                <View style={styles.rowLabel}>
                                    <Text style={styles.rowLabelText}>{rowIndex + 1}</Text>
                                </View>
                                {row.map((seat, colIndex) => (
                                    <TouchableOpacity
                                        key={colIndex}
                                        style={[styles.seat, {
                                            backgroundColor: seat === 'booked' ? '#f44336' : selectedSeats.some(s => s.row === rowIndex && s.col === colIndex) ? '#FFEB3B' : '#1b293a',
                                            width: screenWidth / seats[0].length - 14,
                                            height: screenWidth / seats[0].length - 10
                                        }]}
                                        disabled={seat === 'booked'}
                                        onPress={() => handleSeatSelect(rowIndex, colIndex)}
                                    >
                                        <Text style={styles.seatText}>{colIndex + 1}</Text>
                                    </TouchableOpacity>
                                ))}
                                {/* Row Labels on the right */}
                                <View style={styles.rowLabel}>
                                    <Text style={styles.rowLabelText}>{rowIndex + 1}</Text>
                                </View>
                            </View>
                        ))}
                    </View>

                    {/* Instruction Text */}
                    <Text style={styles.instructionText}>
                        Choose the seats you want. The reserved places{'\n'}
                        are shown in red and your choices in yellow.
                    </Text>
                    
                    {/* Legend Section (stacked vertically) */}
                    <View style={styles.legendContainer}>
                        <View style={styles.legendItem}>
                            <View style={[styles.legendBox, styles.freeSeat]} />
                            <Text style={styles.legendText}>Free seat</Text>
                        </View>
                        <View style={styles.legendItem}>
                            <View style={[styles.legendBox, styles.selectedSeat]} />
                            <Text style={styles.legendText}>Selected seat</Text>
                        </View>
                        <View style={styles.legendItem}>
                            <View style={[styles.legendBox, styles.bookedSeat]} />
                            <Text style={styles.legendText}>Reserved seat</Text>
                        </View>
                    </View>

                    {/* Selected Seats Information */}
                    {selectedSeats.length > 0 && (
                        <View style={styles.selectedSeatsContainer}>
                            <Text style={styles.selectedSeatsTitle}>Selected Seats:</Text>
                            {selectedSeats.map((seat, index) => (
                                <Text key={index} style={styles.selectedSeatText}>Row {seat.row + 1}, Col {seat.col + 1}</Text>
                            ))}
                        </View>
                    )}
                    <View style={styles.ticketSelectionContainer}>
                        <View style={styles.ticketType}>
                            <Text style={styles.boldText}>Adult Ticket (€15 each):</Text>
                            <View style={styles.ticketCounter}>
                                <Button 
                                    title="-" 
                                    onPress={() => setAdultTickets(Math.max(0, adultTickets - 1))} 
                                    color="#1b293a"  // Button color change
                                />
                                <Text style={styles.boldText}>{` ${adultTickets} `}</Text>
                                <Button 
                                    title="+" 
                                    onPress={() => setAdultTickets(Math.min(selectedSeats.length - childTickets - pensionerTickets - studentTickets, adultTickets + 1))} 
                                    color="#1b293a"  // Button color change
                                />
                            </View>
                        </View>
                        <View style={styles.ticketType}>
                            <Text style={styles.boldText}>Child Ticket (€12 each):</Text>
                            <View style={styles.ticketCounter}>
                                <Button 
                                    title="-" 
                                    onPress={() => setChildTickets(Math.max(0, childTickets - 1))} 
                                    color="#1b293a"  // Button color change
                                />
                                <Text style={styles.boldText}>{` ${childTickets} `}</Text>
                                <Button 
                                    title="+" 
                                    onPress={() => setChildTickets(Math.min(selectedSeats.length - adultTickets - pensionerTickets - studentTickets, childTickets + 1))} 
                                    color="#1b293a"  // Button color change
                                />
                            </View>
                        </View>
                        <View style={styles.ticketType}>
                            <Text style={styles.boldText}>Pensioner Ticket (€10 each):</Text>
                            <View style={styles.ticketCounter}>
                                <Button 
                                    title="-" 
                                    onPress={() => setPensionerTickets(Math.max(0, pensionerTickets - 1))} 
                                    color="#1b293a"  // Button color change
                                />
                                <Text style={styles.boldText}>{` ${pensionerTickets} `}</Text>
                                <Button 
                                    title="+" 
                                    onPress={() => setPensionerTickets(Math.min(selectedSeats.length - adultTickets - childTickets - studentTickets, pensionerTickets + 1))} 
                                    color="#1b293a"  // Button color change
                                />
                            </View>
                        </View>
                        <View style={styles.ticketType}>
                            <Text style={styles.boldText}>Student Ticket (€10 each):</Text>
                            <View style={styles.ticketCounter}>
                                <Button 
                                    title="-" 
                                    onPress={() => setStudentTickets(Math.max(0, studentTickets - 1))} 
                                    color="#1b293a"  // Button color change
                                />
                                <Text style={styles.boldText}>{` ${studentTickets} `}</Text>
                                <Button 
                                    title="+" 
                                    onPress={() => setStudentTickets(Math.min(selectedSeats.length - adultTickets - childTickets - pensionerTickets, studentTickets + 1))} 
                                    color="#1b293a"  // Button color change
                                />
                            </View>
                        </View>
                        <Text style={styles.boldText}>Total Cost: €{(adultTickets * 15) + (childTickets * 12) + (pensionerTickets * 10) + (studentTickets * 10)}</Text>
                    </View>
                    <TouchableOpacity style={styles.confirmButton} onPress={handleConfirmBooking}>
                        <Text style={styles.confirmButtonText}>Confirm Selection</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
    },
    scrollViewContent: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    innerContainer: {
        alignItems: 'center',
        paddingHorizontal: 10,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 12,
        color: '#333',
        marginTop: 120,
    },
    screenContainer: {
        marginBottom: 10,
        alignItems: 'center',
        width: '90%',
    },
    screenText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#555',
        marginBottom: 8,
    },
    screenEffect: {
        width: 300,
        height: 8,
        backgroundColor: '#1b293a',
        borderTopLeftRadius: 50,
        borderTopRightRadius: 50,
        opacity: 0.75,
    },
    seatGrid: {
        flexDirection: 'column',
        alignItems: 'center',
    },
    rowContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 4,
    },
    rowLabel: {
        width: 25,
        height: 25,
        borderRadius: 12.5,
        backgroundColor: '#000',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 5,
        marginLeft: 5,
    },
    rowLabelText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    seat: {
        justifyContent: 'center',
        alignItems: 'center',
        margin: 2,
        borderRadius: 4,
        borderWidth: 1,
    },
    freeSeat: {
        backgroundColor: '#1b293a',
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
        marginTop: 10,
        alignItems: 'center',
    },
    selectedSeatsTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    selectedSeatText: {
        fontSize: 14,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    confirmButton: {
        backgroundColor: '#1b293a',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
        marginTop: 15,
    },
    confirmButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    instructionText: {
        fontSize: 14,
        textAlign: 'center',
        marginVertical: 10,
        color: '#333',
        lineHeight: 20,
        fontWeight: 'bold',
    },
    legendContainer: {
        flexDirection: 'column', // Stacked legends vertically
        justifyContent: 'center',
        marginTop: 10,
    },
    legendItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 5,  // Spacing between each legend item
    },
    legendBox: {
        width: 25,
        height: 25,
        borderRadius: 4,
        marginRight: 8,
        borderWidth: 1,
    },
    legendText: {
        fontSize: 14,
        fontWeight: 'bold',
    },
    ticketSelectionContainer: {
        marginTop: 20,
        alignItems: 'center',
    },
    ticketType: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 10,
        width: '100%',
    },
    ticketCounter: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    boldText: {
        fontWeight: 'bold',
        color: '#000',
    }
});
