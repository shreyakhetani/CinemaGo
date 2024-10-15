import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';

// Updated avatar options with your image paths
const avatarOptions = [
    require('../assets/images/avatars/avatar1.jpg'),
    require('../assets/images/avatars/avatar2.jpg'),
    require('../assets/images/avatars/avatar3.jpg'),
    require('../assets/images/avatars/avatar4.jpg'),
];

export default function ProfileScreen({ route, navigation }) {
    const userData = {
        firstName: "Ahmad",
        lastName: "Omid",
        email: "a.omid1984@gmail.com",
        phoneNumber: "04100000",
    };

    // State to manage selected avatar
    const [selectedAvatar, setSelectedAvatar] = useState(avatarOptions[0]);

    const handleEditProfile = () => {
        // Navigate to edit profile screen
        navigation.navigate('EditProfile'); // Change this to your actual edit profile screen
    };

    const handleChangePassword = () => {
        // Navigate to change password screen
        navigation.navigate('ChangePassword'); // Change this to your actual change password screen
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>My Profile</Text>

            <View style={styles.profileContainer}>
                <View style={styles.avatarContainer}>
                    <Image source={selectedAvatar} style={styles.avatar} />
                </View>
                <Text style={styles.name}>{`${userData.firstName} ${userData.lastName}`}</Text>
                <TouchableOpacity style={styles.editButton} onPress={handleEditProfile}>
                    <Text style={styles.editButtonText}>Edit Profile</Text>
                </TouchableOpacity>
            </View>

            {/* Avatar Selection */}
            <Text style={styles.avatarSelectionTitle}>Select Avatar</Text>
            <View style={styles.avatarOptionsContainer}>
                {avatarOptions.map((avatar, index) => (
                    <TouchableOpacity
                        key={index}
                        onPress={() => setSelectedAvatar(avatar)}
                        style={[
                            styles.avatarOption,
                            selectedAvatar === avatar && styles.selectedAvatarOption,
                        ]}
                    >
                        <Image source={avatar} style={styles.avatarOptionImage} />
                    </TouchableOpacity>
                ))}
            </View>

            <Text style={styles.accountSettingsTitle}>Account Settings</Text>
            <View style={styles.settingsContainer}>
                <TouchableOpacity style={styles.settingItem} onPress={handleChangePassword}>
                    <Text style={styles.settingText}>Change Password</Text>
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
        color: '#fff',
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
        borderColor: '#6200ea', // Outline color
        borderRadius: 50,
        padding: 5,
    },
    selectedAvatarOption: {
        borderColor: '#fff', // Highlight selected option
    },
    avatarOptionImage: {
        width: 60,
        height: 60,
        borderRadius: 30,
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
