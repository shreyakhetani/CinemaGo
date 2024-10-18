import React, { useEffect, useState } from 'react';
import * as FileSystem from 'expo-file-system'; // Import FileSystem API
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';

// Define the type for user data
interface UserData {
    email?: string; // Optional property
    firstName?: string; // Optional property
    avatar?: string | number; // Allow avatar to be a string or number
}

const avatarOptions = [
    require('../assets/images/avatars/avatar1.jpg'),
    require('../assets/images/avatars/avatar2.jpg'),
    require('../assets/images/avatars/avatar3.jpg'),
    require('../assets/images/avatars/avatar4.jpg'),
];

export default function Home() {
    const router = useRouter();
    const [firstName, setFirstName] = useState<string | null>(null); // State for storing first name
    const [loading, setLoading] = useState<boolean>(true); // State for loading status
    const [error, setError] = useState<string | null>(null); // State for handling errors
    const [avatar, setAvatar] = useState<number | null>(null); // State for storing the avatar index

    const filePath = `${FileSystem.documentDirectory}userData.json`; // Path to the JSON file

    // Function to fetch user data from the API by email
    const fetchUserData = async (email: string) => {
        try {
            const response = await fetch(`http://192.168.0.12:5000/api/auth/user?email=${email}`);
            const userData: UserData = await response.json(); // Use UserData interface

            if (response.ok && userData) {
                setFirstName(userData.firstName || null); // Set first name, default to null if undefined
            } else {
                setError('Unable to fetch user data.');
            }
        } catch (error) {
            console.error('Error fetching user data:', error);
            setError('Error fetching user data.');
        }
    };

    // Function to read the user data from the JSON file
    const loadUserDataFromFile = async () => {
        try {
            // Check if the file exists
            const fileInfo = await FileSystem.getInfoAsync(filePath);
            if (!fileInfo.exists) {
                console.log('User data file does not exist.'); // Log that the file is missing
                setLoading(false); // Set loading to false
                return; // Exit the function if the file doesn't exist
            }
    
            // Read the file content
            const fileContent = await FileSystem.readAsStringAsync(filePath);
            const userData: UserData = JSON.parse(fileContent); // Use UserData interface
    
            // Log the entire user data from the JSON file
            console.log('User Data from JSON File:', userData); // Log the entire user data for debugging
    
            // Define avatar number and email from userData
            const avatarNumber = userData.avatar; // Assuming avatar is a number
            const email = userData.email; // Assuming email is present
    
            // Log the extracted values for debugging
            console.log('Avatar Number:', avatarNumber);
            console.log('Email:', email);
    
            // Fetch user data if email exists
            if (email) {
                await fetchUserData(email); // Wait for user data to be fetched
            } else {
                setError('No email found in user data.');
                setLoading(false);
            }
    
            // Set the avatar based on the number directly from the file
            if (typeof avatarNumber === 'number') {
                // Validate the avatar number and set the avatar index
                if (avatarNumber >= 22 && avatarNumber <= 25) {
                    setAvatar(avatarNumber - 22); // Adjust index for avatar options
                } else {
                    console.log('User avatar number not in expected range.'); // Debugging output
                    setAvatar(null); // Use default human icon if not in range
                }
            } else {
                console.log('Avatar number is not a valid number.');
            }
        } catch (error) {
            console.error('Error reading user data:', error);
            setError('Error reading user data.');
        } finally {
            setLoading(false); // Stop loading once the data is fetched
        }
    };

    // Load user data when the component mounts
    useEffect(() => {
        loadUserDataFromFile();
    }, []);

    // If still loading, show a loading message
    if (loading) {
        return (
            <SafeAreaView style={styles.container}>
                <Text style={styles.textStyle}>Loading...</Text>
            </SafeAreaView>
        );
    }

    // If there's an error, show the error message
    if (error) {
        return (
            <SafeAreaView style={styles.container}>
                <Text style={styles.textStyle}>{error}</Text>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            {/* Display the appropriate greeting based on the presence of the first name */}
            <Text style={styles.textStyle}>
                {firstName ? `Hello, ${firstName}!` : 'Hello, Guest!'}
            </Text>

            {/* Display the selected avatar or the default human icon */}
            <TouchableOpacity style={styles.circleButton} onPress={() => router.push('/Signup_Login')}>
                {avatar !== null ? (
                    <Image
                        source={avatarOptions[avatar]} // Use selected avatar
                        style={styles.avatarStyle}
                    />
                ) : (
                    <Image
                        source={require('../assets/images/icons/human_Icon.jpg')} // Default human icon
                        style={styles.avatarStyle}
                    />
                )}
            </TouchableOpacity>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    textStyle: {
        fontSize: 18,
        marginBottom: 20,
    },
    circleButton: {
        position: 'absolute',
        right: 20,
        top: 20,
        width: 60, // Size of the button
        height: 60,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 30,
        borderWidth: 2,
        borderColor: 'black',
        backgroundColor: 'white',
    },
    avatarStyle: {
        width: 60, // Width of the avatar
        height: 60, // Height of the avatar
        borderRadius: 30, // Circle shape
    },
});
