import { useRouter } from 'expo-router';
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, Image } from 'react-native';

export default function Home() {
    const router = useRouter();

    return (
        <SafeAreaView style={styles.container}>
            <Text>Hello, this is the Home screen!</Text>
            {/* TouchableOpacity with an image for navigation */}
            <TouchableOpacity style={styles.circleButton} onPress={() => router.push('/Signup_Login')}>
                <Image 
                    source={require('../assets/images/icons/human_Icon.jpg')} 
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
