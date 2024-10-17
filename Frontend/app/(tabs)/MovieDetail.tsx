import React, { useEffect, useState } from 'react';
import { Image, StyleSheet, View, Text, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import Footer from '@/components/footer';
import CircularProgress from 'react-native-circular-progress-indicator';
import axios from 'axios';
import { useRouter, useLocalSearchParams } from 'expo-router';

const API_BASE_URL = 'http://192.168.32.196:5000';

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

export default function MovieDetail() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const movieId = params.id as string;

  const [movie, setMovie] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/movies/movies/${movieId}`);
        console.log('API Response:', JSON.stringify(response.data, null, 2)); // Debug log
        setMovie(response.data);
      } catch (error) {
        console.error('Error fetching movie details:', error);
        setError('Failed to load movie details. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchMovieDetails();
  }, [movieId]);

  const handleShowtimeSelect = (showtime: string) => {
    router.push({
      pathname: '/seatSelection',
      params: { movieId, showtime }
    });
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (error || !movie) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>{error || 'Movie not found'}</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.scrollView}>
      <View style={styles.container}>
        <Image
          source={getImageSource(movie.imageName)}
          style={styles.image}
          resizeMode="cover"
        />
        <View style={styles.detailsContainer}>
          <Text style={styles.movieTitle}>{movie.name || 'No Title'}</Text>
          <InfoRow label="Premiere" value={movie.premiere ? new Date(movie.premiere).toLocaleDateString() : 'N/A'} />
          <InfoRow label="Distributor" value={movie.distributor || 'N/A'} />
          <InfoRow label="Duration" value={movie.duration || 'N/A'} />
          <InfoRow label="Genre" value={movie.genre || 'N/A'} />
          <InfoRow label="Director" value={movie.director || 'N/A'} />
          <InfoRow label="In the main roles" value={movie.roles ? movie.roles.join(', ') : 'N/A'} />
          <InfoRow label="Description" value={movie.description || movie.discription || 'No description available'} />
        </View>

        <Text style={styles.showtimesTitle}>Select Showtime:</Text>
        {movie.time.map((showtime: string, index: number) => (
          <TouchableOpacity 
            key={index} 
            style={styles.ticketContainer}
            onPress={() => handleShowtimeSelect(showtime)}
          >
            <View style={styles.ticketdetails}>
              <Text style={styles.time}>{showtime}</Text>
              <View style={styles.dateContent}>
                <Text style={styles.date}>{new Date().toDateString()}</Text>
                <Text style={styles.hall}>{`CinemaGo, ${movie.halls}`}</Text>
              </View>
            </View>
            <View style={styles.vacacyContainer}>
              <Text style={styles.language}>{`2D | ${movie.language}`}</Text>
              <View style={styles.progressContainer}>
                <CircularProgress
                  value={60}
                  radius={25}
                  duration={2000}
                  progressValueColor={'#ecf0f1'}
                />
                <View style={styles.vacancyContent}>
                  <Text style={styles.vacancyText}>Available Seats</Text>
                  <Text style={styles.seats}>50</Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </View>
      <Footer />
    </ScrollView>
  );
}

const InfoRow = ({ label, value }: { label: string; value: string }) => (
  <View style={styles.infoRow}>
    <Text style={styles.infoLabel}>{label}:</Text>
    <Text style={styles.infoText}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: '#1b293a',
  },
  container: {
    marginTop: 50,
    padding: 20,
  },
  image: {
    width: '100%',
    height: 520,
    resizeMode: 'cover',
    marginBottom: 20,
  },
  detailsContainer: {
    marginBottom: 20,
  },
  movieTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
    fontFamily: 'Times New Roman',
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 5,
    
  },
  infoLabel: {
    fontFamily: 'Times New Roman',
    fontWeight: 'bold',
    color: '#fff',
    width: 100,
  },
  infoText: {
    fontFamily: 'Times New Roman',
    color: '#b2b2b2',
    flex: 1,
  },
  showtimesTitle: {
    fontFamily: 'Times New Roman',
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  ticketContainer: {
    backgroundColor: '#fff',
    flexDirection: 'column',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  ticketdetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  time: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  dateContent: {
    alignItems: 'flex-end',
  },
  date: {
    fontSize: 16,
  },
  hall: {
    fontSize: 14,
    color: '#666',
  },
  vacacyContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  language: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  vacancyContent: {
    marginLeft: 10,
  },
  vacancyText: {
    fontSize: 12,
  },
  seats: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
  },
});