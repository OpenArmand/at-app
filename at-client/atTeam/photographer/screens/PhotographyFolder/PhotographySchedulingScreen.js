import React from 'react';
import { TextInput,FlatList,Text,ScrollView, Alert, StyleSheet, View, Button,TouchableOpacity } from 'react-native';
import io from 'socket.io-client/dist/socket.io';
import { SecureStore } from 'expo';
import DateTimePicker from 'react-native-modal-datetime-picker';
import { CheckBox,Overlay } from 'react-native-elements'


export default class PhotographySchedulingScreen extends React.Component {
  static navigationOptions = {
  };

  constructor(){
    super()
    this.state={
      date1:'',
      date2:'',
      date3:'',
      minDate:'',
      maxDate:'',
      confirmUpload:false,
      isDateTimePickerVisible1: false,
      isDateTimePickerVisible2: false,
      isDateTimePickerVisible3: false,
      detailsForShoot:'',
      status:'',
      dateChange:false,
      dateDataSource:'',
      previousSelectedDate:'',
      selectedDate:'',
      photographyConfirmed:false,
      confirmedLocation:'',
      detailsForPhotographer:'',
      cancellationReason:'',
      cancellationOpen:false,
      cancelled:false,
      confirmedDate:'',
      inOptions:false,
      pickedDatesDataSource:[],
      uniqueValue:1,
      isDateConfirmed:false,
      mediaLink:'',
      cancelDate:false,

    }

    this.socket=io.connect('http://localhost:3000/photography', {reconnect: true});

};


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

  _refresh= async () => {

  console.log("test1");

  this.socket.emit('getMinMaxDates', {key:await SecureStore.getItemAsync('shootSelectedKey'), clientUsername:await SecureStore.getItemAsync('clientSelectedUsername')});

  this.socket.on('gottenMinMaxDates', async(data)=>{

    console.log("test");

    var pickedDatesDataSource=[];
    var inOptions=false;
    if (data.shoot.hasOwnProperty('photographerOptions')) {

      console.log("3")

      var photographerUsername=await SecureStore.getItemAsync('usernameToken');

    var inOptionsElement = data.shoot.photographerOptions.find(function(element) {
      if(element.photographer.username.valueOf()==photographerUsername.valueOf()){
          return true;
          }
        else{
        return false;
        }
          });

          if(inOptionsElement==undefined){
            var inOptions=false;
          }
          else{
            var inOptions=true;

             pickedDatesDataSource=inOptionsElement.dateOptions;

          }

          console.log("inOptions:"+inOptions);
        }

    var shoot=data.shoot;
    var isDateConfirmed=false;

      if (shoot.hasOwnProperty('chosenShootRequestByCoordination')) {

      var isDateConfirmed= data.shoot.chosenShootRequestByCoordination.isDateConfirmed;
      var dateChange=data.shoot.chosenShootRequestByCoordination.clientDateChange;


      if (data.shoot.chosenShootRequestByCoordination.hasOwnProperty('changedDateOptions')) {

        if (data.shoot.chosenShootRequestByCoordination.changedDateOptions!=''&&data.shoot.chosenShootRequestByCoordination.changedDateOptions!=null) {

      var changedDateOptions=data.shoot.chosenShootRequestByCoordination.changedDateOptions;


      console.log("1")

      changedDateOptions[0]["selected"]=false;
      changedDateOptions[1]["selected"]=false;
      changedDateOptions[2]["selected"]=false;

      }
    }
      else{
        var changedDateOptions='';
      }
      console.log("2")
      var photographerConfirmed= data.shoot.chosenShootRequestByCoordination.photographerConfirmed;
      console.log("3")

      console.log("data.shoot.chosenShootRequestByCoordination.photographerConfirmed:"+data.shoot.chosenShootRequestByCoordination.photographerConfirmed);
      console.log("4")

      console.log("photographerConfirmed:"+photographerConfirmed);

      console.log("photographerConfirmed:"+photographerConfirmed);
      var confirmedLocation=data.shoot.chosenShootRequestByCoordination.confirmedLocation;
      var detailsForShoot=data.shoot.chosenShootRequestByCoordination.confirmedDetails;
      var confirmedDate=data.shoot.chosenShootRequestByCoordination.confirmedDate;
    }
    else{
      console.log('no it is not')

        var dateChange=false;
        var changedDateOptions=[];

    }

    console.log("dateChange:"+dateChange);

   this.setState({
     minDate:data.minDate,
     maxDate:data.maxDate,
     detailsForPhotographer:data.shoot.detailsForPhotographers,
     detailsForShoot:detailsForShoot,
     details:data.shoot.detailsForPhotographers,

     dateChange:dateChange,
     dateDataSource:changedDateOptions,
     photographerConfirmed:photographerConfirmed,
     confirmedLocation:confirmedLocation,
     status:data.shoot.status,
     confirmedDate:confirmedDate,
     inOptions:inOptions,
     pickedDatesDataSource:pickedDatesDataSource,
     isDateConfirmed:isDateConfirmed,

   });

   console.log("hello?");

});
};


