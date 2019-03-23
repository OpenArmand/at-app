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
      confirmUpload:false,
      mediaLink:'',
      key:'',
      clientUsername:'',
      cancelDate:false,
      photographerReasonForCancellation:'',
    }

    this.socket=io.connect('http://localhost:3000/photography', {reconnect: true});

};

async componentDidMount(){


      var clientSelectedUsername=await SecureStore.getItemAsync('clientSelectedUsername');
      this.socket.emit('requestAllPhotographerSchedulingInfo', {key:await SecureStore.getItemAsync('shootSelectedKey'),clientUsername:await SecureStore.getItemAsync('clientSelectedUsername')});

      this.socket.on('gottenAllPhotographerSchedulingInfo', async(data)=>{


        var clientUsername=await SecureStore.getItemAsync('clientSelectedUsername');
        var key=await SecureStore.getItemAsync('shootSelectedKey');


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
          confirmUpload:data.confirmUpload,
          mediaLink:data.mediaLink,
          clientUsername:clientUsername,
          key:key,
          cancelDate:data.cancelDate,
          photographerReasonForCancellation:data.chosenShootRequestByCoordination.photographerReasonForCancellation,

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
      chosenShootRequestByCoordination:false
          })
        }

         });

      }

      _choosePhotographer=() => {
        this.props.navigation.navigate('PhotographerBank');

      };

      _cancelDate=() => {
        console.log("yo");
         this.socket.emit('coordinationCancelsDate', {clientUsername:this.state.clientUsername,key:this.state.key});

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
          //console.log('And false what?!')
          if(this.state.chosenShootRequestByCoordination==true){
            if(this.state.clientSentRequest==false){
            return(
            <View>

            <View>
            <TextInput
            placeholder="Proposed Location 1"
              onChangeText={(text) => this.setState({location1:text})}
              style={styles.input}
              />
            </View>

            <View >
            <TextInput
            placeholder="Proposed Location 2"
              onChangeText={(text) => this.setState({location2:text})}
              style={styles.input}
              />
            </View>

            <View >
            <TextInput
            placeholder="Proposed Location 3"
              onChangeText={(text) => this.setState({location3:text})}
              style={styles.input}
              />
            </View>

              </View>


            );
        }
        else{
          return(

            <View>
            <View>
            <Text>
          Locations Proposed:
            </Text>
              </View>
            <FlatList
            data={this.state.locationDataSource}
            extraData={this.state}
            renderItem={({item}) =>

            {
                return (

                    <View style={styles.clientContainer}>

                    <View style={styles.listText}>

                      <Text>
                      {item.location}
                      </Text>

                      </View>

                    </View>

                );
              }
            }

          />
              </View>


          );
        }
      }

    }
  }


    date() {

      if (this.state.clientResponded==true) {
        //console.log("YES cliietnnnss DATE FALZZ")

        if(this.state.changedDates==false){
          //console.log("YES CHANGED DATE FALZZ")

          if(this.state.cancelDate==true && this.state.photographerConfirmed==false){
            return(<View>
          <Text> The last chosen date/s was cancelled </Text>
          </View>);
          }
          else{
          return(
            <View>
          <Text> confirmed date:{this.state.confirmedDate["date"]} </Text>
          </View>

        );
      }
        }
        else{
          if(this.state.photographerConfirmed==true){
            return(<View>
          <Text> confirmed date:{this.state.confirmedDate["date"]} </Text>
          </View>);
          }
          else{

            if(this.state.cancelDate==true){
              return(<View>
            <Text> The last chosen date/s was cancelled </Text>
            </View>);
            }
            else{

          return(

          <FlatList
          data={this.state.changedDateOptions}
          extraData={this.state}
          renderItem={({item}) =>

          {
              return (

                  <View style={styles.clientContainer}>

                  <View style={styles.listText}>

                    <Text>{item.date}</Text>

                  </View>

                  </View>

              );
            }
          }

        />
      );
        }
        }
        }

      } else {

          return(  <FlatList
            data={this.state.dates}
            extraData={this.state}
            renderItem={({item}) =>

            {
                return (

                    <View style={styles.clientContainer}>

                    <View style={styles.listText}>

                      <Text>{item.date}</Text>

                    </View>

                    </View>

                );
              }
            }

          />

          );
      }
    };

    details() {
      if (this.state.clientResponded==true) {
          return (
            <View style={styles.listText}>
              <Text> details for client: {this.state.confirmedDetails}</Text>
              <Text> details for photographer: {this.state.detailsForPhotographer}</Text>

            </View>
          )
    }
    else{
      if(this.state.chosenShootRequestByCoordination==true){
        if(this.state.clientSentRequest==false){

      return (
      <View >
      <View>
      <Text>
      {this.state.details}
      </Text>
      </View>
        <View>
      <TextInput
      placeholder="Change Additional details"
        onChangeText={(text) => this.setState({details:text})}
        style={styles.input}
        />
        </View>
      </View>
    );
    }
    else{

      return (

        <View style={styles.listText}>
          <Text> details for client: {this.state.confirmedDetails}</Text>
          <Text> details for photographer: {this.state.detailsForPhotographer}</Text>

        </View>
    );

    }
  }
  }
  }



  _getClientApproval= async () => {
    console.log('this is clicked');

  //  await this.socket.emit('coordinationSendsClientRequest', {clientUsername:await SecureStore.getItemAsync('clientSelectedUsername'),key:await SecureStore.getItemAsync('shootSelectedKey'),location1:this.state.location1,location2:this.state.location2,location3:this.state.location3,details:this.state.details});

    await this.socket.emit('coordinationSendsClientRequest', {clientUsername:this.state.clientUsername,key:this.state.key,location1:this.state.location1,location2:this.state.location2,location3:this.state.location3,details:this.state.details});


  //await this.socket.emit('coordinationSendsClientRequest', {clientUsername:await SecureStore.getItemAsync('clientSelectedUsername'), entity:await SecureStore.getItemAsync('entityToken'), msg:'Schedule Shoot'});

  }

  _ViewShootPlan= async () => {

  this.props.navigation.navigate('ShootDeck');

  }

  _photographerProfile= async () => {

  this.props.navigation.navigate('PhotographerProfile',{photographerProfile:this.state.photographer['profile']});

  }


  photographer(){
    if (this.state.clientResponded==true) {
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
  else{
    if(this.state.chosenShootRequestByCoordination==true){
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
    return (
    <View>
      <Text> Photographer not selected</Text>
    </View>
  );

  }

  }
  }


  action() {
    if (this.state.clientResponded==true) {
      if(this.state.photographerConfirmed==true){

        return (
          <View style={styles.listText}>
            <Text>Chill, photography confirmed </Text>
          </View>
        );

      }
      else{

        if(this.state.cancelDate==true){
          return(  <View>
              <Button title="Choose Photographer" onPress={this._choosePhotographer} />
            </View>);
        }
        else{
          console.log("this.state.cancelDate:"+this.state.cancelDate)
        return(
          <View>

        <View>
          <Button title="Choose Photographer" onPress={this._choosePhotographer} />
        </View>

        <View>
          <Button title="Cancel Date" onPress={this._cancelDate} />
        </View>
        </View>

      );
      }
      }
  }
  else{
    if(this.state.chosenShootRequestByCoordination==true){
      if(this.state.clientSentRequest==false){
    return (
    <View>
      <Button title="Request Client Approval" onPress={this._getClientApproval} />
    </View>
  );
  }
}

  else{
    return (
    <View>
      <Button title="Choose Photographer" onPress={this._choosePhotographer} />
    </View>
  );

  }

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
      {this.link()}
      </View>

      <View>
      {this.action()}
        </View>

        <View>
        <Text>
        status:{this.state.status}
        </Text>
          </View>

        <View>
        <Text>
        duration:{this.state.duration}

        </Text>
        </View>

        <View>
        <Text>
        minDate:{this.state.minDate} maxDate:{this.state.maxDate}

        </Text>
        </View>


        <View>
        {this.photographer()}
        </View>

          <View>

        {this.date()}
        </View>


        <View style={styles.container}>
          <Button title="View Shoot Plan" onPress={this._ViewShootPlan} />
          </View>

          <View>

          {this.location()}
          </View>

          <View>

          {this.details()}
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
});
