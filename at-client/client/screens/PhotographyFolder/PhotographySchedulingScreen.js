import React from 'react';
import { Alert,TouchableOpacity,Text,ScrollView, StyleSheet, View, Button,FlatList, TextInput } from 'react-native';
import io from 'socket.io-client/dist/socket.io';
import { SecureStore } from 'expo';
import { CheckBox,Overlay } from 'react-native-elements'
import DateTimePicker from 'react-native-modal-datetime-picker';


export default class PhotographySchedulingScreen extends React.Component {
  static navigationOptions = {
  };


  constructor(){
    super()
    this.state={
      photographerFirstName:'',
      photographerLastName:'',
      photographer:'',
      photographerProfile:'',
      details:'',
      duration:'',
      locationDataSource:'',
      dateDataSource:'',
      previousSelectedDate:'',
      selectedDate:'',
      previousSelectedLocation:'',
      selectedLocation:'',
      changedDetailsString:'',
      changeDatesIsVisible:false,
      changeLocationsIsVisible:false,
      changedDates:false,
      changedLocation:false,
      changedDetails:false,
      date1:'',
      date2:'',
      date3:'',
      minDate:'',
      maxDate:'',
      isDateTimePickerVisible1: false,
      isDateTimePickerVisible2: false,
      isDateTimePickerVisible3: false,
      changedLocationString:'',
      changeDetailsIsVisible:false,
      clientResponded:false,
      clientDateChange:false,
      confirmedPhotographerLastName:'',
      confirmedPhotographerFirstName:'',
      confirmedDetails:'',
      confirmedLocation:'',
      confirmedDate:'',
      changedDateOptions:[],
      status:'',
      uniqueValue: 1,
      confirmUpload:false,
      mediaLink:'',
      cancelDate:false,


    }

    this.socket=io.connect('http://localhost:3000/photography', {reconnect: true});

};

_setProposedDates= async()=>{

  if (this.state.date1==''||this.state.date2==''||this.state.date3==''){
    Alert.alert(
          'Please choose 3 dates'
       )

       return false;
  }
  var newDateKey1 = Math.random().toString(36).substring(7);
  var newDateKey2 = Math.random().toString(36).substring(7);
  var newDateKey3 = Math.random().toString(36).substring(7);

  var dateDataSource=[{key:newDateKey1,date:this.state.date1, selected:true},{key:newDateKey2,date:this.state.date2,selected:true},{key:newDateKey3,date:this.state.date3,selected:true}]

  this.setState({changeDatesIsVisible:!this.state.changeDatesIsVisible, dateDataSource:dateDataSource,changedDates:true})

}

_setLocation= async()=>{

  var newLocationKey = Math.random().toString(36).substring(7);

  var locationDataSource=[{key:newLocationKey,location:this.state.changedLocationString, selected:true}];

  this.setState({changeLocationIsVisible:!this.state.changeDatesIsVisible, locationDataSource:locationDataSource, changedLocation:true})

}

_setDetails= async()=>{

  this.setState({changeDetailsIsVisible:!this.state.changeDetailsIsVisible, details:this.state.changedDetailsString, changedDetails:true})

}

_showDateTimePicker1 = () => this.setState({ isDateTimePickerVisible1: true });
_showDateTimePicker2 = () => this.setState({ isDateTimePickerVisible2: true });
_showDateTimePicker3 = () => this.setState({ isDateTimePickerVisible3: true });

  _hideDateTimePicker1 = () => this.setState({ isDateTimePickerVisible1: false });
  _hideDateTimePicker2 = () => this.setState({ isDateTimePickerVisible2: false });
  _hideDateTimePicker3 = () => this.setState({ isDateTimePickerVisible3: false });

  _handleDatePicked1 = (date) => {

    var arrayDayHelper=this.state.maxDate.split("/");
      var maxMonth=parseInt(arrayDayHelper[0]);
      var maxDay=parseInt(arrayDayHelper[1]);
      var maxYear=parseInt(arrayDayHelper[2]);
      var maxDate = new Date(maxYear, maxMonth-1, maxDay);

      var arrayDayHelper=this.state.minDate.split("/");
      var minMonth=parseInt(arrayDayHelper[0]);
      var minDay=parseInt(arrayDayHelper[1]);
      var minYear=parseInt(arrayDayHelper[2]);
      var minDate = new Date(minYear, minMonth-1, minDay);


    //console.log("date<this.state.minDate?"+ date.getTime()<this.state.minDate.getTime())

    if (date<minDate || date>maxDate){
      Alert.alert(
            'Dates need to be within the range:'+minDate+'& '+maxDate
         )

         return false;
    }

      console.log('A date has been picked: ', date);
      var DateString=date.toLocaleDateString('en-US'); //1/27/2019
      const monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
      ];

