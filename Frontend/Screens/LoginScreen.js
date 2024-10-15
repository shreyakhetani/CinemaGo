import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet, Modal, Pressable, Image, TouchableOpacity } from 'react-native';

// Updated avatar options
const avatarOptions = [
    require('../assets/images/avatars/avatar1.jpg'),
    require('../assets/images/avatars/avatar2.jpg'),
    require('../assets/images/avatars/avatar3.jpg'),
    require('../assets/images/avatars/avatar4.jpg'),
];

const LoginScreen = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isModalVisible, setIsModalVisible] = useState(false); // Modal visibility state
    const [userData, setUserData] = useState({ firstName: '', lastName: '' }); // User data state
    const [selectedAvatar, setSelectedAvatar] = useState(avatarOptions[0]); // Selected avatar
    const [activeTab, setActiveTab] = useState('profile'); // Tab state

    const handleLogin = async () => {
        // Basic validation
        if (!email || !password) {
            Alert.alert('Error', 'Please fill in all fields.');
            return;
        }

        try {
            const response = await fetch('http://192.168.0.12:5000/api/auth/login', { // Adjust this URL to your backend
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (response.ok) {
                // Set the user data after a successful login
                setUserData({ firstName: data.firstName, lastName: data.lastName });
                // Open the profile modal
                setIsModalVisible(true);
            } else {
                Alert.alert('Error', data.message || 'Login failed. Please try again.');
            }
        } catch (error) {
            console.error('Error logging in:', error);
            Alert.alert('Error', 'An error occurred. Please try again.');
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

            {/* Modal for showing the profile pop-up after login */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={isModalVisible}
                onRequestClose={() => setIsModalVisible(false)} // Close modal on back button
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
                        </View>

                        {activeTab === 'profile' && (
                            <View style={styles.profileContainer}>
                                <View style={styles.avatarContainer}>
                                    <Image source={selectedAvatar} style={styles.avatar} />
                                </View>
                                <Text style={styles.name}>{`${userData.firstName} ${userData.lastName}`}</Text>

                                <Text style={styles.avatarSelectionTitle}>Select Avatar</Text>
                                <View style={styles.avatarOptionsContainer}>
                                    {avatarOptions.map((avatar, index) => (
                                        <Pressable
                                            key={index}
                                            onPress={() => setSelectedAvatar(avatar)}
                                            style={[
                                                styles.avatarOption,
                                                selectedAvatar === avatar && styles.selectedAvatarOption,
                                            ]}
                                        >
                                            <Image source={avatar} style={styles.avatarOptionImage} />
                                        </Pressable>
                                    ))}
                                </View>
                            </View>
                        )}

                        {activeTab === 'tickets' && (
                            <View style={styles.ticketSection}>
                                <Text style={styles.ticketTitle}>Tickets</Text>
                                <Text style={styles.ticketText}>You don't have any tickets booked.</Text>
                            </View>
                        )}

                        <Pressable
                            style={styles.closeButton}
                            onPress={() => setIsModalVisible(false)} // Close the modal
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
        backgroundColor: '#f5f5f5', // Lighter background
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
        borderRadius: 5,
        marginBottom: 15,
        paddingHorizontal: 10,
        color: '#333', // Text color
        backgroundColor: '#fff', // Input background color
    },
    link: {
        marginTop: 15,
        textAlign: 'center',
        color: '#6200ea',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.8)', // Black transparent background
    },
    modalView: {
        width: '90%',
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 20,
        alignItems: 'center',
    },
    tabContainer: {
        flexDirection: 'row',
        marginBottom: 20,
    },
    tab: {
        flex: 1,
        padding: 10,
        backgroundColor: '#eee',
        alignItems: 'center',
        borderRadius: 5,
        marginHorizontal: 5,
    },
    activeTab: {
        backgroundColor: '#6200ea',
    },
    tabText: {
        color: '#333',
        fontSize: 16,
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
    avatarSelectionTitle: {
        fontSize: 24,
        color: '#333',
        marginTop: 20,
        marginBottom: 10,
        textAlign: 'center',
    },
    avatarOptionsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 20,
    },
    avatarOption: {
        borderWidth: 2,
        borderColor: '#6200ea',
        borderRadius: 50,
        padding: 5,
    },
    selectedAvatarOption: {
        borderColor: '#fff',
    },
    avatarOptionImage: {
        width: 60,
        height: 60,
        borderRadius: 30,
    },
    ticketSection: {
        marginTop: 30,
        padding: 15,
        backgroundColor: '#f0f0f0', // Lighter background for ticket section
        borderRadius: 5,
    },
    ticketTitle: {
        fontSize: 24,
        color: '#333',
        marginBottom: 10,
    },
    ticketText: {
        color: '#999',
        fontSize: 18,
    },
    closeButton: {
        marginTop: 20,
        padding: 10,
        backgroundColor: '#6200ea',
        borderRadius: 5,
    },
    closeButtonText: {
        color: '#fff',
        fontSize: 18,
    },
});

export default LoginScreen;
