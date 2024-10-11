// ProfileScreen.js
import React, { useEffect, useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet, Alert } from 'react-native';
import axios from 'axios';

const ProfileScreen = ({ navigation }) => {
    const [userInfo, setUserInfo] = useState({
        firstName: '',
        lastName: '',
        email: '',
        username: '',
        phoneNumber: '',
    });

    useEffect(() => {
        // Fetch user info from your backend (replace with your actual API endpoint)
        const fetchUserInfo = async () => {
            try {
                const response = await axios.get('http://192.168.0.12:5000/api/user/info'); // Adjust the endpoint
                setUserInfo(response.data);
            } catch (error) {
                console.error('Error fetching user info:', error);
            }
        };

        fetchUserInfo();
    }, []);

    const handleSave = async () => {
        try {
            // Send the updated user info to your backend
            const response = await axios.put('http://192.168.0.12:5000/api/user/update', userInfo); // Adjust the endpoint
            Alert.alert('Success', 'Your information has been updated.');
        } catch (error) {
            console.error('Error updating user info:', error);
            Alert.alert('Error', 'Could not update information. Please try again.');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Profile</Text>

            <TextInput
                style={styles.input}
                placeholder="First Name"
                value={userInfo.firstName}
                onChangeText={(text) => setUserInfo({ ...userInfo, firstName: text })}
            />
            <TextInput
                style={styles.input}
                placeholder="Last Name"
                value={userInfo.lastName}
                onChangeText={(text) => setUserInfo({ ...userInfo, lastName: text })}
            />
            <TextInput
                style={styles.input}
                placeholder="Email"
                value={userInfo.email}
                onChangeText={(text) => setUserInfo({ ...userInfo, email: text })}
                keyboardType="email-address"
            />
            <TextInput
                style={styles.input}
                placeholder="Username"
                value={userInfo.username}
                onChangeText={(text) => setUserInfo({ ...userInfo, username: text })}
            />
            <TextInput
                style={styles.input}
                placeholder="Phone Number"
                value={userInfo.phoneNumber}
                onChangeText={(text) => setUserInfo({ ...userInfo, phoneNumber: text })}
                keyboardType="phone-pad"
            />
            
            <Button title="Save" onPress={handleSave} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#000', // Dark background for cinema effect
    },
    title: {
        fontSize: 24,
        color: '#ffcc00', // Bright yellow
        textAlign: 'center',
        marginBottom: 20,
    },
    input: {
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        marginBottom: 10,
        paddingHorizontal: 10,
        color: '#fff', // White text for input
        backgroundColor: '#1a1a1a', // Dark input background
    },
});

export default ProfileScreen;
