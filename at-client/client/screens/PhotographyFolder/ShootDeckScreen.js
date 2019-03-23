import React from 'react';
import { Text,ScrollView, StyleSheet, View, Button,Image,TextInput, FlatList } from 'react-native';
import io from 'socket.io-client/dist/socket.io';
import { SecureStore } from 'expo';
import Swiper from 'react-native-swiper';
import Comments from '../../../components/Comments';


export default class ShootDeckScreen extends React.Component {
  static navigationOptions = {
  };

  constructor(){
    super()

    this.state = {
      comments:[],
      image: null,
      status:null,
      base64:null,
      description:'',
      isVisible:false,
      };

    this.socket=io.connect('http://localhost:3000/photography', {reconnect: true});

};
async componentDidMount(){

  this.socket.emit('getShootPlan', {clientUsername:await SecureStore.getItemAsync('clientSelectedUsername'), entity:await SecureStore.getItemAsync('entityToken')});

  this.socket.on('gottenShootPlan', async(data)=>{

   this.setState({description:data.description});

   console.log("Desco "+this.state.description);

  });

}



  _done= async () => {

  await this.socket.emit('done', {clientUsername:await SecureStore.getItemAsync('clientSelectedUsername'), entity:await SecureStore.getItemAsync('entityToken'), msg:'Approve Shoot Plan'});
  this.props.navigation.navigate('Home');

  }


  render() {
    let { image } = this.state;

    return (



      <Swiper style={styles.wrapper} showsButtons={true}>
        <View style={styles.slide1}>


        <Comments plan='ShootPlan'/>


          <Text style={styles.text}>{this.state.description}</Text>
        </View>
        <View style={styles.slide2}>

          <View >
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
             <Button
               title="Pick an image from camera roll"
               onPress={this._pickImage}
             />
             {image &&
                  <Image source={{ uri: image }} style={{ width: 200, height: 200 }} />}


           </View>

          </View>


            <View>

            </View>
             </View>
        <View style={styles.slide3}>

        <View style={styles.comment}>
        <TextInput
        placeholder="Describe it"
        onChangeText={(text) => this.setState({description:text})}

          />

          <View style={styles.comment}>
            <Button title="Approve" onPress={this._done} />
            </View>
          </View>


        </View>
      </Swiper>

    );
  }
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 25,
    backgroundColor: '#fff',
  },
  wrapper: {
  },
  slide1: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#9DD6EB',
  },
  slide2: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#97CAE5',
  },
  slide3: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#92BBD9',
  },
  text: {
    color: '#fff',
    fontSize: 30,
    fontWeight: 'bold',
  },
  grid: {
    width: 400,
    height: 1200,
    resizeMode: 'contain',
    marginTop: 3,
    marginLeft: -10,
  },
  comment:{
    paddingTop:20,

  }
})
