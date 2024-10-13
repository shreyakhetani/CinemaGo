import Ionicons from '@expo/vector-icons/Ionicons';
import { StyleSheet, View, Text,TouchableOpacity } from 'react-native';
import Svg, { G, Path } from 'react-native-svg';
import Icon from 'react-native-vector-icons/FontAwesome';


export default function Footer() {
  return (
    <View style= {styles.container}>
      <View style= {styles.logo}>
      <Svg
        fill="#cd9842"
        width="50px"
        height="50px"
        viewBox="-3.71 0 122.88 122.88"
        stroke="#cd9842"
      >
        <G id="SVGRepo_bgCarrier" strokeWidth="0" />
        <G id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round" />
        <G id="SVGRepo_iconCarrier">
          <Path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M108.07,15.56L5.7,52.84L0,37.22L102.37,0L108.07,15.56L108.07,15.56z M115.46,122.88H5.87V53.67h109.59 V122.88L115.46,122.88z M101.79,15.65V2.36l-7.23,2.61v13.34L101.79,15.65L101.79,15.65L101.79,15.65z M87.39,20.93V7.59 l-7.26,2.58v13.45L87.39,20.93L87.39,20.93z M72.49,26.07v-13.2l-7.26,2.61v13.26L72.49,26.07L72.49,26.07L72.49,26.07z M113.43,68.32l-4.56-12.54h-7.73l4.56,12.54H113.43L113.43,68.32z M97.64,68.32l-4.56-12.54h-7.76l4.59,12.54H97.64L97.64,68.32z M57.98,31.69V18.32l-7.25,2.61v13.34L57.98,31.69L57.98,31.69z M82.41,68.32l-4.56-12.54h-7.73l4.56,12.54H82.41L82.41,68.32z M43.08,36.8V23.54l-7.34,2.61v13.34L43.08,36.8L43.08,36.8z M66.62,68.32l-4.56-12.54h-7.75l4.56,12.54H66.62L66.62,68.32z M28.82,42.28V28.9l-7.31,2.7v13.26L28.82,42.28L28.82,42.28L28.82,42.28z M51.06,68.32L46.5,55.78h-7.73l4.56,12.54H51.06 L51.06,68.32z M13.84,47.39V34.13l-7.26,2.58v13.37L13.84,47.39L13.84,47.39z M35.36,68.32l-4.64-12.54l-7.67,0l4.48,12.54H35.36 L35.36,68.32z M19.96,68.32l-4.64-12.54l-7.73,0l4.56,12.54H19.96L19.96,68.32z"
          />
        </G>
      </Svg>
       <Text style= {styles.Header}>CinemaGo</Text>
    </View>
      <Text style= {styles.text}> Vankanlähde 9</Text>
      <Text style= {styles.text}> 13100 Hämeenlinna</Text>
      <Text style= {styles.phone}> Tel. 044 234 5678</Text>
      <Text style= {styles.text}>(serves during theater opening hours)</Text>
      <Text style= {styles.title}> Visiting hours</Text>
      <Text style= {styles.text}> Mon-Fri the theater opens at 14:00</Text>
      <Text style= {styles.text}> Sat-Sun the theater opens at 11:30</Text>

    <View style= {styles.socialMediaContainer}>
    <TouchableOpacity>
        <Icon name="facebook"  style= {styles.socialLogo} />
      </TouchableOpacity>
    <TouchableOpacity>
        <Icon name="linkedin" style= {styles.socialLogo} />
      </TouchableOpacity>
      <TouchableOpacity>
        <Icon name="instagram" style= {styles.socialLogo} />
      </TouchableOpacity>
      <TouchableOpacity>
        <Icon name="twitter" style= {styles.socialLogo} />
      </TouchableOpacity>

    </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1b293a',
    flexGrow: 1,
    justifyContent: 'center',   
    alignItems: 'center',
    borderBottomColor: '#cd9842',
    borderBottomWidth: 10,
    borderTopColor: '#cd9842',
    borderTopWidth: 10,
    height: 'auto',
    marginTop: 15,
  },
  logo:{
    flexDirection: 'row',
    marginBottom: 10,
    marginTop: 15,

  },
  Header: {
    fontSize: 30,
    color: '#cd9842',
    marginTop: 15,
    marginLeft: 10,
  },
  title:{
    fontSize: 17,
    color: '#fff',
    marginBottom: 7,
    fontWeight: '600'
  },

  phone:{
    fontSize: 17,
    color: '#fff',
    marginBottom: 7,
    fontWeight: '500'
  },
  
  text:{
    fontSize: 15,
    color: '#fff',
    marginBottom: 7
  },
  socialMediaContainer:{
    flexDirection: 'row',
    gap: 10
  },
  socialLogo:{
    fontSize: 20,
    color :"#fff",
    backgroundColor:'#163D71',
    padding: 20,
    borderRadius: 50,
    marginTop: 20,
    marginBottom: 20
  }
});
