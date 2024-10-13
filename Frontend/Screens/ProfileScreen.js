import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export default function ProfileScreen({ route, navigation }) {
    const userData = {
        firstName: "Ahmad",
        lastName: "Omid",
        email: "a.omid1984@gmail.com",
        username: "Omid22001",
        phoneNumber: "04100000",
    };

    const handleEditProfile = () => {
        // Navigate to edit profile screen
        navigation.navigate('EditProfile'); // Change this to your actual edit profile screen
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>My Profile</Text>

            <View style={styles.profileContainer}>
                <View style={styles.avatar}>
                    {/* Placeholder for the profile image */}
                </View>
                <Text style={styles.name}>{`${userData.firstName} ${userData.lastName}`}</Text>
                <Text style={styles.username}>{`@${userData.username}`}</Text>
                <TouchableOpacity style={styles.editButton} onPress={handleEditProfile}>
                    <Text style={styles.editButtonText}>Edit Profile</Text>
                </TouchableOpacity>
            </View>

            <Text style={styles.accountSettingsTitle}>Account Settings</Text>
            <View style={styles.settingsContainer}>
                <TouchableOpacity style={styles.settingItem}>
                    <Text style={styles.settingText}>Allow Notifications</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.settingItem}>
                    <Text style={styles.settingText}>Sign Out</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.settingItem}>
                    <Text style={styles.settingText}>Delete Account</Text>
                </TouchableOpacity>
            </View>

            {/* Ticket Section */}
            <View style={styles.ticketSection}>
                <Text style={styles.ticketTitle}>Tickets</Text>
                <Text style={styles.ticketText}>You have no tickets booked.</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#121212', // Dark background
    },
    title: {
        fontSize: 28,
        marginBottom: 20,
        textAlign: 'center',
        color: '#fff',
    },
    profileContainer: {
        alignItems: 'center',
        marginBottom: 20,
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#ccc', // Placeholder color for avatar
        marginBottom: 10,
    },
    name: {
        fontSize: 22,
        color: '#fff',
    },
    username: {
        fontSize: 18,
        color: '#ccc',
    },
    editButton: {
        marginTop: 10,
        padding: 10,
        backgroundColor: '#6200ea', // Edit button color
        borderRadius: 5,
    },
    editButtonText: {
        color: '#fff',
    },
    accountSettingsTitle: {
        fontSize: 24,
        marginBottom: 10,
        color: '#fff',
    },
    settingsContainer: {
        marginTop: 20,
    },
    settingItem: {
        padding: 15,
        borderBottomColor: '#ccc',
        borderBottomWidth: 1,
    },
    settingText: {
        fontSize: 18,
        color: '#fff',
    },
    ticketSection: {
        marginTop: 30,
        padding: 15,
        backgroundColor: '#1e1e1e', // Darker background for ticket section
        borderRadius: 5,
    },
    ticketTitle: {
        fontSize: 24,
        color: '#fff',
        marginBottom: 10,
    },
    ticketText: {
        color: '#ccc',
        fontSize: 18,
    },
});
