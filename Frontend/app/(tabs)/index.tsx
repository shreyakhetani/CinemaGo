import React, { useState, useEffect } from 'react';
import { Image, StyleSheet, Platform, View,ScrollView, Text, TouchableOpacity } from 'react-native';
import Svg, { G, Path } from 'react-native-svg';
import axios from 'axios';
import { useRouter } from 'expo-router';
import Footer from '../../components/footer';


export default function HomeScreen() {
  const router = useRouter();
  const [movies, setMovies] = useState([]);

useEffect(() => {
  axios
    .get(`http://192.168.0.103:5000/api/movies/movies`)
    .then((response) => {
      setMovies(response.data);
    })
    .catch((error) => {
      console.error('Error fetching movie data:', error);
    });
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
              <Image
                source={require('@/assets/images/'+{index.imageName}+'.png')} // Use the correct key for the movie image from API
                style={styles.image}
              />
            </View>

            {/* Movie Content */}
            <View style={styles.content}>
              <View>
                {/* Movie Title */}
                <Text style={styles.title}>{movie.name}</Text>

                {/* Show Date */}
                <Text style={styles.day}>{movie.premiere}</Text>

                {/* Show Time and Vacancy */}
                <View style={styles.timeContent}>
                  <Text style={styles.time}>{movie.time}</Text>
                  <Text style={styles.vacancy}>Vaccant</Text>
                </View>

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
                </View>
              </View>
              <TouchableOpacity >
                <Text style={styles.buttonText}>BOOK</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
        {/* <View style = {styles.movieContainer}>
          
          <View >
            <Image
          source={require('@/assets/images/ItEndWithUs.jpg')}
            style={styles.image}/>
          </View>
          <View style= {styles.content}>
            <View>
              <Text style= {styles.title}>It ends with us</Text>
              <Text style= {styles.day}>Today 9/10</Text>
              <View style= {styles.timeContent}>
              <Text style= {styles.time}>15:15</Text>
              <Text style= {styles.vacancy}>VACANCY</Text>
              </View>
              
              <View style= {styles.iconContainer}>
                <View style= {styles.subtitle}>
                <Svg
                  fill="#13335d"
                  width="20px" 
                  height="20px"
                  viewBox="0 0 1920 1920"
                  // xmlns="http://www.w3.org/2000/svg"
                  stroke="#13335d"
                  strokeWidth={103.68}
                >
                  <G fillRule="evenodd" clipRule="evenodd">
                    <Path d="M320 1221.33c0-32.4 26.266-58.66 58.667-58.66h736.003c32.4 0 58.66 26.26 58.66 58.66 0 32.4-26.26 58.67-58.66 58.67H378.667c-32.401 0-58.667-26.27-58.667-58.67zm1066.67 0c0-32.4 26.26-58.66 58.66-58.66h96c32.4 0 58.67 26.26 58.67 58.66 0 32.4-26.27 58.67-58.67 58.67h-96c-32.4 0-58.66-26.27-58.66-58.67zm-581.337 261.34c-32.4 0-58.666 26.26-58.666 58.66 0 32.4 26.266 58.67 58.666 58.67h735.997c32.4 0 58.67-26.27 58.67-58.67 0-32.4-26.27-58.66-58.67-58.66H805.333zM320 1541.33c0-32.4 26.266-58.66 58.667-58.66h96c32.4 0 58.666 26.26 58.666 58.66 0 32.4-26.266 58.67-58.666 58.67h-96c-32.401 0-58.667-26.27-58.667-58.67z" />
                    <Path d="M0 213.333C0 95.513 95.513 0 213.333 0H1706.67C1824.49 0 1920 95.513 1920 213.333V1706.67c0 117.82-95.51 213.33-213.33 213.33H213.333C95.513 1920 0 1824.49 0 1706.67V213.333Zm213.333-96H1706.67c53.02 0 96 42.981 96 96V1706.67c0 53.02-42.98 96-96 96H213.333c-53.019 0-96-42.98-96-96V213.333c0-53.019 42.981-96 96-96Z" />
                  </G>
                </Svg>
                <Text>FI&SV</Text>
                </View>
                <View style= {styles.lang}>
                <Svg
                  width="25px"
                  height="25px" 
                  viewBox="0 0 24 24"
                  fill="none"
                  // xmlns="http://www.w3.org/2000/svg"
                  stroke="#112c50"
                  strokeWidth={0.96}
                >
                  <G>
                    <Path
                      d="M2.00299 11.7155C2.04033 9.87326 2.059 8.95215 2.67093 8.16363C2.78262 8.0197 2.9465 7.8487 3.08385 7.73274C3.83639 7.09741 4.82995 7.09741 6.81706 7.09741C7.527 7.09741 7.88197 7.09741 8.22035 7.00452C8.29067 6.98522 8.36024 6.96296 8.4289 6.93781C8.75936 6.81674 9.05574 6.60837 9.64851 6.19161C11.9872 4.54738 13.1565 3.72527 14.138 4.08241C14.3261 4.15088 14.5083 4.24972 14.671 4.37162C15.5194 5.00744 15.5839 6.48675 15.7128 9.44537C15.7606 10.5409 15.7931 11.4785 15.7931 12C15.7931 12.5215 15.7606 13.4591 15.7128 14.5546C15.5839 17.5132 15.5194 18.9926 14.671 19.6284C14.5083 19.7503 14.3261 19.8491 14.138 19.9176C13.1565 20.2747 11.9872 19.4526 9.64851 17.8084C9.05574 17.3916 8.75936 17.1833 8.4289 17.0622C8.36024 17.037 8.29067 17.0148 8.22035 16.9955C7.88197 16.9026 7.527 16.9026 6.81706 16.9026C4.82995 16.9026 3.83639 16.9026 3.08385 16.2673C2.9465 16.1513 2.78262 15.9803 2.67093 15.8364C2.059 15.0478 2.04033 14.1267 2.00299 12.2845C2.00103 12.1878 2 12.0928 2 12C2 11.9072 2.00103 11.8122 2.00299 11.7155Z"
                      fill="#1C274C"
                    />
                    <Path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M19.4895 5.55219C19.7821 5.29218 20.217 5.33434 20.4608 5.64635L19.931 6.11713C20.4608 5.64635 20.4606 5.64602 20.4608 5.64635L20.4619 5.6477L20.4631 5.64921L20.4658 5.65275L20.4727 5.66184C20.4779 5.6688 20.4844 5.67756 20.4921 5.68814C20.5075 5.70929 20.5275 5.73772 20.5515 5.77358C20.5995 5.84529 20.6635 5.94667 20.7379 6.07889C20.8868 6.34345 21.077 6.73092 21.2644 7.25038C21.6397 8.29107 22 9.85136 22 12.0002C22 14.1491 21.6397 15.7094 21.2644 16.7501C21.077 17.2695 20.8868 17.657 20.7379 17.9216C20.6635 18.0538 20.5995 18.1552 20.5515 18.2269C20.5275 18.2627 20.5075 18.2912 20.4921 18.3123C20.4844 18.3229 20.4779 18.3317 20.4727 18.3386L20.4658 18.3477L20.4631 18.3513L20.4619 18.3528C20.4616 18.3531 20.4608 18.3541 19.931 17.8833L20.4608 18.3541C20.217 18.6661 19.7821 18.7083 19.4895 18.4483C19.1983 18.1895 19.1578 17.729 19.3977 17.417C19.3983 17.4163 19.3994 17.4148 19.4009 17.4127C19.4058 17.406 19.4154 17.3925 19.4291 17.372C19.4565 17.3311 19.5003 17.2625 19.5552 17.1649C19.6649 16.9698 19.8195 16.6587 19.977 16.2221C20.2913 15.3508 20.6207 13.9695 20.6207 12.0002C20.6207 10.0309 20.2913 8.64968 19.977 7.77836C19.8195 7.34181 19.6649 7.03066 19.5552 6.8356C19.5003 6.73802 19.4565 6.66934 19.4291 6.62845C19.4154 6.608 19.4058 6.59449 19.4009 6.58778C19.3994 6.58561 19.3983 6.58416 19.3977 6.5834C19.3977 6.5834 19.3977 6.58341 19.3977 6.5834"
                      fill="#1C274C"
                    />
                    <Path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M17.7571 8.41595C18.0901 8.21871 18.51 8.34663 18.6949 8.70166L18.0921 9.0588C18.6949 8.70166 18.6948 8.70134 18.6949 8.70166L18.6956 8.70295L18.6963 8.70432L18.6978 8.7073L18.7014 8.71428L18.7102 8.73227C18.7169 8.74607 18.7251 8.76348 18.7345 8.78457C18.7533 8.82676 18.7772 8.88363 18.8042 8.95574C18.8584 9.10004 18.9251 9.3049 18.99 9.57476C19.1199 10.115 19.2415 10.9119 19.2415 12.0003C19.2415 13.0888 19.1199 13.8857 18.99 14.4259C18.9251 14.6958 18.8584 14.9007 18.8042 15.045C18.7772 15.1171 18.7533 15.1739 18.7345 15.2161C18.7251 15.2372 18.7169 15.2546 18.7102 15.2684L18.7014 15.2864L18.6978 15.2934L18.6963 15.2964L18.6956 15.2978C18.6954 15.2981 18.6949 15.299 18.0921 14.9419L18.6949 15.299C18.51 15.6541 18.0901 15.782 17.7571 15.5847C17.427 15.3892 17.3063 14.9474 17.4846 14.5938L17.4892 14.5838C17.4955 14.5697 17.5075 14.5415 17.5236 14.4987C17.5557 14.4132 17.6039 14.2688 17.6539 14.0606C17.7539 13.6448 17.8622 12.9709 17.8622 12.0003C17.8622 11.0298 17.7539 10.3559 17.6539 9.94007C17.6039 9.73193 17.5557 9.58748 17.5236 9.50197C17.5075 9.45918 17.4955 9.43102 17.4892 9.41691L17.4846 9.40687C17.3063 9.05332 17.427 8.61152 17.7571 8.41595Z"
                      fill="#1C274C"
                    />
                  </G>
                </Svg>
                <Text>EN</Text>
                </View>
              </View>
            </View>
          </View>
          <View style= {styles.buttoncontainer}>

          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Explore and buy</Text>
          </TouchableOpacity>
            </View>
        </View> */}
        
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
    borderRadius: 5
  },
  button: {
    padding: 10,
    alignItems: 'center',
    backgroundColor:'#163d71',
    borderRadius: 5,
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
  }
  
});
