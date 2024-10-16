import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet, Modal, Pressable, Image, TouchableOpacity, Alert, ScrollView } from 'react-native';
import QRCode from 'react-native-qrcode-svg';

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

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Login</Text>
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
                                <Text style={styles.EditProfileTitle}>Edit Profile</Text>
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

                        <Pressable
                            style={styles.closeButton}
                            onPress={() => setIsModalVisible(false)}
                        >
                            <Text style={styles.closeButtonText}>Close</Text>
                        </Pressable>
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
        padding: 20,
        backgroundColor: '#f5f5f5',
    },
    title: {
        fontSize: 28,
        marginBottom: 20,
        textAlign: 'center',
        color: '#333',
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
