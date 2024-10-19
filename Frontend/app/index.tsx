import React, { useEffect, useState } from 'react';
import { Image, StyleSheet, View, ScrollView, Text, TouchableOpacity } from 'react-native';
import Svg, { G, Path } from 'react-native-svg';
import { useRouter } from 'expo-router';
import * as FileSystem from 'expo-file-system';
import Footer from '../components/footer';
import axios from 'axios';

// Define the type for user data
interface UserData {
    email?: string;
    firstName?: string;
    avatar?: string | number;
}

const API_BASE_URL = 'http://192.168.0.12:5000';

const images: { [key: string]: any } = {
    'Joker': require('../assets/images/Joker.jpeg'),
    'WildRobot': require('../assets/images/WildRobot.png'),
    'ItEndsWithUs': require('../assets/images/ItEndsWithUs.png'),
    'splash': require('../assets/images/splash.png'),
};

const avatarOptions = [
    require('../assets/images/avatars/avatar1.jpg'),
    require('../assets/images/avatars/avatar2.jpg'),
    require('../assets/images/avatars/avatar3.jpg'),
    require('../assets/images/avatars/avatar4.jpg'),
];

const getImageSource = (imageName: string): any => {
    const baseName = imageName.split('.')[0]; // Remove file extension

    if (images[baseName]) {
        return images[baseName];
    } else {
        console.warn(`Image not found: ${imageName}`);
        return images['splash'];
    }
};

const getTodayDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = (today.getMonth() + 1).toString().padStart(2, '0');
    const day = today.getDate().toString().padStart(2, '0');
    return `TODAY ${day}.${month}`;
};

export interface Movie {
    _id: string;
    name: string;
    premiere: string;
    distributor: string;
    roles: string[];
    language: string;
    cc: string;
    age: number;
    imageName: string;
    duration: string;
    director: string;
    genre: string;
    description: string;
}

