import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet, Modal, Pressable, Image, TouchableOpacity, Alert, ScrollView } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import * as FileSystem from 'expo-file-system';


const avatarOptions = [
    require('../assets/images/avatars/avatar1.jpg'),
    require('../assets/images/avatars/avatar2.jpg'),
    require('../assets/images/avatars/avatar3.jpg'),
    require('../assets/images/avatars/avatar4.jpg'),
];

// Sample ticket data for demo purposes
const availableSeats = ['A1', 'A2', 'A3', 'B1', 'B2', 'B3', 'C1', 'C2', 'C3'];

const getRandomSeat = () => {
    const randomIndex = Math.floor(Math.random() * availableSeats.length);
    return availableSeats[randomIndex];
};

// Sample ticket data with random seat selection
const sampleTickets = [
    { id: 1, movieName: 'Inception', date: '2024-10-20', time: '19:30', seat: getRandomSeat() },
    { id: 2, movieName: 'The Matrix', date: '2024-10-22', time: '21:00', seat: getRandomSeat() },
    { id: 3, movieName: 'Interstellar', date: '2024-10-25', time: '18:45', seat: getRandomSeat() },
];

const LoginScreen = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [userData, setUserData] = useState({ firstName: '', lastName: '', phoneNumber: '' });
    const [selectedAvatar, setSelectedAvatar] = useState(avatarOptions[0]);
    const [activeTab, setActiveTab] = useState('profile');
    const [isQRCodeModalVisible, setIsQRCodeModalVisible] = useState(false);
    const [selectedTicket, setSelectedTicket] = useState(null);
    // States for EditProfile
    const [newFirstName, setNewFirstName] = useState('');
    const [newLastName, setNewLastName] = useState('');
    const [newPhoneNumber, setNewPhoneNumber] = useState('');
    const router = useRouter();  // Ensure useRouter is imported correctly


    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert('Error', 'Please fill in all fields.');
            return;
        }

        try {
            const response = await fetch('http://192.168.0.12:5000/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (response.ok) {
                setUserData({ firstName: data.firstName, lastName: data.lastName, phoneNumber: data.phoneNumber });
                setIsModalVisible(true);
            } else {
                Alert.alert('Error', data.message || 'Login failed. Please try again.');
            }
        } catch (error) {
            console.error('Error logging in:', error);
            Alert.alert('Error', 'An error occurred. Please try again.');
        }
    };

    const handleTicketPress = (ticket) => {
        setSelectedTicket(ticket);
        setIsQRCodeModalVisible(true);
    };
    
    const handleLogout = async () => {
        const filePath = `${FileSystem.documentDirectory}userData.json`; // Path to the JSON file
        try {
            await FileSystem.deleteAsync(filePath); // Delete the user data file
            console.log('User data file deleted successfully.'); // Log success
        } catch (error) {
            console.error('Error deleting user data file:', error); // Log any errors
        }
        // Navigate to the index page
        router.replace('/'); // Replace with the home page
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
    const BackArrow = ({ onPress }) => {
        return (
          <TouchableOpacity onPress={onPress} style={styles.arrowContainer}>
            <Image source={require('../assets/images/icons/back_arrow.png')} style={styles.arrow} />
          </TouchableOpacity>
        );
      };
    return (
        <View style={styles.container}>
             {/* Back button */}
             <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                <Ionicons name="arrow-back" size={24} color="black" />
                <Text style={styles.title}>Login</Text>
            </TouchableOpacity>
            <TextInput
                style={styles.input}
                placeholder="Email"
                value={email}
                onChangeText={(text) => setEmail(text)}
                keyboardType="email-address"
                autoCapitalize="none"
            />
            <TextInput
                style={styles.input}
                placeholder="Password"
                value={password}
                onChangeText={(text) => setPassword(text)}
                secureTextEntry
            />
            <Button title="Login" onPress={handleLogin} />

            <Text style={styles.link} onPress={() => navigation.navigate('Signup')}>
                Don't have an account? Sign Up
            </Text>

            <Modal
                animationType="slide"
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
                                <View style={styles.avatarContainer}>
                                    <Image source={selectedAvatar} style={styles.avatar} />
                                </View>
                                <Text style={styles.name}>{`Welcome ${userData.firstName}`}</Text>
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
                                            {sampleTickets.map((ticket) => (
                                                <View key={ticket.id} style={styles.ticketItem}>
                                                    <Text style={styles.ticketText}>
                                                        {ticket.movieName} - {ticket.date} - {ticket.time}
                                                    </Text>
                                                    <Text style={styles.ticketText}>
                                                        Seat: {ticket.seat}  {/* Display selected seat */}
                                                    </Text>
                                                    <TouchableOpacity 
                                                        style={styles.ticketButton} 
                                                        onPress={() => handleTicketPress(ticket)}
                                                    >
                                                        <Text style={styles.ticketButtonText}>Show QR Code</Text>
                                                    </TouchableOpacity>
                                                </View>
                                            ))}
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
                                                            value={`Movie: ${selectedTicket.movieName}\nDate: ${selectedTicket.date}\nTime: ${selectedTicket.time}\nSeat: ${selectedTicket.seat}`}
                                                            size={200} // Adjust size as needed
                                                        />
                                                    </>
                                                )}
                                                <Pressable
                                                    style={styles.closeButton}
                                                    onPress={() => setIsQRCodeModalVisible(false)}
                                                >
                                                    <Text style={styles.closeButtonText}>Close</Text>
                                                </Pressable>
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
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        // alignItems: 'center',
        padding: 20,
        backgroundColor: '#f5f5f5',
    },
    backButton: {
        position: 'absolute',  // Absolute positioning
        top: 0,               // Adjust this to control vertical distance from the top
        left: 10,              // Adjust this to control horizontal distance from the left
        flexDirection: 'row',  // Align items in a row (horizontally)
        alignItems: 'center',  // Vertically center items
        padding: 10,
    },
    title: {
        fontSize: 18,
        marginLeft: 8,       // Add space between the arrow and the text
        color: 'black',
    },
    input: {
        height: 40,
        borderColor: '#6200ea',
        borderWidth: 1,
        borderRadius: 8,
        marginBottom: 12,
        paddingHorizontal: 10,
    },
    link: {
        color: '#6200ea',
        textAlign: 'center',
        marginTop: 20,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    buttonContainer: {
        marginBottom: 20,
        width: '80%', // Button width relative to screen
        borderRadius: 10,
        overflow: 'hidden',
      },
    modalView: {
        width: '90%',
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    tabContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 20,
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
    },
    avatarContainer: {
        marginBottom: 10,
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
    },
    name: {
        fontSize: 24,
        color: '#333',
    },
    ticketSection: {
        marginBottom: 20,
    },
    ticketItem: {
        padding: 10,
        marginVertical: 8,
        backgroundColor: '#6200ea',
        borderRadius: 8,
    },
    ticketText: {
        fontSize: 16,
        color: '#fff', // Adjust the color as needed
        marginBottom: 5,
        textAlign: 'center', // Center the text
    },
    ticketButton: {
        marginTop: 10,
        paddingVertical: 6,
        paddingHorizontal: 12,
        backgroundColor: '#fff',
        borderRadius: 4,
    },
    ticketButtonText: {
        color: '#6200ea',
        textAlign: 'center',
    },
    EditProfileSection: {
        marginBottom: 20,
    },
    EditProfileTitle: {
        fontSize: 18,
        marginBottom: 10,
    },
    avatarSelectionTitle: {
        fontSize: 16,
        marginBottom: 10,
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
    selectedAvatarOption: {
        borderColor: '#6200ea',
    },
    avatarOptionImage: {
        width: 50,
        height: 50,
        borderRadius: 25,
    },
    closeButton: {
        marginTop: 20,
        backgroundColor: '#6200ea',
        padding: 10,
        borderRadius: 8,
    },
    closeButtonText: {
        color: 'white',
        textAlign: 'center',
    },
    ticketButton: {
        backgroundColor: '#6200ea', // Button color
        padding: 10,
        borderRadius: 5,
        marginTop: 10,
    },
    ticketButtonText: {
        color: '#fff',
        textAlign: 'center',
    },
    qrCodeTitle: {
        fontSize: 20,
        marginBottom: 10,
        textAlign: 'center',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalView: {
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 20,
        width: '90%',
        alignItems: 'center', // Center items in modal
    },
});

export default LoginScreen;
