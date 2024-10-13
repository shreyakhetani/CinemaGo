import Ionicons from '@expo/vector-icons/Ionicons';
import { Image, StyleSheet, View, Text, TouchableOpacity, ScrollView } from 'react-native';
import Footer from '@/components/footer';
import { useRouter } from 'expo-router';
import CircularProgress from 'react-native-circular-progress-indicator';

export default function MovieDetail() {
  const router = useRouter();

  return (
    <ScrollView>
      <View style={styles.container}>
        <Image
          source={require('@/assets/images/ItEndsWithUs1.jpg')}
          style={styles.image}
        />

        <View style={styles.textContainer}>
          <View style={styles.content}>
            <View>
              <Text style={styles.title}>Premiere</Text>
              <Text style={styles.text}>7/8/2024</Text>
            </View>
            <View>
              <Text style={styles.title}>Distributor</Text>
              <Text style={styles.text}>SF Studios Oy</Text>
            </View>
          </View>
          <View>
            <Text style={styles.title}>In the main roles</Text>
            <Text style={styles.text}>
              Jenny Slate, Justin Baldoni, Hasan Minhaj, Blake Lively, Amy Morton
            </Text>
          </View>
        </View>
        <TouchableOpacity style={styles.ticketContainer} >
          <View style={styles.ticketdetails}>
              <Text style={styles.time}>19:30</Text>
            <View style={styles.dateContent}>
              <Text style={styles.date}>Sunday 13.10</Text>
              <Text style={styles.hall}>CinemaGo, Hall 5</Text>
            </View>
          </View>
          <View style={styles.vacacyContainer}>
              <Text style={styles.language}>2D | English</Text>
            <View style={styles.progressContainer}>
            <View>
            <CircularProgress
                value={60}
                radius={25}
                duration={2000}
                progressValueColor={'#ecf0f1'}
                // maxValue={200}
                // titleColor={''}
                // titleStyle={{fontWeight: 'bold'}}
              />
              </View>
              <View style={styles.vacancyContent}>
              <Text style={styles.vacancyText}>Available Seats</Text>
              <Text style={styles.seats}>50</Text>
              </View>
            </View>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.ticketContainer} >
          <View style={styles.ticketdetails}>
              <Text style={styles.time}>19:30</Text>
            <View style={styles.dateContent}>
              <Text style={styles.date}>Sunday 13.10</Text>
              <Text style={styles.hall}>CinemaGo, Hall 5</Text>
            </View>
          </View>
          <View style={styles.vacacyContainer}>
              <Text style={styles.language}>2D | English</Text>
            <View style={styles.progressContainer}>
            <View>
            <CircularProgress
                value={60}
                radius={25}
                duration={2000}
                progressValueColor={'#ecf0f1'}
                // maxValue={200}
                // titleColor={''}
                // titleStyle={{fontWeight: 'bold'}}
              />
              </View>
              <View style={styles.vacancyContent}>
              <Text style={styles.vacancyText}>Available Seats</Text>
              <Text style={styles.seats}>50</Text>
              </View>
            </View>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.ticketContainer} >
          <View style={styles.ticketdetails}>
              <Text style={styles.time}>19:30</Text>
            <View style={styles.dateContent}>
              <Text style={styles.date}>Sunday 13.10</Text>
              <Text style={styles.hall}>CinemaGo, Hall 5</Text>
            </View>
          </View>
          <View style={styles.vacacyContainer}>
              <Text style={styles.language}>2D | English</Text>
            <View style={styles.progressContainer}>
            <View>
            <CircularProgress
                value={60}
                radius={25}
                duration={2000}
                progressValueColor={'#ecf0f1'}
                // maxValue={200}
                // titleColor={''}
                // titleStyle={{fontWeight: 'bold'}}
              />
              </View>
              <View style={styles.vacancyContent}>
              <Text style={styles.vacancyText}>Available Seats</Text>
              <Text style={styles.seats}>50</Text>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      </View>
      <Footer />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1b293a',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },
  image: {
    width: 450,
    height: 300,
  },
  content: {
    flexDirection: 'row',
    gap: 30,
    justifyContent: 'space-between',
    marginTop: 10,
  },
  textContainer: {
    flexDirection: 'column',
    width: '80%',
    gap: 5,
  },
  title: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '500',
  },
  text: {
    color: '#b2b2b2',
    fontSize: 15,
  },
  button: {
    padding: 10,
    alignItems: 'center',
    backgroundColor: '#163d71',
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  ticketContainer: {
    backgroundColor: '#fff',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#898a8c',
    gap: 10,
    padding: 10,
    width: '100%',
    marginBottom: 10,
    shadowColor: '#1b293a', 
    shadowOffset: {
      width: 0, 
      height: 5, 
    },
    shadowOpacity: 0.3, 
    shadowRadius: 5,
  },
  ticketdetails: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 80,
    
  },
  time:{
    fontSize: 35,
    fontWeight: '600',
  },
  dateContent: {
    flexDirection: 'column',
  },
  date: {
    fontSize: 22,
    fontWeight: '600'
  },
  hall:{
    fontSize: 16,
    fontWeight: '400'
  },
  vacacyContainer:{
    flexDirection: 'row',
    gap: 80,

  },
  language: {
    fontSize: 13,
    fontWeight: '600',
    marginTop: 20,
    marginLeft:10
  },
  vacancyText: {
    fontSize: 13,
    fontWeight: '500'
  },
  seats:{
    fontSize: 25,
    fontWeight: '700'
  },
  vacancyContent:{
    flexDirection: 'column',
  },
  
  progressContainer: {
    flexDirection: 'row',
    gap:7
  }
});
