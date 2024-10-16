import React, { useState, useEffect } from 'react';
import { Image, StyleSheet, Platform, View, ScrollView, Text, TouchableOpacity } from 'react-native';
import Svg, { G, Path } from 'react-native-svg';
import { useRouter } from 'expo-router';
import Footer from '../../components/footer';
import axios from 'axios';

const images: { [key: string]: any } = {
  'Joker': require('../../assets/images/Joker.jpeg'),
  'WildRobot': require('../../assets/images/WildRobot.png'),
  'ItEndsWithUs': require('../../assets/images/ItEndsWithUs.png'),
  'splash': require('../../assets/images/splash.png'),
};

const getImageSource = (imageName: string): any => {
  // Remove the file extension from the imageName if it exists
  const baseName = imageName.split('.')[0];
  
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

const API_BASE_URL = 'http://192.168.32.196:5000';

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
            setMovies(response.data.movies);  // Set only the movies array to state
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
      params: { id: movieId }
    });
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        {movies.map((movie) => (
          <View key={movie._id} style={styles.movieContainer}>
            <View>
              <Image
                source={getImageSource(movie.imageName)}
                style={styles.image}
                resizeMode="cover"
              />
            </View>
            <View style={styles.content}>
              <View>
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
              <Text style={styles.buttonText}>Explore and buy</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>
      <Footer />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container:{
    flexGrow: 1,
    justifyContent: 'center',  
    alignItems: 'center',
  },
  movieContainer:{
    backgroundColor:'#fff',
    width: '89%',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 30,
  },
  content: {
    width:'100%',
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#898a8c',
    marginBottom: 30,
  },
  image: {
    width: 350,
    height: 300
  },
  button: {
    padding: 10,
    alignItems: 'center',
    backgroundColor:'#163d71',
    borderRadius: 5,
    marginBottom: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 20,  
    fontWeight: 'bold',
  },
  title :{
    fontSize: 25,
    fontWeight: '700',
    color: '#163d71',
    marginBottom: 10,
  },
  day: {
    fontSize: 22,
    color:'#1b293a',
    marginBottom: 10,
  },
  iconContainer:{
    flexDirection: 'row',
    marginBottom: 10,
  },
  subtitle:{
    flexDirection: 'row',
    backgroundColor:'#dfe3eb',
    padding: 10,
    borderRadius: 20,
    alignItems: 'center',
    marginRight: 10,
    gap: 10
  },
  lang:{
    flexDirection: 'row',
    backgroundColor:'#dfe3eb',
    padding: 10,
    borderRadius: 20,
    alignItems: 'center',
    gap:5
  },
  age:{
    fontSize: 25,
    fontWeight: '600',
    color:'#fff',
    backgroundColor: '#1b293a',
    borderRadius: 10,
    width:30,
    marginLeft: 10,
    paddingTop: 3
  }
});