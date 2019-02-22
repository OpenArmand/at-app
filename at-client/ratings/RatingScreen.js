import React from 'react';
import { Button,Text,ScrollView,FlatList,View, StyleSheet, TouchableOpacity } from 'react-native';
import io from 'socket.io-client/dist/socket.io';
import { SecureStore } from 'expo';
import { CheckBox } from 'react-native-elements'
import { Rating, AirbnbRating } from 'react-native-ratings';

export default class RatingScreen extends React.Component {
  constructor(){
    super()
    this.state={
      ratingType:'',
    }

  this.socket=io.connect('http://localhost:3000/rating', {reconnect: true});

  }

  async componentDidMount(){


    };

    ratingCompleted= async (rating) => {

    const type = await this.props.navigation.getParam('type', 'NO-TYPE');

    await this.socket.emit('giveRating', {clientUsername:await SecureStore.getItemAsync('clientSelectedUsername'), entity:await SecureStore.getItemAsync('entityToken'), ratingType:type, rating:rating});


  //  this.props.navigation.navigate('Home');

    }



    render() {

      return (

        <View style={styles.container}>
        <AirbnbRating
    count={10}
    reviews={["Terrible", "Bad", "Meh", "OK", "Good", "Hmm...", "Very Good", "Wow", "Amazing", "Unbelievable", "Jesus"]}
    defaultRating={10}
    size={20}
    onFinishRating={this.ratingCompleted}
  />
  </View>



      );
    }
  };

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 100,
    backgroundColor: '#fff',
  },
  clientContainer:{
    flex: 1,
    paddingTop: 15,
    flexDirection: 'row'
  },
  listText:{
    paddingLeft:5,
      height: 48,
}

});
