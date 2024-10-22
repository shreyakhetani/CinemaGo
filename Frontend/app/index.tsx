import React, { useEffect, useState } from 'react';
import { Image, TextInput, StyleSheet, View, ScrollView, Text, TouchableOpacity, Modal, Pressable, Alert, Button } from 'react-native';
import Svg, { G, Path } from 'react-native-svg';
import { useRouter } from 'expo-router';
import * as FileSystem from 'expo-file-system';
import Footer from '../components/footer';
import axios from 'axios';
import { Ionicons } from '@expo/vector-icons';
import QRCode from 'react-native-qrcode-svg';

// Define interfaces for type safety
interface Ticket {
    movieName: string;
    hallName: string;
    showtime: string;
    duration: string;
    language: string;
    seat: string;
}

interface UserData {
    email: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    avatar?: string | number;
}

    
interface Movie {
    _id: string;
    name: string;
    premiere: string;
    distributor: string;
    roles: string[];
    language: string;
    cc: string;
    age: number;
    imageName: string;
    duration: string;
    director: string;
    genre: string;
    description: string;
}

interface TicketDisplay extends Ticket {
    selectedSeat?: string;
}


const API_BASE_URL = 'http://192.168.32.196:5000';

const images: { [key: string]: any } = {
    'Joker': require('../assets/images/Joker.jpeg'),
    'WildRobot': require('../assets/images/WildRobot.png'),
    'ItEndsWithUs': require('../assets/images/ItEndsWithUs.png'),
    'splash': require('../assets/images/splash.png'),
};

const avatarOptions = [
    require('../assets/images/avatars/avatar1.jpg'),
    require('../assets/images/avatars/avatar2.jpg'),
    require('../assets/images/avatars/avatar3.jpg'),
    require('../assets/images/avatars/avatar4.jpg'),
];

const getImageSource = (imageName: string): any => {
    const baseName = imageName.split('.')[0];
    return images[baseName] || images['splash'];
};

const getTodayDate = (): string => {
    const today = new Date();
    const year = today.getFullYear();
    const month = (today.getMonth() + 1).toString().padStart(2, '0');
    const day = today.getDate().toString().padStart(2, '0');
    return `TODAY ${day}.${month}`;
};

