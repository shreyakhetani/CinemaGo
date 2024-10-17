import { useRouter, useLocalSearchParams } from 'expo-router';
import { SafeAreaView, StyleSheet, TouchableOpacity, Image, Text } from 'react-native';

export default function Home() {
    const router = useRouter();
    const { avatar, email } = useLocalSearchParams();  // Retrieve avatar and email from params if passed

    // Set the default image if no avatar is selected
    const avatarSource = avatar ? { uri: avatar } : require('../assets/images/icons/human_Icon.jpg');

    return (
        <SafeAreaView style={styles.container}>
            {/* Wrap the text in a <Text> component */}
            <Text style={styles.textStyle}>
                {email ? `Hello, ${email}!` : 'Hello, Guest!'}
            </Text>
            
            {/* Display the avatar image */}
            <Image source={avatarSource} style={styles.avatar} />

            {/* TouchableOpacity with an image for navigation */}
            <TouchableOpacity style={styles.circleButton} onPress={() => router.push('/Signup_Login')}>
                <Image 
                    source={avatarSource}  // Use avatar if exists, otherwise default image
                    style={styles.buttonImage} 
                />
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
        fontSize: 18, // Add your desired text style
        marginBottom: 20, // Space below the text
    },
    avatar: {
        width: 100, // Adjust size as needed
        height: 100, // Adjust size as needed
        borderRadius: 50, // Make it circular
        marginBottom: 20, // Space below the avatar
    },
    circleButton: {
        position: 'absolute',
        right: 20,
        top: 20, // Move to the top right
        width: 60,
        height: 60,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 30, // Make it circular
        borderWidth: 2, // Border width
        borderColor: 'black', // Border color
        backgroundColor: 'white', // Background color for contrast
    },  
    buttonImage: {
        width: 30, // Adjust size as needed
        height: 30, // Adjust size as needed
    },
});
