import React from 'react';
import { Alert,Text,ScrollView,FlatList,View,TouchableOpacity, StyleSheet,KeyboardAvoidingView,TextInput, Button} from 'react-native';
import io from 'socket.io-client/dist/socket.io';
import { SecureStore } from 'expo';
import DateTimePicker from 'react-native-modal-datetime-picker';

export default class CreateEventScreen extends React.Component {

  constructor(){
    super()

    this.state = {
      influencer:'',
      date1:'',
      date2:'',
      date3:'',

      isDateTimePickerVisible1: false,
      isDateTimePickerVisible2: false,
      isDateTimePickerVisible3: false,
      location:'',
      product:'',
      influencerCost:'',
      additionalDetails:'',
      influencerCampaign:'',
      };

    this.socket=io.connect('http://localhost:3000/influencer', {reconnect: true});

};

async componentDidMount(){


  this.props.navigation.addListener('willFocus', (payload) => {
    const influencer =  this.props.navigation.getParam('influencer','');
    this.setState({
      influencer:influencer,
      }
    );
  })

      var clientSelectedUsername=await SecureStore.getItemAsync('clientSelectedUsername');
      this.socket.emit('getInfluencerCampaign', {key:await SecureStore.getItemAsync('influencerCampaignSelectedKey'),clientUsername:await SecureStore.getItemAsync('clientSelectedUsername')});

      this.socket.on('gottenInfluencerCampaign', async(data)=>{

        this.setState({
          influencerCampaign:data,
          }
        );
      });
    }



        _showDateTimePicker1 = () => this.setState({ isDateTimePickerVisible1: true });
        _showDateTimePicker2 = () => this.setState({ isDateTimePickerVisible2: true });
        _showDateTimePicker3 = () => this.setState({ isDateTimePickerVisible3: true });


          _hideDateTimePicker1 = () => this.setState({ isDateTimePickerVisible1: false });
          _hideDateTimePicker2 = () => this.setState({ isDateTimePickerVisible2: false });
          _hideDateTimePicker3 = () => this.setState({ isDateTimePickerVisible3: false });


            _handleDatePicked1 = (date) => {

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


_goToInfluencerBank= async () => {
  this.props.navigation.navigate('Bank');
    }

_goToInfluencerProfile=async () => {
  this.props.navigation.navigate('InfluencerProfile',{_id:this.state.influencer._id});
    }

_sendEventToClient= async () => {

  if(this.state.influencer==''){
  Alert.alert(
        'Add an influencer first!'
     )
   }
   else{


  var influencerCampaign=this.state.influencerCampaign;

  var eventKey = Math.random().toString(36).substring(7);

  var eventObj={key:eventKey};

  var dateOptions=[];

  if(this.state.date1!=''){
    var dateKey = Math.random().toString(36).substring(7);
    dateOptions.push({key:dateKey,date:this.state.date1});

  }

  if(this.state.date2!=''){
    var dateKey = Math.random().toString(36).substring(7);
    dateOptions.push({key:dateKey,date:this.state.date2});
  }

  if(this.state.date3!=''){
    var dateKey = Math.random().toString(36).substring(7);
    dateOptions.push({key:dateKey,date:this.state.date3});
  }

  eventObj["dateOptions"]=dateOptions;
  eventObj["influencerCost"]=this.state.influencerCost;
  eventObj["additionalDetails"]=this.state.additionalDetails;
  eventObj["location"]=this.state.location;
  eventObj["product"]=this.state.product;
  eventObj["influencer"]=this.state.influencer;

  if(influencerCampaign["influencerEvent"]==undefined||influencerCampaign["influencerEvent"]==[]){
    console.log("influencerCampaign.influencerEvent:"+influencerCampaign.influencerEvent)
    console.log("influencerCampaign:"+influencerCampaign)

    influencerCampaign.influencerEvent=[eventObj];
    console.log("influencerCampaign.influencerEvent:"+influencerCampaign.influencerEvent)

  }
  else{

    influencerCampaign["influencerEvent"].push(eventObj);
  }

  await this.setState({
      influencerCampaign:influencerCampaign,
      }
    );

    console.log("influencerCampaign"+influencerCampaign);


    this.socket.emit('editInfluencerCampaign', {key:await SecureStore.getItemAsync('influencerCampaignSelectedKey'),clientUsername:await SecureStore.getItemAsync('clientSelectedUsername'),influencerCampaign:influencerCampaign});

      }
    }


    influencerAssigned(){
      if(this.state.influencer==''){
        return(
          <View>
          <Button title="Assign Influencer" onPress={()=> this._goToInfluencerBank()} />
          </View>
        );
      }
      else{
        return(
          <View>
            <View>
            <Button title="View Influencer Profile" onPress={()=> this._goToInfluencerProfile()} />
            </View>

            <View>
            <Text>{this.state.influencer.fullName}</Text>
            </View>

        </View>
        );
      }
    }


    render() {
      return (
        <View style={styles.container}>

        <View>
        {this.influencerAssigned()}
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


              <TextInput
              placeholder="location"
                onChangeText={(text) => this.setState({location:text})}
                style={styles.input}
                />

                <TextInput
                placeholder="product"
                  onChangeText={(text) => this.setState({product:text})}
                  style={styles.input}
                  />


                  <TextInput
                  placeholder="influencer cost"
                    onChangeText={(text) => this.setState({influencerCost:text})}
                    style={styles.input}
                    />

                    <TextInput
                    placeholder="additional details"
                      onChangeText={(text) => this.setState({additionalDetails:text})}
                      style={styles.input}
                      />


                      <View>
                      <Button title="Send Details To Client" onPress={()=> this._sendEventToClient()} />
                      </View>

    </View>
      );

    }
  }

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#fff',
    },
  });
