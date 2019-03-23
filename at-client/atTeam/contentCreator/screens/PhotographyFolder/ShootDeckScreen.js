import React from 'react';
import { Text,ScrollView, StyleSheet, View, Button,Image,TextInput } from 'react-native';
import io from 'socket.io-client/dist/socket.io';
import { SecureStore } from 'expo';
import Swiper from 'react-native-swiper';
import {Overlay} from 'react-native-elements'


export default class ShootDeckScreen extends React.Component {
  static navigationOptions = {
  };

  constructor(){
    super()

    this.state = {
      image: null,
      base64:null,
      description:null,
      isVisible:false,

      photographerFirstName:'none',
      photographerLastName:'none',
      photographer:'',
      details:'',
      location1:'',
      location2:'',
      location3:'',
      minDate:'',
      maxDate:'',
      dates:[],
      locationDataSource:'',
      changedDateOptions:[],
      duration:'',
      confirmedLocation:'',
      confirmedDate:'',
      clientDateChange:false,
      clientLocationChange:false,
      clientDetailsChange:false,
      photographerChange:false,
      changedDates:false,
      changedLocation:false,
      changedDetails:false,
      clientResponded:false,
      status:'',
      photographerConfirmed:false,
      isDateConfirmed:false,
      detailsForPhotographer:'',
      chosenShootRequestByCoordination:false,
      clientSentRequest:false,
      shootPlanApproved:false,
      shootPlanCreated:false,
      };

    this.socket=io.connect('http://localhost:3000/photography', {reconnect: true});

};

async componentDidMount(){

      var clientSelectedUsername=await SecureStore.getItemAsync('clientSelectedUsername');
      this.socket.emit('requestAllPhotographerSchedulingInfo', {key:await SecureStore.getItemAsync('shootSelectedKey'),clientUsername:await SecureStore.getItemAsync('clientSelectedUsername')});

      this.socket.on('gottenAllPhotographerSchedulingInfo', async(data)=>{
        //console.log("1:");

        //console.log("data:"+data);
        //console.log("2:");

        //console.log("data.chosenShootRequestByCoordination:"+data.chosenShootRequestByCoordination);
        //console.log("3:");

        if (data.hasOwnProperty('chosenShootRequestByCoordination')) {


              this.setState({
          photographerFirstName:data.chosenShootRequestByCoordination.photographer.firstName,
          photographerLastName:data.chosenShootRequestByCoordination.photographer.lastName,
          photographer:data.chosenShootRequestByCoordination.photographer,
          dates:data.chosenShootRequestByCoordination.dateOptions,
          minDate:data.minDate,
          maxDate:data.maxDate,
          duration:data.duration,
          changedDateOptions:data.chosenShootRequestByCoordination.changedDateOptions,
          confirmedLocation:data.chosenShootRequestByCoordination.confirmedLocation,
          confirmedDate:data.chosenShootRequestByCoordination.confirmedDate,
          isDateConfirmed:data.chosenShootRequestByCoordination.isDateConfirmed,
          confirmedDetails:data.chosenShootRequestByCoordination.confirmedDetails,
          confirmedPhotographer:data.chosenShootRequestByCoordination.confirmedPhotographer,
          changedDates:data.chosenShootRequestByCoordination.clientDateChange,
          changedLocation:data.chosenShootRequestByCoordination.clientLocationChange,
          changedDetails:data.chosenShootRequestByCoordination.clientDetailsChange,
          photographerChange:data.photographerChange,
          changedDates:data.chosenShootRequestByCoordination.clientDateChange,
          changedLocation:data.chosenShootRequestByCoordination.clientLocationChange,
          changedDetails:data.chosenShootRequestByCoordination.clientDetailsChange,
          clientResponded:data.chosenShootRequestByCoordination.clientResponded,
          status:data.status,
          photographerConfirmed:data.chosenShootRequestByCoordination.photographerConfirmed,
          detailsForPhotographer:data.detailsForPhotographers,
          chosenShootRequestByCoordination:true,
          clientSentRequest:data.chosenShootRequestByCoordination.clientSentRequest,
          locationDataSource:data.chosenShootRequestByCoordination.locationOptions,
          shootPlanApproved:data.shootPlanApproved,
          shootPlanCreated:data.shootPlanCreated,

              })
              console.log("this.state.shootPlanCreated"+this.state.shootPlanCreated)
        }
        else{
          this.setState({
      minDate:data.minDate,
      maxDate:data.maxDate,
      duration:data.duration,
      photographerChange:data.photographerChange,
      status:data.status,
      detailsForPhotographer:data.detailsForPhotographers,
      chosenShootRequestByCoordination:false,
      shootPlanApproved:data.shootPlanApproved,
      shootPlanCreated:data.shootPlanCreated,
          })
        }

         });

      }


  _sendToCore= async () => {

  await this.socket.emit('sendToCore', {key:await SecureStore.getItemAsync('shootSelectedKey'),clientUsername:await SecureStore.getItemAsync('clientSelectedUsername'), entity:await SecureStore.getItemAsync('entityToken'), msg:'Create Shoot Plan',description:this.state.description});

  }

  _viewComments= async () => {
    this.setState({isVisible:!this.state.isVisible});

  }

  action(){
    if (this.state.shootPlanCreated==false) {
      return(
        <View>
          <Button title="Send for Core Approval" onPress={this._sendToCore} />
          </View>

      );
    }
  else{
    return (
    <View>
      <Text> Sent to Core </Text>
    </View>
  );

  }

  }



  render() {
    let { image } = this.state;

    return (



      <Swiper style={styles.wrapper} showsButtons={true}>
        <View style={styles.slide1}>

        <View>
        <Button
          title="View Comments"
          onPress={this._viewComments}
        />
        </View>

        <Overlay isVisible={this.state.isVisible}>
        <View>
          <Text> Comment away</Text>
          </View>

          <View>

          <Button
            title="X"
            onPress={this._viewComments}
          />
          </View>


        </Overlay>

        <View>
          <Text style={styles.text}>The shoot plan gonna be siq</Text>
        </View>
        </View>

        <View style={styles.slide2}>

          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
             <Button
               title="Pick an image from camera roll"
               onPress={this._pickImage}
             />
             {image &&
                  <Image source={{ uri: image }} style={{ width: 200, height: 200 }} />}


           </View>

             </View>
        <View style={styles.slide3}>

        <View style={styles.comment}>
        <TextInput
        placeholder="Describe it"
        onChangeText={(text) => this.setState({description:text})}

          />
          </View>


          <View>
          {this.action()}
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
