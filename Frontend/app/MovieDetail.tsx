import React, { useEffect, useState } from 'react';
import { Image, StyleSheet, View, Text, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import Footer from '@/components/footer';
import CircularProgress from 'react-native-circular-progress-indicator';
import axios from 'axios';
import { useRouter, useLocalSearchParams } from 'expo-router';

const API_BASE_URL = 'http://192.168.32.196:5000';

const images: { [key: string]: any } = {
  'Joker': require('../assets/images/Joker.jpeg'),
  'WildRobot': require('../assets/images/WildRobot.png'),
  'ItEndsWithUs': require('../assets/images/ItEndsWithUs.png'),
  'splash': require('../assets/images/splash.png'),
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

// Update the showtime type to include availableSeats
type Showtime = {
  _id: string;
  showtime: string;
  hallId: {
    _id: string;
    name: string;
    seats: string[][];
  };
};


const getTodayDate = (): string => {
  const today = new Date();
  const year = today.getFullYear();
  const month = (today.getMonth() + 1).toString().padStart(2, '0');
  const day = today.getDate().toString().padStart(2, '0');
  return `${day}.${month}.${year}`;
};

export default function MovieDetail() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const movieId = params.id as string;

  const [movie, setMovie] = useState<any>(null);
  const [showtimes, setShowtimes] = useState<Showtime[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const todayDate = getTodayDate();

  
  const calculateSeats = (seats: string[][]) => {
    const totalSeats = seats.flat().length;
    const availableSeats = seats.flat().filter(seat => seat === 'free').length;
    return { totalSeats, availableSeats };
  };
  

  useEffect(() => {
    const fetchMovieDetailsAndShowtimes = async () => {
      try {
        const [movieResponse, showtimesResponse] = await Promise.all([
          axios.get(`${API_BASE_URL}/api/movies/movies/${movieId}`),
          axios.get(`${API_BASE_URL}/api/movies/movies/${movieId}/showtimes`)
        ]);
        
        setMovie(movieResponse.data);
        // console.log('Showtimes response:', JSON.stringify(showtimesResponse.data, null, 2));
        setShowtimes(showtimesResponse.data);
      } catch (error) {
        console.error('Error fetching movie details and showtimes:', error);
        setError('Failed to load movie details and showtimes. Please try again.');
      } finally {
        setLoading(false);
      }
    };
  
    fetchMovieDetailsAndShowtimes();
  }, [movieId]);

  const handleShowtimeSelect = (showtime: string, hallId: string) => {
    router.push({
      pathname: '/seatSelection',
      params: { 
        movieId, 
        showtime: new Date(showtime).toISOString(),
        hallId 
      }
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
          <InfoRow label="Distributor" value={movie.distributor || 'N/A'} />
          <InfoRow label="Duration" value={movie.duration || 'N/A'} />
          <InfoRow label="Genre" value={movie.genre || 'N/A'} />
          <InfoRow label="Director" value={movie.director || 'N/A'} />
          <InfoRow label="In the main roles" value={movie.roles ? movie.roles.join(', ') : 'N/A'} />
          <InfoRow label="Description" value={movie.description || movie.discription || 'No description available'} />
        </View>

        <Text style={styles.showtimesTitle}>Select Showtime:</Text>
        {showtimes.map((showtime, index) => {
          const { totalSeats, availableSeats } = calculateSeats(showtime.hallId.seats);

          // console.log(`Showtime ${index}:`, { 
          //   availableSeats, 
          //   totalSeats
          // });

          return (
            <TouchableOpacity 
              key={index} 
              style={styles.ticketContainer}
              onPress={() => handleShowtimeSelect(showtime.showtime, showtime.hallId._id)}
            >
              <View style={styles.ticketdetails}>
                <Text style={styles.time}>
                  {new Date(showtime.showtime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                </Text>
                <View style={styles.dateContent}>
                  <Text style={styles.date}>{todayDate}</Text>
                  <Text style={styles.hall}>{`CinemaGo, ${showtime.hallId.name}`}</Text>
                </View>
              </View>
              <View style={styles.vacacyContainer}>
                <Text style={styles.language}>{`2D | ${movie.language}`}</Text>
                <View style={styles.progressContainer}>
                <CircularProgress
                  value={availableSeats}
                  radius={25}
                  duration={2000}
                  progressValueColor={'#000'}
                  maxValue={totalSeats}
                  title={'Seats'}
                  titleColor={'#000'}
                  titleStyle={{ fontSize: 8, marginTop: -10 }} // Reduce space between title and number
                  activeStrokeColor={'#2ecc71'}
                  inActiveStrokeColor={'#e74c3c'}
                />
                  <View style={styles.vacancyContent}>
                    <Text style={styles.vacancyText}>Available Seats</Text>
                    <Text style={styles.seats}>{`${availableSeats}/${totalSeats}`}</Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          );
        })}
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
    backgroundColor: '#000',
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
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 5,
    
  },
  infoLabel: {
    fontWeight: 'bold',
    color: '#fff',
    width: 100,
  },
  infoText: {
    color: '#b2b2b2',
    flex: 1,
  },
  showtimesTitle: {
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
    marginBottom: 10,
  },
  time: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1b293a',
  },
  dateContent: {
    alignItems: 'flex-end',
  },
  date: {
    fontSize: 16,
    color: '#666',
    marginBottom: 4,
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
    justifyContent: 'flex-end',
  },
  vacancyContent: {
    marginLeft: 10,
    alignItems: 'flex-end',
  },
  vacancyText: {
    fontSize: 12,
    color: '#666',
  },
  seats: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1b293a',
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