export default function HomeScreen() {
    const router = useRouter();
    const [movies, setMovies] = useState<Movie[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [firstName, setFirstName] = useState<string | null>(null);
    const [avatar, setAvatar] = useState<number | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
    const [activeTab, setActiveTab] = useState<string>('profile');
    const [selectedAvatar, setSelectedAvatar] = useState<any>(avatarOptions[0]);
    const [userData, setUserData] = useState<UserData>({
        email: '',
        firstName: '',
        lastName: '',
        phoneNumber: ''
    });
    const [email, setEmail] = useState<string>('');
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [selectedTicket, setSelectedTicket] = useState<TicketDisplay | null>(null);
    const [isQRCodeModalVisible, setIsQRCodeModalVisible] = useState<boolean>(false);
    const [newFirstName, setNewFirstName] = useState<string>('');
    const [newLastName, setNewLastName] = useState<string>('');
    const [newPhoneNumber, setNewPhoneNumber] = useState<string>('');
    
    const todayDate = getTodayDate();
    const filePath = `${FileSystem.documentDirectory}userData.json`;

    useEffect(() => {
        const fetchMovies = async () => {
            try {
                const response = await axios.get<{ movies: Movie[] }>(`${API_BASE_URL}/api/movies/movies`);
                setMovies(response.data.movies);
            } catch (error) {
                console.error('Error fetching movies:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchMovies();
        loadUserDataFromFile();
    }, []);

    const fetchUserData = async (email: string): Promise<void> => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/auth/user?email=${email}`);
            if (!response.ok) {
                if (response.status === 404) {
                    setError('User data not found.');
                } else {
                    setError('An error occurred while fetching user data.');
                }
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            if (data && data.firstName && data.lastName && data.phoneNumber) {
                setUserData(data);
            } else {
                setError('No user data available.');
            }
        } catch (error) {
            setError('Error fetching user data.');
        }
    };
  

    const fetchTickets = async (email: string): Promise<void> => {
        try {
            const ticketResponse = await fetch(`${API_BASE_URL}/api/tickets/tickets?email=${email}`);
            const ticketData = await ticketResponse.json();

            if (ticketResponse.ok) {
                setTickets(ticketData);
            }
        } catch (error) {
            console.error('Error fetching tickets:', error);
            Alert.alert('Error', 'An error occurred while fetching tickets.');
        }
    };

    const handleLogout = async (): Promise<void> => {
        try {
            await FileSystem.deleteAsync(filePath);
            router.replace('/');
        } catch (error) {
            console.error('Error during logout:', error);
        }
    };

    const loadUserDataFromFile = async (): Promise<void> => {
        try {
            const fileInfo = await FileSystem.getInfoAsync(filePath);
            if (!fileInfo.exists) {
                setLoading(false);
                return;
            }

            const fileContent = await FileSystem.readAsStringAsync(filePath);
            const userDataFile: UserData = JSON.parse(fileContent);

            if (userDataFile.email) {
                setEmail(userDataFile.email);
                await fetchUserData(userDataFile.email);
                await fetchTickets(userDataFile.email);
            }

            if (typeof userDataFile.avatar === 'number' && userDataFile.avatar >= 26) {
                setAvatar(userDataFile.avatar - 26);
            }
            
        } catch (error) {
            console.error('Error loading user data:', error);
            setError('Error loading user data from file.');
        }
    };

    const saveUserDataToFile = async (userData: UserData): Promise<void> => {
        try {
            const jsonData = JSON.stringify(userData, null, 2);
            await FileSystem.writeAsStringAsync(filePath, jsonData);
        } catch (error) {
            console.error('Error saving user data:', error);
        }
    };

    const handleGoHome = async (): Promise<void> => {
        const userData: UserData = {
            email,
            firstName: '',
            lastName: '',
            phoneNumber: '',
            avatar: selectedAvatar,
        };

        try {
            await saveUserDataToFile(userData);
            router.push('/');
        } catch (error) {
            console.error('Error navigating home:', error);
        }
    };

    const handleMoviePress = (movieId: string): void => {
        router.push({
            pathname: '/MovieDetail',
            params: { id: movieId },
        });
    };

    const handleTicketPress = (ticket: Ticket): void => {
        setSelectedTicket({
            ...ticket,
            seat: ticket.seat
        });
        setIsQRCodeModalVisible(true);
    };

    const handleUpdateProfile = async (): Promise<void> => {
        const updatedData: UserData = {
            email,
            firstName: newFirstName || userData.firstName,
            lastName: newLastName || userData.lastName,
            phoneNumber: newPhoneNumber || userData.phoneNumber,
        };

        try {
            const response = await fetch(`${API_BASE_URL}/api/auth/update`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedData),
            });

            const data = await response.json();

            if (response.ok) {
                Alert.alert('Success', 'Profile updated successfully');
                setUserData({ ...userData, ...updatedData });
                setNewFirstName('');
                setNewLastName('');
                setNewPhoneNumber('');
            } else {
                Alert.alert('Error', data.message || 'Update failed. Please try again.');
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            Alert.alert('Error', 'An error occurred. Please try again.');
        }
    };

    const handleDeleteAccount = async (): Promise<void> => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/auth/delete`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();

            if (response.ok) {
                Alert.alert('Success', 'Account deleted successfully');
                setIsModalVisible(false);
                router.replace('/');
            } else {
                Alert.alert('Error', data.message || 'Delete failed. Please try again.');
            }
        } catch (error) {
            console.error('Error deleting account:', error);
            Alert.alert('Error', 'An error occurred. Please try again.');
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.scrollView}>
            {/* Header */}
            <View style={styles.header}>
                <Image source={require('../assets/images/CinemaGo10.jpg')} style={styles.headerImage} resizeMode="contain" />
                <TouchableOpacity 
                    style={styles.circleButton} 
                    onPress={() => {
                        if (avatar === null) {
                            router.push('/Signup_Login');
                        } else {
                            setIsModalVisible(true);
                        }
                    }}
                >
                    {avatar !== null ? (
                        <Image source={avatarOptions[avatar]} style={styles.avatarStyle} />
                    ) : (
                        <Image source={require('../assets/images/icons/human_Icon.jpg')} style={styles.avatarStyle} />
                    )}
                </TouchableOpacity>
                <Text style={styles.headerText}>
                    After his home is conquered by the tyrannical emperors who now lead Rome, Lucius is forced to enter the Colosseum and must look to his past to find strength to return the glory of Rome to its people
                </Text>
                <Text style={styles.headerText2}>Gladiator II Release Day: 15th October</Text>
            </View>

            {/* Movie List */}
            <View style={styles.container}>
                {movies.map((movie) => (
                    <View key={movie._id} style={styles.movieContainer}>
                        <View style={styles.contentRow}>
                            <Image source={getImageSource(movie.imageName)} style={styles.movieImage} resizeMode="cover" />
                            <View style={styles.content}>
                                <Text style={styles.title}>{movie.name}</Text>
                                <Text style={styles.day}>{todayDate}</Text>
                                <View style={styles.iconContainer}>
                                    <View style={styles.subtitle}>
                                        <Svg
                                            fill="#13335d"
                                            width="20px"
                                            height="20px"
                                            viewBox="0 0 1920 1920"
                                            stroke="#13335d"
                                            strokeWidth={103.68}
                                        >
                                            <G>
                                                <Path d="M1920 1468.412v112.94H0v-112.94h1920Zm-677.647-338.824v112.941H677.647v-112.94h564.706Zm677.647-338.823v112.94H0v-112.94h1920Zm-677.647-338.824v112.941H677.647V451.94h564.706Zm677.647-338.823v112.94H0V113.118h1920Z" fillRule="evenodd" />
                                            </G>
                                        </Svg>
                                        <Text>{movie.cc}</Text>
                                    </View>
                                    <View style={styles.lang}>
                                        <Svg
                                            width="25px"
                                            height="25px"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="#112c50"
                                            strokeWidth={0.96}
                                        >
                                            <Path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
                                            <Path d="M2 12h20" />
                                            <Path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                                        </Svg>
                                        <Text>{movie.language}</Text>
                                    </View>
                                    <Text style={styles.age}>{movie.age}</Text>
                                </View>
                            </View>
                        </View>
                        <TouchableOpacity style={styles.viewDetailsButton} onPress={() => handleMoviePress(movie._id)}>
                            <Text style={styles.viewDetailsText}>Explore and Buy</Text>
                        </TouchableOpacity>
                    </View>
                ))}
            </View>

            <Footer />

            {/* Profile Modal */}
            <Modal
                animationType="fade"
                transparent={true}
                visible={isModalVisible}
                onRequestClose={() => setIsModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalView}>
                        {/* Tab Navigation */}
                        <View style={styles.tabContainer}>
                            <TouchableOpacity
                                style={[styles.tab, activeTab === 'profile' && styles.activeTab]}
                                onPress={() => setActiveTab('profile')}
                            >
                                <Text style={styles.tabText}>Profile</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.tab, activeTab === 'tickets' && styles.activeTab]}
                                onPress={() => setActiveTab('tickets')}
                            >
                                <Text style={styles.tabText}>Tickets</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.tab, activeTab === 'EditProfile' && styles.activeTab]}
                                onPress={() => setActiveTab('EditProfile')}
                            >
                                <Text style={styles.tabText}>Edit Profile</Text>
                            </TouchableOpacity>
                        </View>

                        {/* Profile Tab Content */}
                        {activeTab === 'profile' && (
                            <View style={styles.profileContainer}>
                                <Text style={styles.name}>Welcome {userData.firstName} {userData.lastName}</Text>
                                <View style={styles.buttonContainer}>
                                    <Button 
                                        title="Log Out" 
                                        onPress={handleLogout} 
                                        color="#ff5c5c"
                                    />
                                </View>
                                <View style={styles.buttonContainer}>
                                    <Button 
                                        title="Go to Home" 
                                        onPress={handleGoHome} 
                                        color="#4a90e2"
                                    />
                                </View>
                            </View>
                        )}

                        {/* Tickets Tab Content */}
                        {activeTab === 'tickets' && (
                            <ScrollView style={styles.ticketSection}>
                                {tickets.length > 0 ? (
                                    tickets.map((ticket, index) => {
                                        // Split compound seats into individual seats and sort them
                                        const seatPairs = ticket.seat.split(', Row ');
                                        let individualSeats = seatPairs.map(seatPair => {
                                            if (seatPair.startsWith('Row ')) {
                                                return seatPair;
                                            }
                                            return `Row ${seatPair}`;
                                        });

                                        // Sort seats by row and column numbers
                                        individualSeats.sort((a, b) => {
                                            const aMatch = a.match(/Row (\d+), Col (\d+)/);
                                            const bMatch = b.match(/Row (\d+), Col (\d+)/);
                                            
                                            if (aMatch && bMatch) {
                                                const [, aRow, aCol] = aMatch.map(Number);
                                                const [, bRow, bCol] = bMatch.map(Number);
                                                
                                                // First compare rows
                                                if (aRow !== bRow) {
                                                    return aRow - bRow;
                                                }
                                                // If rows are same, compare columns
                                                return aCol - bCol;
                                            }
                                            return 0;
                                        });
                                        
                                        return (
                                            <View key={index} style={styles.ticketItem}>
                                                <Text style={styles.ticketItemText}>
                                                    Movie: <Text style={styles.ticketDetail}>{ticket.movieName}</Text>
                                                </Text>
                                                <Text style={styles.ticketItemText}>
                                                    Hall: <Text style={styles.ticketDetail}>{ticket.hallName}</Text>
                                                </Text>
                                                <Text style={styles.ticketItemText}>
                                                    Showtime: <Text style={styles.ticketDetail}>
                                                        {new Date(ticket.showtime).toLocaleString('en-US', {
                                                            timeZone: 'Europe/Helsinki',
                                                            hour12: false
                                                        })}
                                                    </Text>
                                                </Text>
                                                <Text style={styles.ticketItemText}>
                                                    Duration: <Text style={styles.ticketDetail}>{ticket.duration}</Text>
                                                </Text>
                                                <Text style={styles.ticketItemText}>
                                                    Language: <Text style={styles.ticketDetail}>{ticket.language}</Text>
                                                </Text>
                                                
                                                {individualSeats.map((seat, seatIndex) => (
                                                    <View key={seatIndex} style={styles.seatContainer}>
                                                        <Text style={styles.ticketItemText}>
                                                            Seat: <Text style={styles.ticketDetail}>{seat}</Text>
                                                        </Text>
                                                        <TouchableOpacity
                                                            style={styles.ticketButton}
                                                            onPress={() => handleTicketPress({
                                                                ...ticket,
                                                                seat: seat
                                                            })}
                                                        >
                                                            <Text style={styles.ticketButtonText}>Show QR Code for {seat}</Text>
                                                        </TouchableOpacity>
                                                    </View>
                                                ))}
                                            </View>
                                        );
                                    })
                                ) : (
                                    <Text style={styles.noTicketsText}>You don't have any tickets.</Text>
                                )}
                            </ScrollView>
                        )}

                        {/* EditProfile Tab Content */}
                        {activeTab === 'EditProfile' && (
                            <View style={styles.EditProfileSection}>
                                <Text style={styles.avatarSelectionTitle}>Select Avatar</Text>
                                <View style={styles.avatarOptionsContainer}>
                                    {avatarOptions.map((avatar, index) => (
                                        <Pressable
                                            key={index}
                                            onPress={() => setSelectedAvatar(avatar)}
                                            style={[styles.avatarOption, selectedAvatar === avatar && styles.selectedAvatarOption]}
                                        >
                                            <Image source={avatar} style={styles.avatarOptionImage} />
                                        </Pressable>
                                    ))}
                                </View>
                                <TextInput
                                    style={styles.input}
                                    placeholder="First Name"
                                    value={newFirstName}
                                    onChangeText={setNewFirstName}
                                />
                                <TextInput
                                    style={styles.input}
                                    placeholder="Last Name"
                                    value={newLastName}
                                    onChangeText={setNewLastName}
                                />
                                <TextInput
                                    style={styles.input}
                                    placeholder="Phone Number"
                                    value={newPhoneNumber}
                                    onChangeText={setNewPhoneNumber}
                                />
                                <Button title="Update Profile" onPress={handleUpdateProfile} />
                                <Button title="Delete Account" onPress={handleDeleteAccount} color="red" />
                            </View>
                        )}
                    </View>
                </View>
            </Modal>

            {/* QR Code Modal */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={isQRCodeModalVisible}
                onRequestClose={() => setIsQRCodeModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalView}>
                        {selectedTicket && (
                            <>
                                <Text style={styles.qrCodeTitle}>Your Ticket QR Code</Text>
                                <QRCode
                                    value={JSON.stringify({
                                        movieName: selectedTicket.movieName,
                                        hallName: selectedTicket.hallName,
                                        showtime: new Date(selectedTicket.showtime).toLocaleString('en-US', {
                                            timeZone: 'Europe/Helsinki',
                                            hour12: false
                                        }),
                                        duration: selectedTicket.duration,
                                        language: selectedTicket.language,
                                        seat: selectedTicket.seat
                                    })}
                                    size={200}
                                />
                                <Pressable
                                    style={styles.closeModalButton}
                                    onPress={() => setIsQRCodeModalVisible(false)}
                                >
                                    <Ionicons name="close" size={24} color="black" />
                                </Pressable>
                            </>
                        )}
                    </View>
                </View>
            </Modal>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    scrollView: {
        flexGrow: 1,
        backgroundColor: '#000',
    },
    header: {
        backgroundColor: '#000',
        alignItems: 'center',
        marginBottom: 20,
        padding: 10,
    },
    headerImage: {
        width: '100%',
        height: 600,
    },
    circleButton: {
        position: 'absolute',
        top: 20,
        right: 20,
        borderRadius: 50,
        borderWidth: 2,
        overflow: 'hidden',
        borderColor: 'black',
        backgroundColor: 'white',
    },
    avatarStyle: {
        width: 50,
        height: 50,
        borderRadius: 25,
        borderWidth: 2,
        borderColor: '#fff',
    },
    headerText: {
        fontSize: 15,
        fontWeight: '400',
        marginBottom: 15,
        color: '#fff',
        paddingHorizontal: 20,
        textAlign: 'center',
    },
    headerText2: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#fff',
        marginTop: 15,
        marginBottom: 20,
        paddingHorizontal: 20,
        textAlign: 'center',
    },
    container: {
        flexGrow: 1,
        paddingVertical: 20,
        paddingHorizontal: 10,
        alignItems: 'center',
        backgroundColor: '#000',
    },
    movieContainer: {
        backgroundColor: '#fff',
        marginVertical: 10,
        borderRadius: 10,
        overflow: 'hidden',
        width: '95%',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 3,
        padding: 15,
    },
    contentRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    movieImage: {
        width: 100,
        height: 150,
        borderRadius: 8,
    },
    content: {
        flex: 1,
        paddingLeft: 15,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#1c3d72',
        marginBottom: 6,
        textAlign: 'center',
    },
    day: {
        fontSize: 16,
        color: '#6b7b8a',
        marginBottom: 8,
        textAlign: 'center',
    },
    iconContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
    },
    subtitle: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#eef3f8',
        padding: 6,
        borderRadius: 8,
        marginRight: 10,
    },
    lang: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#eef3f8',
        padding: 6,
        borderRadius: 8,
        marginRight: 10,
    },
    age: {
        fontSize: 14,
        fontWeight: '600',
        color: '#fff',
        backgroundColor: '#1b293a',
        paddingVertical: 4,
        paddingHorizontal: 8,
        borderRadius: 5,
        marginLeft: 10,
    },
    viewDetailsButton: {
        backgroundColor: '#1e2a3a',
        paddingVertical: 12,
        paddingHorizontal: 25,
        borderRadius: 5,
        marginTop: 15,
        alignItems: 'center',
    },
    viewDetailsText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalView: {
        backgroundColor: '#f4f4f4',
        padding: 30,
        borderRadius: 20,
        width: '80%',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    tabContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 20,
        width: '100%',
    },
    tab: {
        padding: 10,
    },
    activeTab: {
        borderBottomWidth: 2,
        borderBottomColor: '#6200ea',
    },
    tabText: {
        fontSize: 16,
        color: '#333',
    },
    profileContainer: {
        alignItems: 'center',
        marginBottom: 20,
        width: '100%',
    },
    name: {
        fontSize: 20,
        color: '#333',
        marginBottom: 20,
    },
    buttonContainer: {
        marginBottom: 20,
        width: '80%',
        borderRadius: 10,
        overflow: 'hidden',
    },
    ticketSection: {
        backgroundColor: '#1c1c1c',
        padding: 20,
        borderRadius: 10,
        width: '100%',
        maxHeight: 400,
    },
    ticketItem: {
        backgroundColor: '#222',
        padding: 15,
        marginBottom: 15,
        borderRadius: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 6,
        alignItems: 'flex-start',
        width: '100%',
        minHeight: 120,
        borderWidth: 1,
        borderColor: '#444',
    },
    ticketItemText: {
        color: '#f0f0f0',
        fontSize: 16,
        marginBottom: 5,
        fontWeight: '600',
    },
    ticketDetail: {
        color: '#ffcc00',
        fontSize: 16,
        fontWeight: '500',
    },
    seatContainer: {
        borderTopWidth: 1,
        borderTopColor: '#444',
        paddingTop: 10,
        marginTop: 10,
        width: '100%',
    },
    ticketButton: {
        backgroundColor: '#f57c00',
        paddingVertical: 8,
        paddingHorizontal: 15,
        borderRadius: 8,
        marginTop: 10,
        alignSelf: 'center',
    },
    ticketButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    noTicketsText: {
        color: '#f0f0f0',
        fontSize: 16,
        marginBottom: 20,
        fontWeight: '600',
        textAlign: 'center',
    },
    EditProfileSection: {
        width: '100%',
        marginBottom: 20,
    },
    avatarSelectionTitle: {
        fontSize: 16,
        marginBottom: 10,
        color: '#333',
        textAlign: 'center',
    },
    avatarOptionsContainer: {
        flexDirection: 'row',
        marginBottom: 20,
        justifyContent: 'space-around',
        width: '100%',
    },
    avatarOption: {
        padding: 5,
        borderWidth: 2,
        borderRadius: 50,
        borderColor: 'transparent',
    },
    selectedAvatarOption: {
        borderColor: '#6200ea',
    },
    avatarOptionImage: {
        width: 50,
        height: 50,
        borderRadius: 25,
    },
    input: {
        height: 40,
        borderColor: '#6200ea',
        borderWidth: 1,
        borderRadius: 8,
        marginBottom: 12,
        paddingHorizontal: 10,
        width: '100%',
        backgroundColor: '#fff',
    },
    qrCodeTitle: {
        color: '#ff8c00',
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    closeModalButton: {
        backgroundColor: '#ff4d4d',
        padding: 10,
        borderRadius: 50,
        marginTop: 20,
    }
});