  async componentDidMount(){

    this.socket.emit('getMinMaxDates', {key:await SecureStore.getItemAsync('shootSelectedKey'), clientUsername:await SecureStore.getItemAsync('clientSelectedUsername')});

    this.socket.on('gottenMinMaxDates', async(data)=>{

      console.log("test");

      var pickedDatesDataSource=[];
      var inOptions=false;
      if (data.shoot.hasOwnProperty('photographerOptions')) {

        console.log("3")

        var photographerUsername=await SecureStore.getItemAsync('usernameToken');

      var inOptionsElement = data.shoot.photographerOptions.find(function(element) {
        if(element.photographer.username.valueOf()==photographerUsername.valueOf()){
            return true;
            }
          else{
          return false;
          }
            });

            if(inOptionsElement==undefined){
              var inOptions=false;
            }
            else{
              var inOptions=true;

               pickedDatesDataSource=inOptionsElement.dateOptions;

            }

            console.log("inOptions:"+inOptions);
          }

      var shoot=data.shoot;
      var isDateConfirmed=false;

        if (shoot.hasOwnProperty('chosenShootRequestByCoordination')) {

        var isDateConfirmed= data.shoot.chosenShootRequestByCoordination.isDateConfirmed;
        var dateChange=data.shoot.chosenShootRequestByCoordination.clientDateChange;


        if (data.shoot.chosenShootRequestByCoordination.hasOwnProperty('changedDateOptions')) {

          if (data.shoot.chosenShootRequestByCoordination.changedDateOptions!=''&&data.shoot.chosenShootRequestByCoordination.changedDateOptions!=null) {

        var changedDateOptions=data.shoot.chosenShootRequestByCoordination.changedDateOptions;


        console.log("1")

        changedDateOptions[0]["selected"]=false;
        changedDateOptions[1]["selected"]=false;
        changedDateOptions[2]["selected"]=false;

        }
      }
        else{
          var changedDateOptions='';
        }
        console.log("2")
        var photographerConfirmed= data.shoot.chosenShootRequestByCoordination.photographerConfirmed;
        console.log("3")

        console.log("data.shoot.chosenShootRequestByCoordination.photographerConfirmed:"+data.shoot.chosenShootRequestByCoordination.photographerConfirmed);
        console.log("4")

        console.log("photographerConfirmed:"+photographerConfirmed);

        console.log("photographerConfirmed:"+photographerConfirmed);
        var confirmedLocation=data.shoot.chosenShootRequestByCoordination.confirmedLocation;
        var detailsForShoot=data.shoot.chosenShootRequestByCoordination.confirmedDetails;
        var confirmedDate=data.shoot.chosenShootRequestByCoordination.confirmedDate;
      }
      else{
        console.log('no it is not')

          var dateChange=false;
          var changedDateOptions=[];

      }

      console.log("dateChange:"+dateChange);

     this.setState({
       minDate:data.minDate,
       maxDate:data.maxDate,
       detailsForPhotographer:data.shoot.detailsForPhotographers,
       detailsForShoot:detailsForShoot,
       details:data.shoot.detailsForPhotographers,
       mediaLink:data.shoot.mediaLink,
       confirmUpload:data.shoot.confirmUpload,


       dateChange:dateChange,
       dateDataSource:changedDateOptions,
       photographerConfirmed:photographerConfirmed,
       confirmedLocation:confirmedLocation,
       status:data.shoot.status,
       confirmedDate:confirmedDate,
       inOptions:inOptions,
       pickedDatesDataSource:pickedDatesDataSource,
       isDateConfirmed:isDateConfirmed,
       cancelDate:data.shoot.cancelDate,

     });

     console.log("hello?");

    });
  }

