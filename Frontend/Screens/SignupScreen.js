import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet, Alert,TouchableOpacity } from 'react-native';
import CustomAlert from '@/components/CustomAlert';

const API_BASE_URL = 'https://g5-project-439411.nw.r.appspot.com';


export default function SignupScreen({ navigation }) {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [password, setPassword] = useState('');

      // State to control the custom alert
      const [alertVisible, setAlertVisible] = useState(false);
      const [alertTitle, setAlertTitle] = useState('');
      const [alertMessage, setAlertMessage] = useState('');

    // Regular expressions for validation
    const emailRegex = /^[a-zA-Z0-9._%+-]+@(gmail|outlook|yahoo)\.(com|fi|net)$/;
    const phoneNumberRegex = /^0\d{9}$/; // Starts with 0, followed by exactly 19 digits (10 digits in total)

    const handleSignup = async () => {
        // Basic validation
        if (!firstName || !lastName || !email || !phoneNumber || !password) {
            showAlert('Error', 'Please fill in all fields.');
            // Alert.alert('Error', 'Please fill in all fields.');
            return;
        }

        // Validate email
        if (!emailRegex.test(email)) {
            showAlert('Error', 'Email must be a valid Gmail, Outlook, Yahoo, .com, .fi, or .net domain.');
            // Alert.alert('Error', 'Email must be a valid Gmail, Outlook, Yahoo, .com, .fi, or .net domain.');
            return;
        }

        // Validate phone number
        if (!phoneNumberRegex.test(phoneNumber)) {
            showAlert('Error', 'Phone number must start with 0 and contain exactly 10 digits.');
            // Alert.alert('Error', 'Phone number must start with 0 and contain exactly 10 digits.');
            return;
        }

        // Validate password length
        if (password.length < 8) {
            showAlert('Error', 'Password must be at least 8 characters long.');
            // Alert.alert('Error', 'Password must be at least 8 characters long.');
            return;
        }

        try {

            const response = await fetch(`${API_BASE_URL}/api/auth/signup`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    firstName,
                    lastName,
                    email,
                    phoneNumber,
                    password,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                showAlert('Signup successful!', 'You can now log in.');
                // Alert.alert('Signup successful!', 'You can now log in.');
                navigation.navigate('Login');
            } else {
                showAlert('Error', data.message); 
                // Alert.alert('Error', data.message); // Show the error message from the server
            }
        } catch (error) {
            console.error('Error signing up:', error);
            showAlert('Error', 'An error occurred. Please try again.');
            // Alert.alert('Error', 'An error occurred. Please try again.');
        }
    };
    // Function to show custom alert
    const showAlert = (title, message) => {
        setAlertTitle(title);
        setAlertMessage(message);
        setAlertVisible(true);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Sign Up</Text>

            <TextInput
                style={styles.input}
                placeholder="First Name"
                value={firstName}
                onChangeText={(text) => setFirstName(text)}
            />

            <TextInput
                style={styles.input}
                placeholder="Last Name"
                value={lastName}
                onChangeText={(text) => setLastName(text)}
            />

            <TextInput
                style={styles.input}
                placeholder="Email"
                value={email}
                onChangeText={(text) => setEmail(text)}
                keyboardType="email-address"
            />

            <TextInput
                style={styles.input}
                placeholder="Phone Number"
                value={phoneNumber}
                onChangeText={(text) => setPhoneNumber(text)}
                keyboardType="phone-pad"
            />

            <TextInput
                style={styles.input}
                placeholder="Password"
                value={password}
                onChangeText={(text) => setPassword(text)}
                secureTextEntry
            />
            <TouchableOpacity style={styles.signupButton} onPress={handleSignup}>
                            <Text style={styles.signupText}>Sign Up</Text>
                        </TouchableOpacity>

            {/* <Button title="Sign Up" onPress={handleSignup} /> */}

            <Text style={styles.link} onPress={() => navigation.navigate('Login')}>
                Already have an account? Login
            </Text>

            <CustomAlert
                visible={alertVisible}
                onClose={() => setAlertVisible(false)}
                title={alertTitle}
                message={alertMessage}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        justifyContent: 'center',
        
    },
    title: {
        fontSize: 24,
        marginBottom: 20,
        textAlign: 'center',
        color: '#1e2a3a',
        fontWeight: '600',
    },
    input: {
        height: 40,
        borderColor: '#000',
        borderWidth: 1,
        marginBottom: 10,
        paddingHorizontal: 10,
        borderRadius: 8,
    },
    signupButton:{
        backgroundColor: '#1e2a3a',
        paddingVertical: 12,
        paddingHorizontal: 25,
        borderRadius: 5,
        marginTop: 15,
        alignItems: 'center',
    },
    signupText:{
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    link: {
        color: '#1e2a3a',
        marginTop: 20,
        textAlign: 'center',
    },
});
