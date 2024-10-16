import React, { useState, useEffect } from 'react';
import { Image, StyleSheet, Platform, View,ScrollView, Text, TouchableOpacity } from 'react-native';
import Svg, { G, Path } from 'react-native-svg';
import axios from 'axios';
import { useRouter } from 'expo-router';
import Footer from '../../components/footer';

// const imageMap = {
//   'movie1': require('@/assets/images/ItEndWithUs.jpg'),
//   'movie2': require('@/assets/images/Joker.jpg'),
//   'movie3': require('@/assets/images/WildRobot.jpg'),
// };

const getTodayDate = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = (today.getMonth() + 1).toString().padStart(2, '0'); // Adding 1 since months are zero-indexed
  const day = today.getDate().toString().padStart(2, '0');
  return `TODAY ${day}.${month}`;
};


export default function HomeScreen() {
  const router = useRouter();
  const [movies, setMovies] = useState<any[]>([]); 
    const [loading, setLoading] = useState<boolean>(true);
    const todayDate = getTodayDate(); // Get today's date


useEffect(() => {
  const fetchMovies = async () => {
    try {
      const response = await fetch('http://192.168.0.103:5000/api/movies/movies');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();  
      setMovies(data);
    } catch (error) {
      console.error('Error fetching movies:', error);
      setLoading(false);
    }
  };

  fetchMovies();
}, []);



  return (
    <ScrollView>

    <View style = {styles.container}> 
      {/* <Image
          source={require('@/assets/images/partial-react-logo.png')}
        /> */}

{movies.map((movie, index) => (
          <View key={index} style={styles.movieContainer}>
            {/* Movie Poster */}
            <View>
              {/* <Image
                source={imageMap[movie.imageName]}
                style={styles.image}
              /> */}
              <Image
                source={require('@/assets/images/ItEndWithUs.jpg')}
                style={styles.image}
              />
            </View>

            {/* Movie Content */}
            <View style={styles.content}>
              <View>
                {/* Movie Title */}
                <Text style={styles.title}>{movie.name}</Text>

                {/* Show Date */}
                <Text style={styles.day}>{todayDate}</Text>

                {/* Show Time and Vacancy */}
                {/* <View style={styles.timeContent}>
                  <Text style={styles.time}>{movie.time}</Text>
                  <Text style={styles.vacancy}>Vaccant</Text>
                </View> */}

                {/* Icons (Language and Subtitle) */}
                <View style={styles.iconContainer}>
                  {/* Subtitle Icon */}
                  <View style={styles.subtitle}>
                    <Svg
                      fill="#13335d"
                      width="20px"
                      height="20px"
                      viewBox="0 0 1920 1920"
                      stroke="#13335d"
                      strokeWidth={103.68}
                    >
                      <G fillRule="evenodd" clipRule="evenodd">
                        <Path d="M320 1221.33c0-32.4 26.266-58.66 58.667-58.66h736.003c32.4 0 58.66 26.26 58.66 58.66 0 32.4-26.26 58.67-58.66 58.67H378.667c-32.401 0-58.667-26.27-58.667-58.67zm1066.67 0c0-32.4 26.26-58.66 58.66-58.66h96c32.4 0 58.67 26.26 58.67 58.66 0 32.4-26.27 58.67-58.67 58.67h-96c-32.4 0-58.66-26.27-58.66-58.67zm-581.337 261.34c-32.4 0-58.666 26.26-58.666 58.66 0 32.4 26.266 58.67 58.666 58.67h735.997c32.4 0 58.67-26.27 58.67-58.67 0-32.4-26.27-58.66-58.67-58.66H805.333zM320 1541.33c0-32.4 26.266-58.66 58.667-58.66h96c32.4 0 58.666 26.26 58.666 58.66 0 32.4-26.266 58.67-58.666 58.67h-96c-32.401 0-58.667-26.27-58.667-58.67z" />
                        <Path d="M0 213.333C0 95.513 95.513 0 213.333 0H1706.67C1824.49 0 1920 95.513 1920 213.333V1706.67c0 117.82-95.51 213.33-213.33 213.33H213.333C95.513 1920 0 1824.49 0 1706.67V213.333Zm213.333-96H1706.67c53.02 0 96 42.981 96 96V1706.67c0 53.02-42.98 96-96 96H213.333c-53.019 0-96-42.98-96-96V213.333c0-53.019 42.981-96 96-96Z" />
                      </G>
                    </Svg>
                    <Text>{movie.cc}</Text>
                  </View>

                  {/* Language Icon */}
                  <View style={styles.lang}>
                    <Svg
                      width="25px"
                      height="25px"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#112c50"
                      strokeWidth={0.96}
                    >
                      <G>
                        <Path d="M2.00299 11.7155C2.04033 9.87326 2.059 8.95215 2.67093 8.16363C2.78262 8.0197 2.9465 7.8487 3.08385 7.73274C3.83639 7.09741 4.82995 7.09741 6.81706 7.09741C7.527 7.09741 7.88197 7.09741 8.22035 7.00452C8.29067 6.98522 8.36024 6.96296 8.4289 6.93781C8.75936 6.81674 9.05574 6.60837 9.64851 6.19161C11.9872 4.54738 13.1565 3.72527 14.138 4.08241C14.3261 4.15088 14.5083 4.24972 14.671 4.37162C15.5194 5.00744 15.5839 6.48675 15.7128 9.44537C15.7606 10.5409 15.7931 11.4785 15.7931 12C15.7931 12.5215 15.7606 13.4591 15.7128 14.5546C15.5839 17.5132 15.5194 18.9926 14.671 19.6284C14.5083 19.7503 14.3261 19.8491 14.138 19.9176C13.1565 20.2747 11.9872 19.4526 9.64851 17.8084C9.05574 17.3916 8.75936 17.1833 8.4289 17.0622C8.36024 17.037 8.29067 17.0148 8.22035 16.9955C7.88197 16.9026 7.527 16.9026 6.81706 16.9026C4.82995 16.9026 3.83639 16.9026 3.08385 16.2673C2.9465 16.1513 2.78262 15.9803 2.67093 15.8364C2.059 15.0478 2.04033 14.1267 2.00299 12.2845C2.00103 12.1878 2 12.0928 2 12C2 11.9072 2.00103 11.8122 2.00299 11.7155Z" fill="#1C274C" />
                        <Path d="M19.4895 5.55219C19.7821 5.29218 20.217 5.33434 20.477 5.62688C20.7094 5.88783 21.0665 6.47974 21.3629 7.28692C21.6451 8.05881 21.892 9.04278 21.892 10.25C21.892 11.4572 21.6451 12.4412 21.3629 13.2131C21.0665 14.0203 20.7094 14.6122 20.477 14.8731C20.217 15.1657 19.7821 15.2078 19.4895 14.9478C19.197 14.6878 19.1548 14.2529 19.4148 13.9604C19.5057 13.8554 19.7562 13.5115 20.0085 12.8483C20.2396 12.2398 20.392 11.4572 20.392 10.25C20.392 9.04278 20.2396 8.26024 20.0085 7.65173C19.7562 6.98848 19.5057 6.64461 19.4148 6.53958C19.1548 6.24704 19.197 5.81219 19.4895 5.55219Z" fill="#1C274C" />
                      </G>
                    </Svg>
                    <Text>{movie.language}</Text>
                  </View>
                  <Text style={styles.age}>{movie.age}</Text>
                </View>
              </View>
              
            </View>
            <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText} 
             onPress={() => router.push({ pathname: './MovieDetail', params: { movie: movies } })}
            >Explore and buy</Text>
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
    // borderWidth: 1,
    // borderColor: '#898a8c',
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
  buttoncontainer: {
    width: '100%',
    borderRadius: 5,
   
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
  time:{
    fontSize: 22,
    fontWeight: '500',
    flexDirection: 'row',
    marginBottom: 10,
  },
  timeContent:{
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    
  },
  vacancy: {
    fontSize: 18,
    color:'#1b293a',
    alignItems: 'center',
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
