import React, { useEffect, useState } from 'react';
import { Image, TextInput,StyleSheet, View, ScrollView, Text, TouchableOpacity,Modal,Pressable,Alert,Button } from 'react-native';
import Svg, { G, Path } from 'react-native-svg';
import { useRouter } from 'expo-router';
import * as FileSystem from 'expo-file-system';
import Footer from '../components/footer';
import axios from 'axios';
import { Ionicons } from '@expo/vector-icons';
import QRCode from 'react-native-qrcode-svg';


// Define the type for user data
interface UserData {
    email?: string;
    firstName?: string;
    avatar?: string | number;
}

const API_BASE_URL = 'http://192.168.0.12:5000';

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
    const baseName = imageName.split('.')[0]; // Remove file extension

    if (images[baseName]) {
        return images[baseName];
    } else {
        console.warn(`Image not found: ${imageName}`);
        return images['splash'];
    }
};

const getTodayDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = (today.getMonth() + 1).toString().padStart(2, '0');
    const day = today.getDate().toString().padStart(2, '0');
    return `TODAY ${day}.${month}`;
};

export interface Movie {
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

export default function HomeScreen() {
    const router = useRouter();
    const [movies, setMovies] = useState<Movie[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [firstName, setFirstName] = useState<string | null>(null);
    const [avatar, setAvatar] = useState<number | null>(null);
    const [error, setError] = useState<string | null>(null);
    const todayDate = getTodayDate();
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [activeTab, setActiveTab] = useState('profile');
    const [selectedAvatar, setSelectedAvatar] = useState(avatarOptions[0]);
    const [userData, setUserData] = useState({ firstName: '', lastName: '', phoneNumber: '' });
    const [email, setEmail] = useState('');
    const [tickets, setTickets] = useState([]);
    const [selectedTicket, setSelectedTicket] = useState(null);
    const [isQRCodeModalVisible, setIsQRCodeModalVisible] = useState(false);
    // States for EditProfile
    const [newFirstName, setNewFirstName] = useState('');
    const [newLastName, setNewLastName] = useState('');
    const [newPhoneNumber, setNewPhoneNumber] = useState('');
    //Files for user data
    const filePath = `${FileSystem.documentDirectory}userData.json`;

    useEffect(() => {
        const fetchMovies = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/api/movies/movies`);
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
    const handleLogout = async () => {
        const filePath = `${FileSystem.documentDirectory}userData.json`; // Path to the JSON file
        try {
            await FileSystem.deleteAsync(filePath); // Delete the user data file
            console.log('User data file deleted successfully.'); // Log success
        } catch (error) {
            // console.error('Error deleting user data file:', error); // Log any errors
        }
        // Navigate to the index page
        router.replace('/'); // Replace with the home page
    };

    const fetchUserData = async () => {
        try {
            const response = await fetch(`http://localhost:5000/api/auth/user?email=${email}`);
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
                console.log('Fetched user data:', data);
                setUserData(data);
            } else {
                setError('No user data available.');
            }
        } catch (error) {
            // console.error('Error fetching user data:', error);
            setError('Error fetching user data.');
        }
    };
    
    const handleDeleteAccount = async () => {
        const response = await fetch('http://192.168.0.12:5000/api/auth/delete', {
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
            // Optionally, redirect to another screen or perform other actions
        } else {
            Alert.alert('Error', data.message || 'Delete failed. Please try again.');
        }
    };
    const loadUserDataFromFile = async () => {
        try {
            const fileInfo = await FileSystem.getInfoAsync(filePath);
            if (!fileInfo.exists) {
                console.log('User data file does not exist.');
                setLoading(false);
                return;
            }
    
            const fileContent = await FileSystem.readAsStringAsync(filePath);
            const userDataFile: UserData = JSON.parse(fileContent);
    
            const avatarNumber = userDataFile.avatar;
            const email = userDataFile?.email;  // Using optional chaining to safely access the email
    
            if (email) {
                setEmail(email);  // Only set email if it's a valid string
                console.log("User data loaded:", userDataFile);  // Log the loaded user data
                console.log("Email:", email);  // Log the email
    
                // Fetch user data and tickets using the email
                await fetchUserData(email);
                await fetchTickets(email);  // Pass email to fetch tickets
            } else {
                setError('No email found in user data.');
                setLoading(false);
            }
    
            // If avatar number is valid, update the avatar state
            if (typeof avatarNumber === 'number' && avatarNumber >= 26) {
                setAvatar(avatarNumber - 26);  // Adjust avatar range if needed
                console.log("Updated Avatar:", avatarNumber - 26);  // Log the updated avatar state
            } else {
                setAvatar(null);  // If avatar is not valid, set it to null
                console.log("Invalid Avatar: null");
            }
        } catch (error) {
            console.error('Error loading user data from file:', error);
            setError('Error loading user data from file.');
        }
    };
  

    const handleMoviePress = (movieId: string) => {
        router.push({
            pathname: '/MovieDetail',
            params: { id: movieId },
        });
    };

    const saveUserDataToFile = async (userData) => {
        // Define the path where you want to save the JSON file
        const filePath = `${FileSystem.documentDirectory}userData.json`;
    
        // Convert the user data to a JSON string
        const jsonData = JSON.stringify(userData, null, 2); // null and 2 are used for pretty formatting
    
        try {
            // Write the JSON data to a file
            await FileSystem.writeAsStringAsync(filePath, jsonData);
            console.log('User data saved successfully at:', filePath);
        } catch (error) {
            console.error('Error writing to file', error);
        }
    };
const handleGoHome = async () => {
        const userEmail = email; // Email from the state
        const avatar = selectedAvatar; // Assuming the avatar is selected and stored correctly
    
        console.log("Email:", userEmail); // Log the correct email
        console.log("Avatar:", avatar); // Log the correct avatar path
        
        // Create the data object
        const userData = {
            email: userEmail, // Use the correct email
            avatar: avatar, // Avatar as an image reference
        };
    
        try {
            // Save the user data and wait for the operation to complete
            await saveUserDataToFile(userData);
            console.log('User data saved successfully');
    
            // Navigate to the home page after data is saved
            router.push('/');
        } catch (error) {
            console.error('Error saving user data or navigating:', error);
        }
    };
    const fetchTickets = async (email) => {
        try {
            const ticketResponse = await fetch(`http://192.168.0.12:5000/api/tickets/tickets?email=${email}`);
            const ticketData = await ticketResponse.json();
    
            if (ticketResponse.ok) {
                setTickets(ticketData); // Update state with ticket data
            } else {
                // console.error('Failed to fetch tickets:', ticketData);
            }
        } catch (error) {
            console.error('Error fetching tickets:', error);
            Alert.alert('Error', 'An error occurred while fetching tickets.');
        }
    };

    const handleTicketPress = (ticket) => {
        setSelectedTicket(ticket);
        setIsQRCodeModalVisible(true);
    };
    useEffect(() => {
        // console.log("Updated tickets:", tickets); // Logs tickets after state update
    }, [tickets]); // The effect will run whenever `tickets` state changes

    // Fetch tickets when the component mounts
    useEffect(() => {
        fetchTickets();
    }, []);

    const handleUpdateProfile = async () => {
        const updatedData = {
            email,
            firstName: newFirstName || userData.firstName,
            lastName: newLastName || userData.lastName,
            phoneNumber: newPhoneNumber || userData.phoneNumber,
        };

        try {
            const response = await fetch('http://192.168.0.12:5000/api/auth/update', {
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

    return (
        <ScrollView contentContainerStyle={styles.scrollView}>
            {/* Header for CinemaGo */}
            <View style={styles.header}>
                <Image source={require('../assets/images/CinemaGo10.jpg')} style={styles.headerImage} resizeMode="contain" />
                <TouchableOpacity 
                    style={styles.circleButton} 
                    onPress={() => {
                        if (avatar === null) {
                            // Navigate to signup/login page
                            router.push('/Signup_Login');
                        } else {
                            // Open the modal
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
                <Text style={[styles.headerText]}>
                    After his home is conquered by the tyrannical emperors who now lead Rome, Lucius is forced to enter the Colosseum and must look to his past to find strength to return the glory of Rome to its people
                </Text>
                <Text style={[styles.headerText2]}>Gladiator II Release Day: 15th October</Text>
            </View>
    
            <View style={styles.container}>
                {movies.map((movie) => (
                    <View key={movie._id} style={styles.movieContainer}>
                        <View style={styles.contentRow}>
                            <Image source={getImageSource(movie.imageName)} style={styles.movieImage} resizeMode="cover" />
                            <View style={styles.content}>
                                <Text style={[styles.title]}>{movie.name}</Text>
                                <Text style={[styles.day]}>{todayDate}</Text>
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
    
            {/* Modal */}
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

                        {/* Profile Tab */}
                        {activeTab === 'profile' && (
                            <View style={styles.profileContainer}>
                                <Text style={styles.name}>{`Welcome to your profile`}</Text>
                                 {/* Log Out Button */}
                                 <View style={styles.buttonContainer}>
                                    <Button 
                                    title="Log Out" 
                                    onPress={handleLogout} 
                                    color="#ff5c5c" // Custom color for Log Out button
                                    />
                                </View>
                                <View style={styles.buttonContainer}>
                                    <Button 
                                    title="Go to Home" 
                                    onPress={handleGoHome} 
                                    color="#4a90e2" // Custom color for Home button
                                    />
                                </View> 
                            </View>
                            
                        )}
                        {/* Tickets Tab */}
                        {activeTab === 'tickets' && (
                    <ScrollView style={styles.ticketSection}>
                        {tickets.length > 0 ? (
                        tickets.map((ticket, index) => (
                            <View key={index} style={styles.ticketItem}>
                                <Text style={styles.ticketItemText}>Movie: <Text style={styles.ticketDetail}>{ticket.movieName}</Text></Text>
                                <Text style={styles.ticketItemText}>Hall: <Text style={styles.ticketDetail}>{ticket.hallName}</Text></Text>
                                <Text style={styles.ticketItemText}>Showtime: <Text style={styles.ticketDetail}>{new Date(ticket.showtime).toLocaleString()}</Text></Text>
                                <Text style={styles.ticketItemText}>Duration: <Text style={styles.ticketDetail}>{ticket.duration}</Text></Text>
                                <Text style={styles.ticketItemText}>Language: <Text style={styles.ticketDetail}>{ticket.language}</Text></Text>
                                <Text style={styles.ticketItemText}>Seats: <Text style={styles.ticketDetail}>{ticket.seat}</Text></Text>

                                {/* Generate QR Code for each seat */}
                                <TouchableOpacity
                                    style={styles.ticketButton}
                                    onPress={() => handleTicketPress(ticket)}
                                >
                                    <Text style={styles.ticketButtonText}>Show QR Code</Text>
                                </TouchableOpacity>
                            </View>
                        ))
                    ) : (
                        <Text style={styles.noTicketsText}>You don't have any tickets.</Text>
                    )}
                    </ScrollView>
                )}

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
                                        value={`Movie: ${selectedTicket.movieName}\nHall: ${selectedTicket.hallName}\nShowtime: ${new Date(selectedTicket.showtime).toLocaleString()}\nSeats: ${selectedTicket.seat}`}
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
                        {/* EditProfile Tab */}
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
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    ticketDetail: {
        color: '#ffcc00', // Bright yellow/orange for the details to stand out
        fontSize: 16,
        fontWeight: '500', // Slightly lighter text for the ticket details
    },
    avatarOptionImage: {
        width: 50,
        height: 50,
        borderRadius: 25,
    },
    selectedAvatarOption: {
        borderColor: '#6200ea',
    },
    input: {
        height: 40,
        borderColor: '#6200ea',
        borderWidth: 1,
        borderRadius: 8,
        marginBottom: 12,
        paddingHorizontal: 10,
    },
    avatarOptionsContainer: {
        flexDirection: 'row',
        marginBottom: 20,
        justifyContent: 'space-around',
    },
    avatarOption: {
        padding: 5,
        borderWidth: 2,
        borderRadius: 50,
        borderColor: 'transparent',
    },
    avatarSelectionTitle: {
        fontSize: 16,
        marginBottom: 10,
    },
    EditProfileSection: {
        marginBottom: 20,
    },
    qrCodeTitle: {
        color: '#ff8c00', // Cinema-style orange for the title
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    noTicketsText:{
        color: '#f0f0f0', // Light-colored text for readability
        fontSize: 16,
        marginBottom: 20,
        fontWeight: '600', // Slightly bolder text for labels
    },
    ticketButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center', // Ensure text is centered in button
    },
    ticketButton: {
        backgroundColor: '#f57c00', // Cinema-inspired orange button color
        paddingVertical: 8,
        paddingHorizontal: 15,
        borderRadius: 8,
        marginTop: 10,
        alignSelf: 'center', // Center the button
        width: 'auto',
    },
    ticketItemText: {
        color: '#f0f0f0', // Light-colored text for readability
        fontSize: 16,
        marginBottom: 5,
        fontWeight: '600', // Slightly bolder text for labels
    },
    ticketItem: {
        backgroundColor: '#222', // Dark background to keep the cinema theme
        padding: 15,
        marginBottom: 15,
        borderRadius: 15, // Rounded corners for a modern look
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 6, // Adds depth to the card
        alignItems: 'flex-start', // Align text to the left
        width: '100%',
        minHeight: 120,
        borderWidth: 1,
        borderColor: '#444', // A subtle border to separate each ticket
    },
    ticketSection: {
        backgroundColor: '#1c1c1c', // Dark background for a cinema feel
        padding: 20,
        borderRadius: 10,
    },
    buttonContainer: {
        marginBottom: 20,
        width: '80%', // Button width relative to screen
        borderRadius: 10,
        overflow: 'hidden',
      },
    name: {
        fontSize: 20,
        color: '#333',
    },
    avatarContainer: {
        marginBottom: 10,
    },
    profileContainer: {
        alignItems: 'center',
        marginBottom: 20,
    },
    tabText: {
        fontSize: 16,
        color: '#333',
    },
    activeTab: {
        borderBottomWidth: 2,
        borderBottomColor: '#6200ea',
    },
    tab: {
        padding: 10,
    },
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
      width: '100%', // Full width for a larger header image
      height: 600, // Increased height for prominence
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
    },
    headerText: {
      fontSize: 15, // Adjust font size for readability
      fontWeight: '400', // Normal weight for the text
      marginBottom: 15, 
      color: '#fff', // Color of the text
      paddingHorizontal: 20, // Horizontal padding for better layout
      textAlign: 'center', // Center align the text
    },
    headerText2: {
      fontSize: 20, // Adjust font size for readability
      fontWeight: 'bold', // Normal weight for the text
      color: '#fff', // Color of the text
      marginTop: 15, // Space above the text
      marginBottom: 20, 
      paddingHorizontal: 20, // Horizontal padding for better layout
      textAlign: 'center', // Center align the text
      
      },
    container: {
      flexGrow: 1,
      paddingVertical: 20,
      paddingHorizontal: 10,
      alignItems: 'center',
      backgroundColor: '#000', // Keep background for the rest of the app
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
    image: {
      width: 120,
      height: 180,
      resizeMode: 'contain',
      backgroundColor: '#f0f0f0',
      borderRadius: 8,
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
    tabContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 20,
    },
    subtitleText: {
      marginLeft: 5,
      fontSize: 14,
      color: '#1c3d72',
    },
    lang: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#eef3f8',
      padding: 6,
      borderRadius: 8,
      marginRight: 10,
    },
    button: {
        backgroundColor: '#163d71',
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderRadius: 5,
        marginTop: 10
    },
    buttonText: {
      color: '#fff',
      fontSize: 18,
      fontWeight: 'bold',
    },
    avatarStyle: {
        width: 50,
        height: 50,
        borderRadius: 25,
        borderWidth: 2,
        borderColor: '#fff',
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
    backgroundColor: '#f4f4f4', // Lighter background for better visibility
    padding: 30,
    borderRadius: 20,
    width: '80%',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5, // Adds shadow effect for depth
},
closeModalButton: {
    backgroundColor: '#ff4d4d', // Close button in red for attention
    padding: 10,
    borderRadius: 50,
    marginTop: 20,
},
});