      var month= monthNames[date.getMonth()];
      var day= [date.getDate()];
      var year= date.getYear()+1900;
      var dateWithMonth= day+" "+month+" "+year+" ";

      var hours=date.getHours();
      var hoursWithMinutesAMPM;
      var minutes=date.getMinutes();
      if(minutes<10){
        minutes='0'+minutes;
      }

      if (hours<12){
        if(hours==0){
          hours=12;
        }
        hoursWithMinutesAMPM=hours+":"+minutes+' am';
      }
      else{
        hours=hours-12;
        if(hours==0){
          hours=12;
        }
        hoursWithMinutesAMPM=hours+":"+minutes+' pm';
      }

      var DateWithHoursMinutes=dateWithMonth+"@"+hoursWithMinutesAMPM;

      this.setState({date1:DateWithHoursMinutes});


    this._hideDateTimePicker1();
  };


  _handleDatePicked2 = (date) => {

    var arrayDayHelper=this.state.maxDate.split("/");
      var maxMonth=parseInt(arrayDayHelper[0]);
      var maxDay=parseInt(arrayDayHelper[1]);
      var maxYear=parseInt(arrayDayHelper[2]);
      var maxDate = new Date(maxYear, maxMonth-1, maxDay);

      var arrayDayHelper=this.state.minDate.split("/");
      var minMonth=parseInt(arrayDayHelper[0]);
      var minDay=parseInt(arrayDayHelper[1]);
      var minYear=parseInt(arrayDayHelper[2]);
      var minDate = new Date(minYear, minMonth-1, minDay);


    //console.log("date<this.state.minDate?"+ date.getTime()<this.state.minDate.getTime())

    if (date<minDate || date>maxDate){
      Alert.alert(
            'Dates need to be within the range:'+minDate+'& '+maxDate
         )

         return false;
    }

      console.log('A date has been picked: ', date);
      var DateString=date.toLocaleDateString('en-US'); //1/27/2019

      const monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
      ];

      var month= monthNames[date.getMonth()];
      var day= [date.getDate()];
      var year= date.getYear()+1900;
      var dateWithMonth= day+" "+month+" "+year+" ";

      var hours=date.getHours();
      var hoursWithMinutesAMPM;
      var minutes=date.getMinutes();
      if(minutes<10){
        minutes='0'+minutes;
      }

      if (hours<12){
        if(hours==0){
          hours=12;
        }
        hoursWithMinutesAMPM=hours+":"+minutes+' am';
      }
      else{
        hours=hours-12;
        if(hours==0){
          hours=12;
        }
        hoursWithMinutesAMPM=hours+":"+minutes+' pm';
      }

      var DateWithHoursMinutes=dateWithMonth+"@"+hoursWithMinutesAMPM;

      this.setState({date2:DateWithHoursMinutes});


    this._hideDateTimePicker2();
  };


  _handleDatePicked3 = (date) => {

    var arrayDayHelper=this.state.maxDate.split("/");
      var maxMonth=parseInt(arrayDayHelper[0]);
      var maxDay=parseInt(arrayDayHelper[1]);
      var maxYear=parseInt(arrayDayHelper[2]);
      var maxDate = new Date(maxYear, maxMonth-1, maxDay);

      var arrayDayHelper=this.state.minDate.split("/");
      var minMonth=parseInt(arrayDayHelper[0]);
      var minDay=parseInt(arrayDayHelper[1]);
      var minYear=parseInt(arrayDayHelper[2]);
      var minDate = new Date(minYear, minMonth-1, minDay);


    //console.log("date<this.state.minDate?"+ date.getTime()<this.state.minDate.getTime())

    if (date<minDate || date>maxDate){
      Alert.alert(
            'Dates need to be within the range:'+minDate+'& '+maxDate
         )

         return false;
    }

      console.log('A date has been picked: ', date);
      var DateString=date.toLocaleDateString('en-US'); //1/27/2019
      const monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
      ];

      var month= monthNames[date.getMonth()];
      var day= [date.getDate()];
      var year= date.getYear()+1900;
      var dateWithMonth= day+" "+month+" "+year+" ";

      var hours=date.getHours();
      var hoursWithMinutesAMPM;
      var minutes=date.getMinutes();
      if(minutes<10){
        minutes='0'+minutes;
      }

      if (hours<12){
        if(hours==0){
          hours=12;
        }
        hoursWithMinutesAMPM=hours+":"+minutes+' am';
      }
      else{
        hours=hours-12;
        if(hours==0){
          hours=12;
        }
        hoursWithMinutesAMPM=hours+":"+minutes+' pm';
      }

      var DateWithHoursMinutes=dateWithMonth+"@"+hoursWithMinutesAMPM;

      this.setState({date3:DateWithHoursMinutes});


    this._hideDateTimePicker3();
  };