  _acceptWhenConfirmedDateAndCancel= async () => {

    this.socket.emit('photographerAcceptScheduleShootWithDates', {key:await SecureStore.getItemAsync('shootSelectedKey'), clientUsername:await SecureStore.getItemAsync('clientSelectedUsername'),photographerUsername:await SecureStore.getItemAsync('usernameToken'),selectedDate:this.state.confirmedDate});
    _refresh();

  }


  _accept= async () => {

    if(this.state.dateChange==true && this.state.cancelDate==false){
      if(this.state.selectedDate==''){
        Alert.alert(
              'Select one option at least!'
           )
      }
      else{
        this.socket.emit('photographerAcceptScheduleShootWithDates', {key:await SecureStore.getItemAsync('shootSelectedKey'), clientUsername:await SecureStore.getItemAsync('clientSelectedUsername'),photographerUsername:await SecureStore.getItemAsync('usernameToken'),selectedDate:this.state.selectedDate});

  /*      this.setState({
          status:'The shoot is confirmed!',
          photographerConfirmed:true,
          confirmedDate:selectedDate,
        });*/
      }


    }
    else{

    if(this.state.date1=='' && this.state.date1=='' && this.state.date1=='' ){
      Alert.alert(
            'Fill in one option at least!'
         )
    }
    else{
      var acceptanceKey = Math.random().toString(36).substring(7);
      this.socket.emit('photographerAcceptScheduleShoot', {key:await SecureStore.getItemAsync('shootSelectedKey'), clientUsername:await SecureStore.getItemAsync('clientSelectedUsername'),photographerUsername:await SecureStore.getItemAsync('usernameToken'),option1:this.state.date1,option2:this.state.date2,option3:this.state.date3, acceptanceKey:acceptanceKey});
    }
//  await this.socket.emit('done', {clientUsername:await SecureStore.getItemAsync('clientSelectedUsername'), entity:await SecureStore.getItemAsync('entityToken'), msg:'Schedule Shoot'});
    }
    _refresh();



    };

    _confirmUpload= async () => {

      this.socket.emit('confirmUpload', {key:await SecureStore.getItemAsync('shootSelectedKey'), clientUsername:await SecureStore.getItemAsync('clientSelectedUsername'),photographerUsername:await SecureStore.getItemAsync('usernameToken')});
      this.setState({
        confirmUpload:true,
      });
    }


