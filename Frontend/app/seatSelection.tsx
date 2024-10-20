import React, { useState, useEffect } from 'react';
import { 
    View, Text, TouchableOpacity, ActivityIndicator, Alert, 
    ScrollView, StyleSheet, Dimensions, Button, TextInput, Modal, Image 
} from 'react-native';
import Footer from '@/components/footer';
import { useLocalSearchParams, useRouter } from 'expo-router';
import axios from 'axios';

const API_BASE_URL = 'http://192.168.0.12:5000';
const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const images: { [key: string]: any } = {
    'Joker': require('../assets/images/Joker.jpeg'),
    'WildRobot': require('../assets/images/WildRobot.png'),
    'ItEndsWithUs': require('../assets/images/ItEndsWithUs.png'),
    'splash': require('../assets/images/splash.png'),
};


const getImageSource = (imageName: string): any => {
const baseName = imageName.split('.')[0];
    return images[baseName] || images['splash'];
};

interface CardInputProps {
    value: string;
    onChangeText: (text: string) => void;
}

const CardInput: React.FC<CardInputProps> = ({ value, onChangeText }) => {
    const formatCardNumber = (text: string) => {
        return text.replace(/\D/g, '').replace(/(\d{4})(?=\d)/g, '$1 ');
    };

    const handleCardNumberChange = (text: string) => {
        onChangeText(formatCardNumber(text));
    };

    return (
        <View style={styles.inputContainer}>
        <TextInput
            placeholder="Card Number"
            value={value}
            onChangeText={handleCardNumberChange}
            keyboardType="numeric"
            style={styles.cardInput}
            maxLength={19}
            placeholderTextColor="#999"
        />
        <Image
            source={require('../assets/images/visa.webp')}  
            style={styles.cardIcon}
        />
        </View>
    );
};


type SeatStatus = 'free' | 'booked' | 'selected';
type Seats = SeatStatus[][];
type SelectedSeat = { row: number; col: number };

type ShowtimeData = {
    _id: string;
    showtime: string;
    hallId: {
        _id: string;
        name: string;
        seats?: Seats;
    };
    availableSeats: number;
};

