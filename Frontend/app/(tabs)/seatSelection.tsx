import React, { useState, useEffect } from 'react';
import { 
    View, Text, TouchableOpacity, ActivityIndicator, Alert, 
    ScrollView, StyleSheet, Dimensions, Button, TextInput, Modal, Image 
} from 'react-native';
import Footer from '@/components/footer';
import { useRouter } from 'expo-router';
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
    const [isPaymentModalVisible, setIsPaymentModalVisible] = useState(false); 
    const [name, setName] = useState('');
    const [cardNumber, setCardNumber] = useState('');
    const [expiryDate, setExpiryDate] = useState('');
    const [cvv, setCvv] = useState('');

    const router = useRouter();
    const showId = '670e6be4114b5a5db1e84521';

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
    
        console.log('Current selected seats:', selectedSeats);
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
        setLoading(true);
        axios.get(`http://192.168.32.196:5000/api/movies/showtimes/${showId}/seats`)
            .then((response) => {
                setSeats(response.data);
                setLoading(false);
            })
            .catch((error) => {
                console.error('Error fetching seat data:', error);
                setLoading(false);
            });
    };

    useEffect(() => {
        fetchSeatsData();
    }, []);

    // This function should just open the payment modal and not affect the seats' booking status
    const handleConfirmBooking = () => {
        const totalTickets = adultTickets + childTickets + pensionerTickets + studentTickets;

        if (selectedSeats.length === 0) {
            Alert.alert('No Seats Selected', 'Please select at least one seat before confirming the booking.');
            return;
        }

        if (totalTickets !== selectedSeats.length) {
            Alert.alert('Incomplete Ticket Selection', 'Please ensure that you have selected ticket types for all the selected seats.');
            return;
        }

        // Open the payment modal without changing seat status
        setIsPaymentModalVisible(true); 
    };

    // Close the payment modal and refresh seat data without marking seats as booked
    const handleCancelPayment = () => {
        // Close the payment modal
        setIsPaymentModalVisible(false);
    
        // Clear the selected seats
        setSelectedSeats([]);
    
        // Reset ticket counts
        setAdultTickets(0);
        setChildTickets(0);
        setPensionerTickets(0);
        setStudentTickets(0);
    
        // Fetch the latest seats data to ensure the seat grid shows the correct status
        fetchSeatsData(); 
    };           

    // Only book the seats after payment is confirmed
    const handlePayPress = async () => {
        if (!name || !cardNumber || !expiryDate || !cvv) {
            Alert.alert('Error', 'Please enter all payment details.');
            return;
        }

        try {
            const response = await axios.post('http://192.168.32.196:5000/api/movies/book-seats', {
                showId,
                seats: selectedSeats,
            });

            if (response.status === 201) {
                Alert.alert('Payment Successful', 'Your payment was processed successfully.');
                setIsPaymentModalVisible(false);
                fetchSeatsData();

                // Navigate to ticket confirmation
                router.push({
                    pathname: '/(tabs)/TicketConfirmation',
                    params: { selectedSeats: JSON.stringify(selectedSeats) },
                });
            } else {
                Alert.alert('Booking Error', 'There was an error booking the seats.');
            }
        } catch (error) {
            console.error('Error booking seats:', error);
            Alert.alert('Payment Failed', 'The payment could not be processed.');
        }
    };

    if (loading) {
        return <ActivityIndicator size="large" color="#0000ff" />;
    }

    const formatCardNumber = (text: string) => {
        return text.replace(/\D/g, '').replace(/(\d{4})(?=\d)/g, '$1 ');
    };

    const formatExpiryDate = (text: string) => {
        return text.replace(/\D/g, '').replace(/(\d{2})(?=\d)/, '$1/');
    };

    return (
        <ScrollView>
            {/* Movie Detail Section */}
            <View style={styles.movieDetailContainer}>
                <Image source={require('@/assets/images/ItEndsWithUs1.jpg')} style={styles.image} />
                <View style={styles.textContainer}>
                    <View style={styles.content}>
                        <View>
                            <Text style={styles.title1}>Premiere</Text>
                            <Text style={styles.text}>7/8/2024</Text>
                        </View>
                        <View>
                            <Text style={styles.title1}>Distributor</Text>
                            <Text style={styles.text}>SF Studios Oy</Text>
                        </View>
                    </View>
                    <View>
                        <Text style={styles.title1}>In the main roles</Text>
                        <Text style={styles.text}>
                            Jenny Slate, Justin Baldoni, Hasan Minhaj, Blake Lively, Amy Morton
                        </Text>
                    </View>
                </View>
            </View>

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

                        {/* Ticket Selection Section */}
                        <View style={styles.ticketSelectionContainer}>
                            {/* Adult Ticket */}
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

                            {/* Child Ticket */}
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

                            {/* Pensioner Ticket */}
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

                            {/* Student Ticket */}
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

                            {/* Total Cost */}
                            <Text style={styles.boldText}>Total Cost: €{(adultTickets * 15) + (childTickets * 12) + (pensionerTickets * 10) + (studentTickets * 10)}</Text>
                        </View>

                        {/* Confirm Selection Button */}
                        <TouchableOpacity style={styles.confirmButton} onPress={handleConfirmBooking}>
                            <Text style={styles.confirmButtonText}>Buy Tickets</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </View>

            {/* Payment Modal */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={isPaymentModalVisible}
                onRequestClose={handleCancelPayment}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>
                        <ScrollView>
                            <Text style={styles.title}>Payment Details</Text>

                            <TextInput
                                placeholder="Name"
                                value={name}
                                onChangeText={setName}
                                style={styles.input}
                            />
                            
                            {/* Card Number Input with Formatting */}
                            <TextInput
                                placeholder="Card Number"
                                value={cardNumber}
                                keyboardType="numeric"
                                onChangeText={(text) => setCardNumber(formatCardNumber(text))}
                                style={styles.input}
                                maxLength={19} // Max length for a 16-digit card with spaces
                            />
                            
                            <View style={styles.row}>
                                {/* Expiry Date Input with Formatting */}
                                <TextInput
                                    placeholder="Ex.Date (MM/YY)"
                                    value={expiryDate}
                                    keyboardType="numeric"
                                    onChangeText={(text) => setExpiryDate(formatExpiryDate(text))}
                                    style={[styles.input, styles.smallInput]}
                                    maxLength={5} // MM/YY format
                                />
                                
                                {/* CVV Input */}
                                <TextInput
                                    placeholder="CVV"
                                    value={cvv}
                                    keyboardType="numeric"
                                    onChangeText={setCvv}
                                    style={[styles.input, styles.smallInput]}
                                    maxLength={3}
                                />
                            </View>

                            <Button title="Pay" onPress={handlePayPress} />
                            <Button title="Cancel" onPress={handleCancelPayment} color="#888" />
                        </ScrollView>
                    </View>
                </View>
            </Modal>
            <Footer />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    movieDetailContainer: {
        backgroundColor: '#1b293a',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 20,
    },
    image: {
        width: 450,
        height: 300,
    },
    textContainer: {
        flexDirection: 'column',
        width: '80%',
        gap: 5,
        marginTop: 10,
    },
    content: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    title1: {
        color: '#fff',
        fontSize: 17,
        fontWeight: '500',
    },
    text: {
        color: '#b2b2b2',
        fontSize: 15,
    },
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
        marginTop: 30,
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
        marginBottom: 15,
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
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContainer: {
        width: '90%',
        maxHeight: '90%',
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 20,
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 20,
        paddingHorizontal: 10,
        borderRadius: 5,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    smallInput: {
        flex: 1,
        marginHorizontal: 5,
    }
});
