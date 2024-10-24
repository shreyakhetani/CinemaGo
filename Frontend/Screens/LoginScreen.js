import React, { useState, useEffect } from 'react';
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

const LoginScreen = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [userData, setUserData] = useState({ firstName: '', lastName: '', phoneNumber: '' });
    const [selectedAvatar, setSelectedAvatar] = useState(avatarOptions[0]);
    const [activeTab, setActiveTab] = useState('profile');
    const [isQRCodeModalVisible, setIsQRCodeModalVisible] = useState(false);
    const [selectedTicket, setSelectedTicket] = useState(null);
    const [selectedSeat, setSelectedSeat] = useState(null);
    const [tickets, setTickets] = useState([]);
    const [newFirstName, setNewFirstName] = useState('');
    const [newLastName, setNewLastName] = useState('');
    const [newPhoneNumber, setNewPhoneNumber] = useState('');
    const router = useRouter();

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert('Error', 'Please fill in all fields.');
            return;
        }

        try {
            const response = await fetch('https://g5-project-439411.nw.r.appspot.com/api/auth/login', {
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
                fetchTickets();
            } else {
                Alert.alert('Error', data.message || 'Login failed. Please try again.');
            }
        } catch (error) {
            console.error('Error logging in:', error);
            Alert.alert('Error', 'An error occurred. Please try again.');
        }
    };

    const fetchTickets = async () => {
        try {
            const ticketResponse = await fetch(`https://g5-project-439411.nw.r.appspot.com/api/tickets/tickets?email=${email}`);
            const ticketData = await ticketResponse.json();

            if (ticketResponse.ok) {
                setTickets(ticketData);
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
        if (email) {
            fetchTickets();
        }
    }, [email]);

    const saveUserDataToFile = async (userData) => {
        const filePath = `${FileSystem.documentDirectory}userData.json`;
        const jsonData = JSON.stringify(userData, null, 2);
        try {
            await FileSystem.writeAsStringAsync(filePath, jsonData);
            console.log('User data saved successfully at:', filePath);
        } catch (error) {
            console.error('Error writing to file', error);
        }
    };

    const handleGoHome = async () => {
        const userData = {
            email,
            avatar: selectedAvatar,
        };

        try {
            await saveUserDataToFile(userData);
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
            const response = await fetch('https://g5-project-439411.nw.r.appspot.com/api/auth/update', {
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
        <View style={styles.container}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                <Ionicons name="arrow-back" size={24} color="black" />
                <Text style={styles.title}>Login</Text>
            </TouchableOpacity>

            <TextInput
                style={styles.input}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
            />
            <TextInput
                style={styles.input}
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
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
                                                            <Text style={styles.ticketButtonText}>Show QR Code for</Text>
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
                            </View>
                        )}
                    </View>
                </View>
            </Modal>

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
    backButton: {
        position: 'absolute',
        top: 0,
        left: 10,
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
    },
    title: {
        fontSize: 18,
        marginLeft: 8,
        color: 'black',
    },
    input: {
        height: 40,
        borderColor: '#6200ea',
        borderWidth: 1,
        borderRadius: 8,
        marginBottom: 12,
        paddingHorizontal: 10,
        backgroundColor: '#fff',
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
        width: '80%',
        borderRadius: 10,
        overflow: 'hidden',
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
    avatarContainer: {
        marginBottom: 10,
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
    },
    name: {
        fontSize: 20,
        color: '#333',
        marginBottom: 20,
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
    seatContainer: {
        borderTopWidth: 1,
        borderTopColor: '#444',
        paddingTop: 10,
        marginTop: 10,
        width: '100%',
    },
    ticketItemText: {
        color: '#f0f0f0',
        fontSize: 15,
        marginBottom: 5,
        fontWeight: '600',
    },
    ticketDetail: {
        color: '#ffcc00',
        fontSize: 15,
        fontWeight: '500',
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
    },
    seatContainer: {
        borderTopWidth: 1,
        borderTopColor: '#444',
        paddingTop: 10,
        marginTop: 10,
        width: '100%',
    }
});

export default LoginScreen;