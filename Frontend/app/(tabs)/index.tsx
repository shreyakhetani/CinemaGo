import React, { useState, useEffect } from 'react';
import { Image, StyleSheet, View, ScrollView, Text, TouchableOpacity } from 'react-native';
import Svg, { G, Path } from 'react-native-svg';
import { useRouter } from 'expo-router';
import Footer from '../../components/footer';
import axios from 'axios';

const API_BASE_URL = 'http://192.168.32.196:5000';

const images: { [key: string]: any } = {
  'Joker': require('../../assets/images/Joker.jpeg'),
  'WildRobot': require('../../assets/images/WildRobot.png'),
  'ItEndsWithUs': require('../../assets/images/ItEndsWithUs.png'),
  'splash': require('../../assets/images/splash.png'),
};

const getImageSource = (imageName: string): any => {
  const baseName = imageName.split('.')[0]; // Remove file extension

  if (images[baseName]) {
    return images[baseName];
  } else {
    console.warn(`Image not found: ${imageName}`);
    return images['splash'];
  }
};

export interface Movie {
  _id: string;
  name: string;
  premiere: string;
  distributor: string;
  roles: string[];
  halls: string;
  time: string[];
  language: string;
  cc: string;
  age: number;
  imageName: string;
  duration: string;
  director: string;
  genre: string;
  description: string;
  description1: string;
}

const getTodayDate = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = (today.getMonth() + 1).toString().padStart(2, '0');
  const day = today.getDate().toString().padStart(2, '0');
  return `TODAY ${day}.${month}`;
};

export default function HomeScreen() {
  const router = useRouter();
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const todayDate = getTodayDate();

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/movies/movies`);
        console.log('API Response:', response.data);
        setMovies(response.data.movies);
      } catch (error) {
        console.error('Error fetching movies:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchMovies();
  }, []);

  const handleMoviePress = (movieId: string) => {
    router.push({
      pathname: '/MovieDetail',
      params: { id: movieId },
    });
  };

  return (
    <ScrollView>
      {/* Header for CinemaGo */}
      <View style={styles.header}>
        <Image
          source={require('../../assets/images/CinemaGo10.jpg')}
          style={styles.headerImage}
          resizeMode="contain"
        />
        <Text style={styles.headerText}>
          After his home is conquered by the tyrannical emperors who now lead Rome, Lucius is forced to enter the Colosseum and must look to his past to find strength to return the glory of Rome to its people
        </Text>
        <Text style={styles.headerText2}>
        Gladiator II Release Day: 15th October
        </Text>
      </View>

      <View style={styles.container}>
        {movies.map((movie) => (
          <View key={movie._id} style={styles.movieContainer}>
            <View style={styles.contentRow}>
              <Image
                source={getImageSource(movie.imageName)}
                style={styles.image}
                resizeMode="contain"
              />
              <View style={styles.content}>
                <Text style={styles.title}>{movie.name}</Text>
                <Text style={styles.day}>{todayDate}</Text>
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
            <TouchableOpacity
              style={styles.button}
              onPress={() => handleMoviePress(movie._id)}
            >
              <Text style={styles.buttonText}>Explore and Buy</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>
      <Footer />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  header: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerImage: {
    width: '100%', // Full width for a larger header image
    height: 600, // Increased height for prominence
    marginTop: 30, // Space above the text
  },
  headerText: {
    fontFamily: 'Georgia',
    fontSize: 15, // Adjust font size for readability
    fontWeight: '400', // Normal weight for the text
    marginBottom: 15, 
    color: '#fff', // Color of the text
    paddingHorizontal: 20, // Horizontal padding for better layout
    textAlign: 'center', // Center align the text
  },
  headerText2: {
    fontFamily: 'Georgia',
    fontSize: 17, // Adjust font size for readability
    fontWeight: '500', // Normal weight for the text
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
  content: {
    flex: 1,
    paddingLeft: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontFamily: 'Times New Roman',
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1c3d72',
    marginBottom: 6,
    textAlign: 'center',
  },
  day: {
    fontFamily: 'Times New Roman',
    fontSize: 16,
    color: '#6b7b8a',
    marginBottom: 8,
    textAlign: 'center',
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
    fontFamily: 'Times New Roman',
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
