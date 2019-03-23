import React from 'react';
import { TextInput,Text,ScrollView, StyleSheet, View, Button,FlatList } from 'react-native';
import io from 'socket.io-client/dist/socket.io';
import { SecureStore } from 'expo';


export default class PhotographySchedulingScreen extends React.Component {
  static navigationOptions = {
  };

  constructor(){
    super()
    this.state={
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
      confirmUpload:false,
      mediaLink:'',


    }

    this.socket=io.connect('http://localhost:3000/photography', {reconnect: true});

};

async componentDidMount(){
  console.log("this?")

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
          confirmUpload:data.confirmUpload,
          mediaLink:data.mediaLink,

              })
              console.log("this.state.clientSentRequest"+this.state.clientSentRequest)
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

      _choosePhotographer=() => {
        this.props.navigation.navigate('PhotographerBank');

      };

      location() {

        if (this.state.clientResponded==true) {
          //console.log('this is trueee!')
            return(
              <View >
              <View>
            <Text> confirmed location:{this.state.confirmedLocation["location"]} </Text>
            </View>

            </View>


          );
        } else {
          return(
            <View >
            <View>
          <Text> location not confirmed</Text>
          </View>

          </View>


        );
    }
  }


    date() {

      if (this.state.isDateConfirmed==true) {
        return(

          <View>
          <View>
          <Text> confirmed date:{this.state.confirmedDate["date"]} </Text>
          <Text>
          duration:{this.state.duration}

          </Text>
          </View>

          <View>
          <Text>
          minDate:{this.state.minDate} maxDate:{this.state.maxDate}

          </Text>
          </View>
          </View>


        );
          }
          else{

          return(
            <View>
            <View>
            <Text> Date is not confirmed</Text>
            <Text>
            duration:{this.state.duration}

            </Text>
            </View>

            <View>
            <Text>
            minDate:{this.state.minDate} maxDate:{this.state.maxDate}

            </Text>
            </View>
            </View>

              )

          }
        }


    details() {
      if (this.state.clientResponded==true) {

      return (

        <View style={styles.listText}>
          <Text> details for client: {this.state.confirmedDetails}</Text>
          <Text> details for photographer: {this.state.detailsForPhotographer}</Text>

        </View>
    );

    }
    else{
      return (

        <View style={styles.listText}>
          <Text> details for photographer: {this.state.detailsForPhotographer}</Text>
        </View>
    );
    }
  }




  _getClientApproval= async () => {


    await this.socket.emit('coordinationSendsClientRequest', {clientUsername:await SecureStore.getItemAsync('clientSelectedUsername'),key:await SecureStore.getItemAsync('shootSelectedKey'),location1:this.state.location1,location2:this.state.location2,location3:this.state.location3,details:this.state.details});

  //await this.socket.emit('coordinationSendsClientRequest', {clientUsername:await SecureStore.getItemAsync('clientSelectedUsername'), entity:await SecureStore.getItemAsync('entityToken'), msg:'Schedule Shoot'});

  }
  _ViewShootPlan= async () => {

  this.props.navigation.navigate('ShootDeck');

  }

  _photographerProfile= async () => {

  this.props.navigation.navigate('PhotographerProfile',{photographerProfile:this.state.photographer['profile']});

  }


  photographer(){
      if(this.state.photographerConfirmed==true){
        return (
          <View style={styles.listText}>

          <View style={styles.container}>
          <Text> Photographer: {this.state.photographerFirstName}  {this.state.photographerLastName}</Text>

            </View>

            <View>
              <Button title="View Photographer Profile" onPress={this._photographerProfile} />
              </View>

        </View>
        );


      }
      else{
        return(
        <View>
          <Text> A photographer is yet to confirm!</Text>
        </View>
      );
  }
  }


  action() {
    if(this.state.shootPlanCreated==true){

      if (this.state.shootPlanApproved==false) {
        return(
          <View >
            <Button title="Approve Shoot Plan" onPress={this._ViewShootPlan} />
            </View>
        );
      }
    else{
      return (
      <View>
        <Button title="View Shoot Plan" onPress={this._ViewShootPlan} />
      </View>
    );

    }

    }
    else{
      return(
        <Text>
        The content creator is still to create the shoot plan

        </Text>
      );

  }
  }

  link(){
    if(this.state.confirmUpload==true){
      return(
      <View>
      <Text>
      Here are the photos:{this.state.mediaLink}

      </Text>
        </View>
      );
    }
  }






  render() {

    return (
      <View style={styles.container}>


        <View>
        <Text>
        status:{this.state.status}
        </Text>
          </View>


          <View>
          {this.link()}
          </View>

        <View>
        {this.photographer()}
        </View>

          <View>

        {this.date()}
        </View>


          <View>

          {this.location()}
          </View>

          <View>

          {this.details()}
          </View>

          <View style={styles.action}>
          {this.action()}
            </View>

          </View>

    );
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 5,
    backgroundColor: '#fff',
  },
  action: {
    paddingTop: 5,
    backgroundColor: '#fff',
  },
});