export default function SeatSelectionScreen() {
    const [seats, setSeats] = useState<Seats>([]);
    const [loading, setLoading] = useState(true);
    const [selectedSeats, setSelectedSeats] = useState<SelectedSeat[]>([]);
    const [adultTickets, setAdultTickets] = useState(0);
    const [childTickets, setChildTickets] = useState(0);
    const [pensionerTickets, setPensionerTickets] = useState(0);
    const [studentTickets, setStudentTickets] = useState(0);
    const [isPaymentModalVisible, setIsPaymentModalVisible] = useState(false); 
    const [Email, setEmail] = useState('');
    const [cardNumber, setCardNumber] = useState('');
    const [expiryDate, setExpiryDate] = useState('');
    const [cvv, setCvv] = useState('');
    const [movie, setMovie] = useState<any>(null);
    const [showtime, setShowtime] = useState<string>('');
    const [hallId, setHallId] = useState<string>('');
    const [hallName, setHallName] = useState<string>('');
    const params = useLocalSearchParams();
    const movieId = params.movieId as string;
    const showtimeParam = params.showtime as string;
    const hallIdParam = params.hallId as string;
    const router = useRouter();

    useEffect(() => {
        if (showtimeParam && hallIdParam) {
            setShowtime(showtimeParam);
            setHallId(hallIdParam);
            console.log('Params received:', { movieId, showtime: showtimeParam, hallId: hallIdParam });
        }
    }, [showtimeParam, hallIdParam, movieId]);

    useEffect(() => {
        if (hallId && showtime) {
            fetchSeatsData();
        }
    }, [hallId, showtime]);

    
    useEffect(() => {
        const fetchMovieDetails = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/api/movies/movies/${movieId}`);
                setMovie(response.data);
            } catch (error) {
                console.error('Error fetching movie details:', error);
            }
        };
    
        if (movieId) {
            fetchMovieDetails();
        }
    }, [movieId]);
    
    useEffect(() => {
        if (hallId && showtime) {
            fetchSeatsData();
        }
    }, [hallId, showtime]);

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
        setLoading(true);
        // console.log(`Fetching seats for movie: ${movieId}, hall: ${hallId}, showtime: ${showtime}`);
        axios.get<ShowtimeData[]>(`${API_BASE_URL}/api/movies/movies/${movieId}/showtimes`)
            .then((response) => {
                // console.log('API Response:', JSON.stringify(response.data, null, 2));
                
                const foundShowtime = response.data.find(item => 
                    item.hallId._id === hallId && 
                    new Date(item.showtime).toISOString() === new Date(showtime).toISOString()
                );
                
                if (foundShowtime) {
                    // console.log('Found matching showtime:', JSON.stringify(foundShowtime, null, 2));
                    setHallName(foundShowtime.hallId.name);
                    
                    if (foundShowtime.hallId.seats && Array.isArray(foundShowtime.hallId.seats)) {
                        // console.log('Setting seats:', foundShowtime.hallId.seats);
                        setSeats(foundShowtime.hallId.seats);
                    } else {
                        console.error('Seats data is not available or not an array');
                        // Generate default seats only if no seat data exists
                        const defaultSeats = generateDefaultSeats(10, 10);
                        setSeats(defaultSeats);
                    }
                } else {
                    // console.log('No matching showtime found');
                    setSeats([]);
                }
                setLoading(false);
            })
            .catch((error) => {
                console.error('Error fetching seat data:', error);
                setLoading(false);
            });
    };
    
    // Helper function to generate a default seat layout
    const generateDefaultSeats = (rows: number, seatsPerRow: number): SeatStatus[][] => {
        return Array(rows).fill(null).map(() => 
            Array(seatsPerRow).fill('free' as SeatStatus)
        );
    };

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

        setIsPaymentModalVisible(true); 
    };

    const handleCancelPayment = () => {
        setIsPaymentModalVisible(false);
        setSelectedSeats([]);
        setAdultTickets(0);
        setChildTickets(0);
        setPensionerTickets(0);
        setStudentTickets(0);
        fetchSeatsData(); 
    };           

    const handlePayPress = async () => { 
        if (!Email.trim() || !cardNumber.trim() || !expiryDate.trim() || !cvv.trim()) {
            Alert.alert('Error', 'Please enter all payment details.');
            return;
        }
    
        try {
            const showtimesResponse = await axios.get<ShowtimeData[]>(`${API_BASE_URL}/api/movies/movies/${movieId}/showtimes`);
            const foundShowtime = showtimesResponse.data.find(item => 
                item.hallId._id === hallId && 
                new Date(item.showtime).toISOString() === new Date(showtime).toISOString()
            );
    
            if (!foundShowtime) {
                Alert.alert('Error', 'Could not find the selected showtime.');
                return;
            }
    
            const response = await axios.post(`${API_BASE_URL}/api/movies/book-seats`, {
                showId: foundShowtime._id,
                seats: selectedSeats,
            });
    
            if (response.status === 201) {
                // Immediately update local state to mark selected seats as booked
                setSeats(prevSeats => {
                    const newSeats = prevSeats.map((row, rowIndex) => 
                        row.map((seat, colIndex) => {
                            if (selectedSeats.some(s => s.row === rowIndex && s.col === colIndex)) {
                                return 'booked';
                            }
                            return seat;
                        })
                    );
                    return newSeats;
                });
    
                Alert.alert('Booking Successful', 'Your seats have been booked successfully.');
                setIsPaymentModalVisible(false);
    
                // Reset selection states
                setSelectedSeats([]);
                setAdultTickets(0);
                setChildTickets(0);
                setPensionerTickets(0);
                setStudentTickets(0);
    
                // Fetch fresh seat data after a short delay to ensure backend is updated
                setTimeout(() => {
                    fetchSeatsData();
                }, 1000);
    
                router.push({
                    pathname: '/TicketConfirmation',
                    params: { 
                        selectedSeats: JSON.stringify(selectedSeats),
                        movieId,
                        hallId,
                        showtime: foundShowtime.showtime,
                        movieName: movie.name,
                        hallName: foundShowtime.hallId.name,
                        Email // Passing the email as a parameter
                    },
                });
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
    

    const formatExpiryDate = (text: string) => {
        return text.replace(/\D/g, '').replace(/(\d{2})(?=\d)/, '$1/');
    };

    return (
        <ScrollView>
            {movie && (
                <View style={styles.movieDetailContainer}>
                    <Image source={getImageSource(movie.imageName)} style={styles.image} />
                    <View style={styles.detailsContainer}>
                        <Text style={styles.movieTitle}>{movie.name}</Text>
                        <View style={styles.infoRow}>
                            <Text style={styles.infoLabel}>Movie Story:</Text>
                        </View>
                        <View style={styles.infoRow}>
                            <Text style={styles.infoText}>
                                {movie.description || movie.discription || "No description available"}
                            </Text>
                        </View>
                    </View>
                </View>
            )}
    
            <View style={styles.container}>
                <ScrollView contentContainerStyle={styles.scrollViewContent}>
                    <View style={styles.innerContainer}>
                        <View style={styles.showInfoContainer}>
                            <Text style={styles.hallName}>
                                {hallName || 'Hall information not available'}
                            </Text>
                            <Text style={styles.dateTime}>
                                {new Date(showtime).toLocaleDateString('en-US', { 
                                    weekday: 'long', 
                                    year: 'numeric', 
                                    month: 'long', 
                                    day: 'numeric' 
                                })}
                            </Text>
                            <Text style={styles.dateTime}>
                                {"Show Time: "}
                                {new Date(showtime).toLocaleTimeString('en-US', { 
                                    hour: '2-digit', 
                                    minute: '2-digit',
                                    hour12: false
                                })}
                            </Text>
                        </View>
                        <Text style={styles.title}>Choose your seats</Text>
                        <View style={styles.screenContainer}>
                            <Text style={styles.screenText}>SCREEN</Text>
                            <View style={styles.screenEffect} />
                        </View>
    
                        <View style={styles.seatGrid}>
                            {seats.length > 0 ? (
                                seats.map((row, rowIndex) => (
                                    <View key={rowIndex} style={styles.rowContainer}>
                                        <View style={styles.rowLabel}>
                                            <Text style={styles.rowLabelText}>{rowIndex + 1}</Text>
                                        </View>
                                        {row.map((seat, colIndex) => (
                                            <TouchableOpacity
                                                key={colIndex}
                                                style={[styles.seat, {
                                                    backgroundColor: seat === 'booked' ? '#f44336' : 
                                                        selectedSeats.some(s => s.row === rowIndex && s.col === colIndex) ? '#FFEB3B' : '#1b293a',
                                                }]}
                                                disabled={seat === 'booked'}
                                                onPress={() => handleSeatSelect(rowIndex, colIndex)}
                                            >
                                                <Text style={styles.seatText}>{colIndex + 1}</Text>
                                            </TouchableOpacity>
                                        ))}
                                        <View style={styles.rowLabel}>
                                            <Text style={styles.rowLabelText}>{rowIndex + 1}</Text>
                                        </View>
                                    </View>
                                ))
                            ) : (
                                <Text>No seats available for this showtime.</Text>
                            )}
                        </View>
    
                        <Text style={styles.instructionText}>
                            Choose the seats you want. The reserved places{'\n'}
                            are shown in red and your choices in yellow.
                        </Text>
                        
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
    
                        {selectedSeats.length > 0 && (
                            <View style={styles.selectedSeatsContainer}>
                                <Text style={styles.selectedSeatsTitle}>Selected Seats:</Text>
                                {selectedSeats.map((seat, index) => (
                                    <Text key={index} style={styles.selectedSeatText}>Row {seat.row + 1}, Col {seat.col + 1}</Text>
                                ))}
                            </View>
                        )}
    
                        <View style={styles.ticketSelectionContainer}>
                            <TicketTypeSelector
                                label="Adult Ticket (€15 each):"
                                count={adultTickets}
                                onDecrement={() => setAdultTickets(Math.max(0, adultTickets - 1))}
                                onIncrement={() => setAdultTickets(Math.min(selectedSeats.length - childTickets - pensionerTickets - studentTickets, adultTickets + 1))}
                            />
                            <TicketTypeSelector
                                label="Child Ticket (€12 each):"
                                count={childTickets}
                                onDecrement={() => setChildTickets(Math.max(0, childTickets - 1))}
                                onIncrement={() => setChildTickets(Math.min(selectedSeats.length - adultTickets - pensionerTickets - studentTickets, childTickets + 1))}
                            />
                            <TicketTypeSelector
                                label="Pensioner Ticket (€10 each):"
                                count={pensionerTickets}
                                onDecrement={() => setPensionerTickets(Math.max(0, pensionerTickets - 1))}
                                onIncrement={() => setPensionerTickets(Math.min(selectedSeats.length - adultTickets - childTickets - studentTickets, pensionerTickets + 1))}
                            />
                            <TicketTypeSelector
                                label="Student Ticket (€10 each):"
                                count={studentTickets}
                                onDecrement={() => setStudentTickets(Math.max(0, studentTickets - 1))}
                                onIncrement={() => setStudentTickets(Math.min(selectedSeats.length - adultTickets - childTickets - pensionerTickets, studentTickets + 1))}
                            />
                        </View>
                        <View style={styles.totalCostContainer}>
                            <Text style={styles.boldText}>Total Cost: €{(adultTickets * 15) + (childTickets * 12) + (pensionerTickets * 10) + (studentTickets * 10)}</Text>
                        </View>
                        <TouchableOpacity style={styles.confirmButton} onPress={handleConfirmBooking}>
                            <Text style={styles.confirmButtonText}>Buy Tickets</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </View>
    
            <Modal
                animationType="slide"
                transparent={true}
                visible={isPaymentModalVisible}
                onRequestClose={handleCancelPayment}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>
                        <ScrollView contentContainerStyle={styles.modalContent}>
                            <Text style={styles.modalTitle}>Payment Details</Text>

                            <TextInput
                                placeholder="Email"
                                value={Email}
                                onChangeText={setEmail}
                                style={styles.input}
                                placeholderTextColor="#999"
                            />
                            
                            <CardInput
                                value={cardNumber}
                                onChangeText={setCardNumber}
                            />
                            
                            <View style={styles.row}>
                                <TextInput
                                    placeholder="Ex.Date (MM/YY)"
                                    value={expiryDate}
                                    keyboardType="numeric"
                                    onChangeText={(text) => setExpiryDate(formatExpiryDate(text))}
                                    style={[styles.input, styles.smallInput]}
                                    maxLength={5}
                                    placeholderTextColor="#999"
                                />
                                
                                <TextInput
                                    placeholder="CVV"
                                    value={cvv}
                                    keyboardType="numeric"
                                    onChangeText={setCvv}
                                    style={[styles.input, styles.smallInput]}
                                    maxLength={3}
                                    placeholderTextColor="#999"
                                />
                            </View>

                            <TouchableOpacity style={styles.payButton} onPress={handlePayPress}>
                                <Text style={styles.payButtonText}>Pay</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.cancelButton} onPress={handleCancelPayment}>
                                <Text style={styles.cancelButtonText}>Cancel</Text>
                            </TouchableOpacity>
                        </ScrollView>
                    </View>
                </View>
            </Modal>
            <Footer />
        </ScrollView>
    );
}

interface TicketTypeSelectorProps {
    label: string;
    count: number;
    onDecrement: () => void;
    onIncrement: () => void;
}

const TicketTypeSelector: React.FC<TicketTypeSelectorProps> = ({ label, count, onDecrement, onIncrement }) => (
    <View style={styles.ticketType}>
        <Text style={styles.boldText}>{label}</Text>
        <View style={styles.ticketCounter}>
            <TouchableOpacity onPress={onDecrement} style={styles.counterButton}>
                <Text style={styles.counterButtonText}>-</Text>
            </TouchableOpacity>
            <Text style={styles.boldText}>{` ${count} `}</Text>
            <TouchableOpacity onPress={onIncrement} style={styles.counterButton}>
                <Text style={styles.counterButtonText}>+</Text>
            </TouchableOpacity>
        </View>
    </View>
);


const styles = StyleSheet.create({
    scrollView: {
        flex: 1,
        backgroundColor: '#fff',
    },
    movieDetailContainer: {
        flexDirection: 'row',
        backgroundColor: '#000',
        padding: 10,
        paddingTop: 50, // Increased top padding for status bar
    },
    image: {
        width: screenWidth * 0.4,
        height: screenWidth * 0.6,
        resizeMode: 'cover',
        borderRadius: 8,
    },
    detailsContainer: {
        flex: 1,
        marginLeft: 10,
        justifyContent: 'center',
    },
    movieTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 15,
    },
    infoRow: {
        flexDirection: 'row',
        marginBottom: 2,
    },
    infoLabel: {
        fontWeight: 'bold',
        color: '#fff',
        width: 80,
        fontSize: 12,
    },
    infoText: {
        color: '#b2b2b2',
        flex: 1,
        fontSize: 12,
    },
    showInfoContainer: {
        backgroundColor: '#000',
        alignItems: 'center',
        marginBottom: 20,
        width: '60%',
        borderRadius: 20,
    },
    hallName: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 10,
        marginTop: 10,
    },
    dateTime: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 10,
    },
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    scrollViewContent: {
        flexGrow: 1,
        paddingBottom: 20,
    },
    innerContainer: {
        alignItems: 'center',
        padding: 10,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 12,
        color: '#333',
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
        width: '80%',
        height: 8,
        backgroundColor: '#1b293a',
        borderTopLeftRadius: 50,
        borderTopRightRadius: 50,
        opacity: 0.75,
    },
    seatGrid: {
        flexDirection: 'column',
        alignItems: 'center',
        width: '100%',
    },
    rowContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 4,
    },
    rowLabel: {
        width: screenWidth * 0.06,
        height: screenWidth * 0.06,
        borderRadius: screenWidth * 0.03,
        backgroundColor: '#000',
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 5,
    },
    rowLabelText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: screenWidth * 0.03,
    },
    seat: {
        justifyContent: 'center',
        alignItems: 'center',
        margin: 2,
        borderRadius: 4,
        borderWidth: 1,
        width: screenWidth * 0.06,
        height: screenWidth * 0.06,
    },
    seatText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: screenWidth * 0.025,
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
        flexDirection: 'column',
        justifyContent: 'center',
        marginTop: 10,
    },
    legendItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 5,
    },
    legendBox: {
        width: screenWidth * 0.06,
        height: screenWidth * 0.06,
        borderRadius: 4,
        marginRight: 8,
        borderWidth: 1,
    },
    legendText: {
        fontSize: 14,
        fontWeight: 'bold',
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
    ticketSelectionContainer: {
        marginTop: 20,
        width: '100%',
    },
    ticketType: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    ticketCounter: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    boldText: {
        fontWeight: 'bold',
        color: '#000',
    },
    totalCostContainer: {
        width: '100%',
        alignItems: 'center',
        marginVertical: 10,
    },
    confirmButton: {
        backgroundColor: '#1b293a',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
        marginTop: 15,
        width: '80%',
    },
    confirmButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContainer: {
        width: '90%',
        maxHeight: '80%',
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 20,
    },
    modalContent: {
        flexGrow: 1,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    input: {
        height: 40,
        borderColor: '#000',
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
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#000',
        borderRadius: 5,
        marginBottom: 20,
    },
    cardInput: {
        flex: 1,
        height: 40,
        paddingHorizontal: 10,
    },
    cardIcon: {
        width: 60,
        height: 40,
        resizeMode: 'contain',
        marginRight: 10,
    },
    payButton: {
        backgroundColor: '#1b293a',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
        marginTop: 10,
    },
    payButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
    cancelButton: {
        backgroundColor: '#888',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
        marginTop: 10,
    },
    cancelButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
    counterButton: {
        backgroundColor: '#1b293a',
        width: screenWidth * 0.08,
        height: screenWidth * 0.08,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: screenWidth * 0.04,
    },
    counterButtonText: {
        color: '#fff',
        fontSize: screenWidth * 0.04,
        fontWeight: 'bold',
    },
});