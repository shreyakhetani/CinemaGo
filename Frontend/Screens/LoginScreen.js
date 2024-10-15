import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet, Modal, Pressable, Image, TouchableOpacity, Alert } from 'react-native';

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
                setUserData({ ...userData, ...updatedData }); // Update user data state
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
                                <Text style={styles.tabText}>EditProfile</Text>
                            </TouchableOpacity>
                        </View>

                        {/* Profile Tab */}
                        {activeTab === 'profile' && (
                            <View style={styles.profileContainer}>
                                <View style={styles.avatarContainer}>
                                    <Image source={selectedAvatar} style={styles.avatar} />
                                </View>
                                <Text style={styles.name}>{`Welcome ${userData.firstName}`}</Text>

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
                            </View>
                        )}

                        {/* Tickets Tab */}
                        {activeTab === 'tickets' && (
                            <View style={styles.ticketSection}>
                                <Text style={styles.ticketTitle}>Tickets</Text>
                                <Text style={styles.ticketText}>You don't have any tickets booked.</Text>
                            </View>
                        )}

                        {/* EditProfile Tab */}
                        {activeTab === 'EditProfile' && (
                            <View style={styles.EditProfileSection}>
                                <Text style={styles.EditProfileTitle}>Edit Profile</Text>
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
        borderRadius: 5,
        marginBottom: 15,
        paddingHorizontal: 10,
        color: '#333',
        backgroundColor: '#fff',
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
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalView: {
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 20,
        width: '90%',
    },
    tabContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    tab: {
        paddingVertical: 10,
    },
    activeTab: {
        borderBottomWidth: 2,
        borderBottomColor: '#6200ea',
    },
    tabText: {
        fontSize: 16,
    },
    profileContainer: {
        alignItems: 'center',
        marginTop: 20,
    },
    avatarContainer: {
        marginBottom: 20,
    },
    avatar: {
        width: 80,
        height: 80,
        borderRadius: 40,
    },
    name: {
        fontSize: 22,
        marginBottom: 20,
    },
    avatarSelectionTitle: {
        fontSize: 16,
        marginBottom: 10,
    },
    avatarOptionsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    avatarOption: {
        padding: 5,
        borderRadius: 5,
        borderWidth: 2,
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
    ticketSection: {
        marginTop: 20,
        alignItems: 'center',
    },
    ticketTitle: {
        fontSize: 22,
        marginBottom: 10,
    },
    ticketText: {
        fontSize: 16,
        color: '#333',
    },
    EditProfileSection: {
        marginTop: 20,
    },
    closeButton: {
        marginTop: 20,
        backgroundColor: '#6200ea',
        padding: 10,
        borderRadius: 5,
    },
    closeButtonText: {
        color: 'white',
        textAlign: 'center',
    },
});

export default LoginScreen;