  _reject= async () => {

    this.socket.emit('photographerRejectScheduleShoot', {key:await SecureStore.getItemAsync('shootSelectedKey'), clientUsername:await SecureStore.getItemAsync('clientSelectedUsername'),photographerUsername:await SecureStore.getItemAsync('usernameToken')});
    this.setState({
      status:'Rejected',
    });

//  await this.socket.emit('done', {clientUsername:await SecureStore.getItemAsync('clientSelectedUsername'), entity:await SecureStore.getItemAsync('entityToken'), msg:'Schedule Shoot'});

  }
  _ViewShootPlan= async () => {

  this.props.navigation.navigate('ShootDeck');

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

  _ViewShootPlan= async () => {

  this.props.navigation.navigate('ShootDeck');

  }

  _openCloseCancel= async () => {
    this.setState({cancellationOpen:!this.state.cancellationOpen});
  }

_cancelShoot= async () => {
  this.socket.emit('photographerCancelShoot', {key:await SecureStore.getItemAsync('shootSelectedKey'), clientUsername:await SecureStore.getItemAsync('clientSelectedUsername'), photographerUsername:await SecureStore.getItemAsync('usernameToken'), reason:this.state.cancellationReason});
  this.setState({cancelled:true});

}

  _changeOrNot() {

    if(this.state.cancelled==true){
      return(
        <View >

        <Text>You cancelled the shoot</Text>

        </View>
      );
    }
    else{

    if(this.state.photographerConfirmed==true){

      if(this.state.confirmUpload==false){
      return(
        <View >

        <View>
            <Text>
            Shoot Done? Upload the photos: {this.state.mediaLink}
            </Text>
        </View>

        <View>
          <Button title="Confirm Photos Are Uploaded" onPress={this._confirmUpload} />
        </View>




        <View>
        <Text>Details For Shoot:{this.state.detailsForShoot}</Text>
          </View>

          <View>
          <Text>Confirmed Date:{this.state.confirmedDate["date"]}</Text>
            </View>

        <View>
            <Text>
            location: {this.state.confirmedLocation["location"]}
            </Text>
        </View>

        <View>
          <Button title="Cancel Shoot" onPress={this._openCloseCancel} />
        </View>

        <Overlay isVisible={this.state.cancellationOpen}>

        <View>
          <Button title="X" onPress={this._openCloseCancel} />
        </View>

        <TextInput
        placeholder="Reason"
          onChangeText={(text) => this.setState({cancellationReason:text})}
          style={styles.input}
          />

          <View>
            <Button title="Confirm Cancellation of Shoot" onPress={this._cancelShoot} />
          </View>

        </Overlay>


        </View>

      )
      }
      else{
        return(
          <View>
              <Text>
              You have uploaded photos here {this.state.mediaLink},thanks!
              </Text>
          </View>
        );
      }
    }

    else{

    if (this.state.dateChange==true && this.state.cancelDate==false) {


      console.log("true?");

        return(
          <View>

          <View>
          <Text>Details For Shoot:{this.state.detailsForShoot}</Text>
            </View>


          <View>
          <Text>
          location: {this.state.confirmedLocation["location"]}
          </Text>
          </View>



          <View>
          </View>



          <View>

          <Text>
          Select one date and time:
          </Text>
          </View>

        <View>
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


        </View>

        <View>
          <Button title="Accept" onPress={this._accept} />
          </View>

          <View>
            <Button title="Reject" onPress={this._reject} />
            </View>
        </View>

      );
  }
  else{

    if(this.state.inOptions==true && this.state.cancelDate==false){

      if(this.state.isDateConfirmed==true){

        return(
          <View>
        <View>
        <Text>Details For Shoot:{this.state.detailsForShoot}</Text>
          </View>

          <View>
          <Text>Date:{this.state.confirmedDate["date"]}</Text>
            </View>

        <View>
            <Text>
            location: {this.state.confirmedLocation["location"]}
            </Text>
        </View>

        <View>
          <Button title="Accept" onPress={this._acceptWhenConfirmedDateAndCancel} />
          </View>

          <View>
            <Button title="Reject" onPress={this._reject} />
            </View>

        </View>
      );

      }
      else{

      return(<View>
      <Text>Waiting on client approval. These are the options you picked.</Text>


      <FlatList
      data={this.state.pickedDatesDataSource}
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

              </View>

          );
        }
      }

    />

      </View>

    );
      }

    }
    else{

    return (
      <View >

      <View>
      <Text>Pick dates and times within the range {this.state.minDate} and {this.state.maxDate}</Text>
        </View>

      <View>
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

          <View >
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

      <View>
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

      <View>
        <Button title="Accept" onPress={this._accept} />
        </View>

        <View>
          <Button title="Reject" onPress={this._reject} />
          </View>

    </View>
  );
  }
}

      }
    }

}


  render() {
    return (
      <View key={this.state.uniqueValue} style={styles.container}>

      <View style={styles.container}>
        <Button title="View Shoot Plan" onPress={this._ViewShootPlan} />
        </View>

      <View>
      <Text>Status:{this.state.status}</Text>
        </View>

        <View>
        <Text>Details For Photographer:{this.state.detailsForPhotographer}</Text>
          </View>


        <View>{this._changeOrNot()}</View>




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
  dateTime: {
    paddingBottom: 25,
    paddingLeft: 25,

    backgroundColor: '#fff',
  },


});