_viewShootPlan= async () => {

this.props.navigation.navigate('ShootDeck');

}

_viewProposeNewDates= async()=>{
  this.setState({changeDatesIsVisible:!this.state.changeDatesIsVisible})
}

_viewProposeNewLocation= async()=>{
  this.setState({changeLocationsIsVisible:!this.state.changeLocationsIsVisible})
}

_viewProposeNewLogistics= async()=>{
  this.setState({changeDetailsIsVisible:!this.state.changeDetailsIsVisible})
}

  _filterDate=async(item) => {
    if(this.state.previousSelectedDate==item){
    }

    else{
    this.setState({selectedDate:item})
    item.selected=true;

    this.state.previousSelectedDate.selected=false;

    this.setState({previousSelectedDate:item});

    }

  }

  _filterLocation=async(item) => {

    if(this.state.previousSelectedLocation==item){
    }

    else{
    this.setState({selectedLocation:item})
    item.selected=true;

    this.state.previousSelectedLocation.selected=false;

    this.setState({previousSelectedLocation:item});

    }

  }

  _submit=async() => {

    if(this.state.selectedDate==''&& this.state.changedDates==false){
      Alert.alert(
            'Please select a date or propose new ones'
         )
    }
     else if(this.state.selectedLocation==''&&this.state.changedLocation==false){
       Alert.alert(
             'Please select a location or propose a new one'
          )
    }

    else{
      this.socket.emit('submitClientInfo', {key:await SecureStore.getItemAsync('shootSelectedKey'),clientUsername:await SecureStore.getItemAsync('clientSelectedUsername'),state:this.state});

      this.socket.emit('getClientRequestInfo', {key:await SecureStore.getItemAsync('shootSelectedKey'),clientUsername:await SecureStore.getItemAsync('clientSelectedUsername')});

      this.socket.on('gottenClientRequestInfo', async(data)=>{

        var shootRequest=data.chosenShootRequestByCoordination;

        if (data.chosenShootRequestByCoordination.photographerConfirmed==true) {
          var confirmedPhotographer=shootRequest.photographer;
        }
        else{
          var confirmedPhotographer='';
        }

        var photographer=shootRequest.photographer;

        console.log("shootRequest.locationOptions:"+shootRequest.locationOptions[0]);

                  this.setState({
              minDate:data.minDate,
              duration:data.duration,
              maxDate:data.maxDate,
              photographerFirstName:photographer.firstName,
              photographerLastName:photographer.lastName,
              photographer:photographer,
              details:shootRequest.detailsForClient,
              locationDataSource:shootRequest.locationOptions,
              dateDataSource:shootRequest.dateOptions,
              clientResponded:shootRequest.clientResponded,
              clientDateChange:data.chosenShootRequestByCoordination.clientDateChange,
              photographerConfirmed:data.chosenShootRequestByCoordination.photographerConfirmed,
              confirmedPhotographer:confirmedPhotographer,
              confirmedDetails:data.chosenShootRequestByCoordination.confirmedDetails,
              confirmedDate:data.chosenShootRequestByCoordination.confirmedDate,
              confirmedLocation:data.chosenShootRequestByCoordination.confirmedLocation,
              changedDates:data.chosenShootRequestByCoordination.changedDates,
              status:data.status,
              uniqueValue:this.state.uniqueValue+1,


            });

          });
/*
      var key='a';
      var selected=false;
      if(this.state.changedDates==false){
        this.setState({status:'The shoot is confirmed!',confirmedDate:this.state.selectedDate,photographerConfirmed:true,confirmedPhotographer:this.state.photographer});
      }
      else{
        var changedDateObj=[{key:key,selected:selected,date:this.state.date1},{key:key,selected:selected,date:this.state.date2},{key:key,selected:selected,date:this.state.date3}];

        this.setState({status:'The shoot is confirmed on the client end. Waiting on photographer confirmation', confirmedDate:changedDateObj});

      }

      if(this.state.changedDetails==false){
        this.setState({confirmedDetails:this.state.details})
      }
      else{
        this.setState({confirmedDetails:this.state.changedDetailsString})
      }


      if(this.state.selectedLocation!=''){
        this.setState({confirmedLocation:this.state.selectedLocation});
    }
    else{
      this.setState({confirmedLocation:{location:this.state.changedLocationString}});
    }


    }
    console.log("this.state.confirmedLocation:"+this.state.confirmedLocation);*/

  }
}


  async componentDidMount(){

    this.socket.emit('getClientRequestInfo', {key:await SecureStore.getItemAsync('shootSelectedKey'),clientUsername:await SecureStore.getItemAsync('clientSelectedUsername')});

    this.socket.on('gottenClientRequestInfo', async(data)=>{

      var shootRequest=data.chosenShootRequestByCoordination;

      if (data.chosenShootRequestByCoordination.photographerConfirmed==true) {
        var confirmedPhotographer=shootRequest.photographer;
      }
      else{
        var confirmedPhotographer='';
      }

      var photographer=shootRequest.photographer;

      console.log("shootRequest.locationOptions:"+shootRequest.locationOptions[0]);

                this.setState({
            minDate:data.minDate,
            duration:data.duration,
            maxDate:data.maxDate,
            photographerFirstName:photographer.firstName,
            photographerLastName:photographer.lastName,
            photographer:photographer,
            details:shootRequest.detailsForClient,
            locationDataSource:shootRequest.locationOptions,
            dateDataSource:shootRequest.dateOptions,
            clientResponded:shootRequest.clientResponded,
            clientDateChange:data.chosenShootRequestByCoordination.clientDateChange,
            photographerConfirmed:data.chosenShootRequestByCoordination.photographerConfirmed,
            confirmedPhotographer:confirmedPhotographer,
            confirmedDetails:data.chosenShootRequestByCoordination.confirmedDetails,
            confirmedDate:data.chosenShootRequestByCoordination.confirmedDate,
            confirmedLocation:data.chosenShootRequestByCoordination.confirmedLocation,
            changedDates:data.chosenShootRequestByCoordination.changedDates,
            status:data.status,
            confirmUpload:data.confirmUpload,
            mediaLink:data.mediaLink,
            cancelDate:data.cancelDate,

          });

        });
      };

      _photographerProfile= async () => {

      this.props.navigation.navigate('PhotographerProfile',{photographerProfile:this.state.photographer['profile']});

      }

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
        }
        else{
          return(
            <View>


                          <View>
                          <View>
                          <Text>
                        Locations:
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

                                  <View>

                                  <CheckBox
                                    title='Select'
                                    checked={item.selected}
                                    onPress={() => this._filterLocation(item)}
                                  />

                                  </View>

                                  </View>

                              );
                            }
                          }

                        />
                            </View>

                            <View>
                              <Button title="Propose new location" onPress={this._viewProposeNewLocation} />
                              </View>

                            <Overlay isVisible={this.state.changeLocationsIsVisible}>
                            <View>
                            <Text>Write the location you want the shoot to be at</Text>
                              </View>

                              <View>
                                <Button
                                  title="X"
                                  onPress={this._viewProposeNewLocation}
                                />

                                </View>

                                <TextInput
                                placeholder="Location"
                                  onChangeText={(text) => this.setState({changedLocationString:text})}
                                  style={styles.input}
                                  />

                                        <Button
                                          title="set location"
                                          onPress={this._setLocation}
                                        />

                                      </Overlay>

                                      </View>


          );
        }
      }



      date() {

        if (this.state.clientResponded==true) {
          //console.log("YES cliietnnnss DATE FALZZ")

          if(this.state.changedDates==false){
            //console.log("YES CHANGED DATE FALZZ")
            return(
              <View>
            <Text> confirmed date:{this.state.confirmedDate["date"]} </Text>
            </View>

          );
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
              <Text> The date/s you selected have been cancelled. New dates will be sent shortly. </Text>
              </View>);
              }

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

        } else {

            return(
            <View>
              <View>
              <Text>
              Dates and Times:
              </Text>
                </View>

                <FlatList
                data={this.state.dateDataSource}
                extraData={this.state}
                renderItem={({item}) =>

                {
                    return (

                        <View style={styles.clientContainer}>

                        <View style={styles.listText}>

                          <Text>
                          {item.date}
                          </Text>

                          </View>

                        <View>

                        <CheckBox
                          title='Select'
                          checked={item.selected}
                          onPress={() => this._filterDate(item)}
                        />

                        </View>

                        </View>

                    );
                  }
                }

              />

              <View>
                <Button title="Propose new dates and times" onPress={this._viewProposeNewDates} />
                </View>


              <Overlay isVisible={this.state.changeDatesIsVisible}>
              <View>
              <Text>Pick 3 dates and times within the range {this.state.minDate} and {this.state.maxDate}</Text>
                </View>

                <View>
                  <Button
                    title="X"
                    onPress={this._viewProposeNewDates}
                  />

                  </View>

                          <View style={{ flex: 1 }}>

                        <TouchableOpacity onPress={this._showDateTimePicker1}>
                          <Text>Option 1: {this.state.date1}</Text>
                        </TouchableOpacity>
                        <DateTimePicker
                        mode='datetime'
                          isVisible={this.state.isDateTimePickerVisible1}
                          onConfirm={this._handleDatePicked1}
                          onCancel={this._hideDateTimePicker1}
                        />

                      </View>

                              <View style={{ flex: 1 }}>
                            <TouchableOpacity onPress={this._showDateTimePicker2}>
                              <Text>Option 2  {this.state.date2}</Text>
                            </TouchableOpacity>
                            <DateTimePicker
                            mode='datetime'
                              isVisible={this.state.isDateTimePickerVisible2}
                              onConfirm={this._handleDatePicked2}
                              onCancel={this._hideDateTimePicker2}
                            />
                          </View>

                          <View style={{ flex: 1 }}>
                          <TouchableOpacity onPress={this._showDateTimePicker3}>
                          <Text>Option 3  {this.state.date3}</Text>
                          </TouchableOpacity>
                          <DateTimePicker
                          mode='datetime'
                          isVisible={this.state.isDateTimePickerVisible3}
                          onConfirm={this._handleDatePicked3}
                          onCancel={this._hideDateTimePicker3}
                          />
                          </View>

                          <Button
                            title="set dates"
                            onPress={this._setProposedDates}
                          />

                        </Overlay>
                        </View>

            );
        }
      };

      details() {
        if (this.state.clientResponded==true) {
            return (
              <View style={styles.listText}>
                <Text> details for client: {this.state.confirmedDetails}</Text>
              </View>
            );
      }
      else{
        return(
          <View>
                <View>
                  <Button title="Propose new logistics plan" onPress={this._viewProposeNewLogistics} />
                  </View>

                <Overlay isVisible={this.state.changeDetailsIsVisible}>
                <View>
                <Text>Write the logistics plan you want</Text>
                  </View>

                  <View>
                    <Button
                      title="X"
                      onPress={this._viewProposeNewLogistics}
                    />

                    </View>

                    <TextInput
                    placeholder="Propose a different logistics plan"
                      onChangeText={(text) => this.setState({changedDetailsString:text})}
                      style={styles.input}
                      />

                            <Button
                              title="set details"
                              onPress={this._setDetails}
                            />

                          </Overlay>



        <View style={styles.listText}>

          <Text>
          logistic details: {this.state.details}
          </Text>
          </View>

          </View>

      );

    }
  }


      action() {
        if (this.state.clientResponded==true) {
          if(this.state.photographerConfirmed==true){

          }
          else{

          }
      }
      else{
        return(
        <View>
          <Button title="Submit" onPress={this._submit} />
          </View>
      );

    }
  }

  photographer() {
    if (this.state.clientResponded==true) {
      if(this.state.photographerConfirmed==true){
        return(
        <View>
        <View>
          <Button title="View Photographer Profile" onPress={this._photographerProfile} />
          </View>

        <View>
        <Text>
        finalizedPhotographer:{this.state.confirmedPhotographer.firstName} {this.state.confirmedPhotographer.lastName}

        </Text>
          </View>
          </View>
        );
      }
      else{
        return(
          <View>

          <Text>
          Hold on, waiting for the photographer to confirm!
          </Text>

            </View>

        );


      }
  }
  else{
    return(
      <View>
      <View>
        <Button title="View Photographer Profile" onPress={this._photographerProfile} />
        </View>

      <View>
      <Text>
      Photographer:{this.state.photographer.firstName} {this.state.photographer.lastName}

      </Text>
        </View>
        </View>
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
      <View key={this.state.uniqueValue} style={styles.container}>

      <View >

      <View>
      {this.link()}
      </View>

      <View>
      {this.action()}
      </View>



        <View>
          <Button title="View shoot plan" onPress={this._viewShootPlan} />
          </View>

          <View>
          <Text> {this.state.status} </Text>
          </View>

            <View>
            <Text>
            duration:{this.state.duration}

            </Text>
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

            </View>
            </View>


    );
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 25,
    backgroundColor: '#fff',
  },
  clientContainer:{
    flex: 1,
    paddingTop: 15,
    flexDirection: 'row'
  },
  listText:{
    paddingLeft:5,
     width: "30%",
      height: 48,
       backgroundColor: "white" },
});