export default function HomeScreen() {
    const router = useRouter();
    const [movies, setMovies] = useState<Movie[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [firstName, setFirstName] = useState<string | null>(null);
    const [avatar, setAvatar] = useState<number | null>(null);
    const [error, setError] = useState<string | null>(null);
    const todayDate = getTodayDate();

    const filePath = `${FileSystem.documentDirectory}userData.json`;

    useEffect(() => {
        const fetchMovies = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/api/movies/movies`);
                setMovies(response.data.movies);
            } catch (error) {
                console.error('Error fetching movies:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchMovies();
        loadUserDataFromFile();
    }, []);

    const fetchUserData = async (email: string) => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/auth/user?email=${email}`);
            const userData: UserData = await response.json();
            if (response.ok && userData) {
                setFirstName(userData.firstName || null);
            } else {
                setError('Unable to fetch user data.');
            }
        } catch (error) {
            console.error('Error fetching user data:', error);
            setError('Error fetching user data.');
        }
    };

    const loadUserDataFromFile = async () => {
      try {
          const fileInfo = await FileSystem.getInfoAsync(filePath);
          if (!fileInfo.exists) {
              console.log('User data file does not exist.');
              setLoading(false);
              return;
          }
  
          const fileContent = await FileSystem.readAsStringAsync(filePath);
          const userData: UserData = JSON.parse(fileContent);
  
          const avatarNumber = userData.avatar;
          const email = userData.email;
  
          console.log("User data loaded:", userData);  // Log the loaded user data
          console.log("Email:", email);  // Log the email
  
          if (email) {
              await fetchUserData(email);
          } else {
              setError('No email found in user data.');
              setLoading(false);
          }
  
          // If avatar number is valid, update the avatar state
          if (typeof avatarNumber === 'number' && avatarNumber >= 26) {
            setAvatar(avatarNumber - 26);  // Adjust avatar range if needed
            console.log("Updated Avatar:", avatarNumber - 26);  // Log the updated avatar state
        } else {
            setAvatar(null);  // If avatar is not valid, set it to null
            console.log("Invalid Avatar: null");
        }
      } catch (error) {
          console.error('Error loading user data from file:', error);
          setError('Error loading user data from file.');
      }
  };
  

    const handleMoviePress = (movieId: string) => {
        router.push({
            pathname: '/MovieDetail',
            params: { id: movieId },
        });
    };



    return (
        <ScrollView contentContainerStyle={styles.scrollView}>
            {/* Header for CinemaGo */}
            <View style={styles.header}>
                <Image source={require('../assets/images/CinemaGo10.jpg')} style={styles.headerImage} resizeMode="contain" />
                <TouchableOpacity style={styles.circleButton} onPress={() => router.push('/Signup_Login')}>
                {avatar !== null ? (
                      <Image source={avatarOptions[avatar]} style={styles.avatarStyle} />
                  ) : (
                      <Image source={require('../assets/images/icons/human_Icon.jpg')} style={styles.avatarStyle} />
                  )}  
                </TouchableOpacity>
                <Text style={[styles.headerText]}>
                    After his home is conquered by the tyrannical emperors who now lead Rome, Lucius is forced to enter the Colosseum and must look to his past to find strength to return the glory of Rome to its people
                </Text>
                <Text style={[styles.headerText2]}>Gladiator II Release Day: 15th October</Text>
            </View>

            <View style={styles.container}>
                {movies.map((movie) => (
                    <View key={movie._id} style={styles.movieContainer}>
                        <View style={styles.contentRow}>
                            <Image source={getImageSource(movie.imageName)} style={styles.movieImage} resizeMode="cover" />
                            <View style={styles.content}>
                                <Text style={[styles.title]}>{movie.name}</Text>
                                <Text style={[styles.day]}>{todayDate}</Text>
                                <View style={styles.iconContainer}>
                                    <View style={styles.subtitle}>
                                        <Svg
                                            fill="#13335d"
                                            width="20px"
                                            height="20px"
                                            viewBox="0 0 1920 1920"
                                            stroke="#13335d"
                                            strokeWidth={103.68}
                                        >
                                            <G>
                                                <Path d="M1920 1468.412v112.94H0v-112.94h1920Zm-677.647-338.824v112.941H677.647v-112.94h564.706Zm677.647-338.823v112.94H0v-112.94h1920Zm-677.647-338.824v112.941H677.647V451.94h564.706Zm677.647-338.823v112.94H0V113.118h1920Z" fillRule="evenodd" />
                                            </G>
                                        </Svg>
                                        <Text>{movie.cc}</Text>
                                    </View>
                                    <View style={styles.lang}>
                                    <Svg
                                      width="25px"
                                      height="25px"
                                      viewBox="0 0 24 24"
                                      fill="none"
                                      stroke="#112c50"
                                      strokeWidth={0.96}
                                    >
                                      <Path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
                                      <Path d="M2 12h20" />
                                      <Path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                                    </Svg>
                                        <Text>{movie.language}</Text>
                                    </View>
                                    <Text style={styles.age}>{movie.age}</Text>
                                </View>
                            </View>
                        </View>
                        <TouchableOpacity style={styles.viewDetailsButton} onPress={() => handleMoviePress(movie._id)}>
                            <Text style={styles.viewDetailsText}>Explore and Buy</Text>
                        </TouchableOpacity>
                    </View>
                ))}
            </View>

            <Footer />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    scrollView: {
        flexGrow: 1,
        backgroundColor: '#000',
    },
    header: {
        backgroundColor: '#000',
        alignItems: 'center',
        marginBottom: 20,
        padding: 10,
    },
    headerImage: {
      width: '100%', // Full width for a larger header image
      height: 600, // Increased height for prominence
    },
    headerText: {
      fontSize: 15, // Adjust font size for readability
      fontWeight: '400', // Normal weight for the text
      marginBottom: 15, 
      color: '#fff', // Color of the text
      paddingHorizontal: 20, // Horizontal padding for better layout
      textAlign: 'center', // Center align the text
    },
    headerText2: {
      fontSize: 20, // Adjust font size for readability
      fontWeight: 'bold', // Normal weight for the text
      color: '#fff', // Color of the text
      marginTop: 15, // Space above the text
      marginBottom: 20, 
      paddingHorizontal: 20, // Horizontal padding for better layout
      textAlign: 'center', // Center align the text
      
      },
    container: {
      flexGrow: 1,
      paddingVertical: 20,
      paddingHorizontal: 10,
      alignItems: 'center',
      backgroundColor: '#000', // Keep background for the rest of the app
    },
    movieContainer: {
      backgroundColor: '#fff',
      marginVertical: 10,
      borderRadius: 10,
      overflow: 'hidden',
      width: '95%',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 6,
      elevation: 3,
      padding: 15,
    },
    contentRow: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
    },
    image: {
      width: 120,
      height: 180,
      resizeMode: 'contain',
      backgroundColor: '#f0f0f0',
      borderRadius: 8,
    },
    movieImage: {
        width: 100,
        height: 150,
        borderRadius: 8,
    },
    content: {
      flex: 1,
      paddingLeft: 15,
      justifyContent: 'center',
      alignItems: 'center',
    },
    title: {
      fontSize: 22,
      fontWeight: 'bold',
      color: '#1c3d72',
      marginBottom: 6,
      textAlign: 'center',
    },
    day: {
      fontSize: 16,
      color: '#6b7b8a',
      marginBottom: 8,
      textAlign: 'center',
    },
    age: {
      fontSize: 14,
      fontWeight: '600',
      color: '#fff',
      backgroundColor: '#1b293a',
      paddingVertical: 4,
      paddingHorizontal: 8,
      borderRadius: 5,
      marginLeft: 10,
    },
    iconContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 12,
    },
    subtitle: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#eef3f8',
      padding: 6,
      borderRadius: 8,
      marginRight: 10,
    },
    subtitleText: {
      marginLeft: 5,
      fontSize: 14,
      color: '#1c3d72',
    },
    lang: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#eef3f8',
      padding: 6,
      borderRadius: 8,
      marginRight: 10,
    },
    button: {
      backgroundColor: '#163d71',
    paddingVertical: 15,
    paddingHorizontal: 94,
    borderRadius: 8,
    marginTop: 20,
    alignItems: 'center',
    alignSelf: 'center',
    },
    buttonText: {
      color: '#fff',
      fontSize: 18,
      fontWeight: 'bold',
    },
    avatarStyle: {
      width: 60, // Width of the avatar
      height: 60, // Height of the avatar
      borderRadius: 30, // Circle shape
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
    viewDetailsButton: {
      backgroundColor: '#13335d', // Button background color
      paddingVertical: 10, // Vertical padding
      paddingHorizontal: 20, // Horizontal padding
      borderRadius: 5, // Rounded corners
      marginTop: 15, // Space from the movie content
      alignItems: 'center', // Center align text inside the button
      justifyContent: 'center',
  },
  viewDetailsText: {
      color: 'white', // Text color
      fontSize: 16, // Text size
      fontWeight: 'bold', // Bold text for emphasis
  },
});
