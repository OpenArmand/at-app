import React from 'react';
import { Text,ScrollView, StyleSheet, View, Button,TextInput,Image } from 'react-native';
import io from 'socket.io-client/dist/socket.io';
import { SecureStore } from 'expo';
import Swiper from 'react-native-swiper';


export default class StrategyScreen extends React.Component {
  static navigationOptions = {
  };

  constructor(){
    super()
    this.state={
      description:null,
      image:'',
    }

    this.socket=io.connect('http://localhost:3000/strategy', {reconnect: true});

};

async componentDidMount(){

  this.socket.emit('getStrategy', {clientUsername:await SecureStore.getItemAsync('clientSelectedUsername'), entity:"Client"});

  this.socket.on('gottenStrategy', async(data)=>{

var imu= 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADMAAAAzCAYAAAA6oTAqAAAAEXRFWHRTb2Z0d2FyZQBwbmdjcnVzaEB1SfMAAABQSURBVGje7dSxCQBACARB+2/ab8BEeQNhFi6WSYzYLYudDQYGBgYGBgYGBgYGBgYGBgZmcvDqYGBgmhivGQYGBgYGBgYGBgYGBgYGBgbmQw+P/eMrC5UTVAAAAABJRU5ErkJggg=='
  //  var imageFormatted="'"+"data:"+data.image.contentType+";base64,"+data.image.data+"'";
  // this.setState({image:data.image.data,description:data.description});
   this.setState({image:"data:image/jpeg;base64,"+data.image.data,description:data.description});

///   console.log(this.state.image);

  });
}


  _done= async () => {

//  await this.socket.emit('done', {clientUsername:await SecureStore.getItemAsync('clientSelectedUsername'), entity:await SecureStore.getItemAsync('entityToken'), msg:'Approve Strategy Plan'});

console.log("done");

  this.props.navigation.navigate('Rating', {
              type: "strategyRating",
            });

  }


  render() {
    return (

        <Swiper style={styles.wrapper} showsButtons={true}>
          <View style={styles.slide1}>
            <Text style={styles.text}>{this.state.description}</Text>
          </View>
          <View style={styles.slide2}>

              <Image
              style={{
               width: 51,
               height: 51,
               resizeMode: 'contain',
             }}
              source={{
                uri:this.state.image}} />



              <View>

              </View>
               </View>
          <View style={styles.slide3}>

          <View style={styles.comment}>
          <TextInput
          placeholder="leave a comment"
            />

            <View style={styles.comment}>
              <Button title="Done" onPress={this._done} />
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
