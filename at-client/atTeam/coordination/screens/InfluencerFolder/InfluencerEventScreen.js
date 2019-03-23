import React from 'react';
import { Alert,Text,ScrollView,FlatList,View,TouchableOpacity, StyleSheet,KeyboardAvoidingView,TextInput, Button} from 'react-native';
import io from 'socket.io-client/dist/socket.io';
import { SecureStore } from 'expo';
import { CheckBox,Overlay } from 'react-native-elements'
import DateTimePicker from 'react-native-modal-datetime-picker';

export default class InfluencerEventScreen extends React.Component {

  constructor(){
    super()

    this.state = {
      influencerEvent:'',
      influencerCampaign:'',
      influencer:'',
      cancellationOpen:false,
      cancellationReason:'',
      linkToPost:'',

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
      };

    this.socket=io.connect('http://localhost:3000/influencer', {reconnect: true});

};

async componentDidMount(){
  this.props.navigation.addListener('willFocus', (payload) => {
    const influencerEvent =  this.props.navigation.getParam('influencerEvent','');
    console.log("influencerEvent.influencer.fullName:"+influencerEvent.influencer.fullName)
    this.setState({
      influencerEvent:influencerEvent,
      influencer:influencerEvent["influencer"],
      }
    );
  })

  this.socket.emit('getInfluencerCampaign', {key:await SecureStore.getItemAsync('influencerCampaignSelectedKey'),clientUsername:await SecureStore.getItemAsync('clientSelectedUsername')});

  this.socket.on('gottenInfluencerCampaign', async(data)=>{

    this.setState({
      influencerCampaign:data,
          }
        )
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

    _goToInfluencerProfile=async () => {
      this.props.navigation.navigate('InfluencerProfile',{_id:this.state.influencer._id});
        }



    _filterDate = async (item) => {
      if(this.state.previousSelected==item){
      }
      else{
      item.selected=true;
      console.log(item.selected);
      this.state.previousSelected.selected=false;
      var a= this.state.selected;
      a+="add";
      this.setState({selected:a});
      this.setState({previousSelected:item});

      }
    }

    _openCloseCancel= async () => {
      this.setState({cancellationOpen:!this.state.cancellationOpen});
    }


    _cancel= async () => {

         var campaign=this.state.influencerCampaign;
         var event=this.state.influencerEvent;


         var eventFound = campaign.influencerEvent.find(function(element) {
          if(element.key.valueOf()==event.key.valueOf()){
              return element;
                    }
              });

        var index = campaign.influencerEvent.indexOf(eventFound);

        event.clientCancelled=true;
        event.clientReasonForCancellation=this.state.cancellationReason;

        campaign.influencerEvent[index]=event;

        this.setState({influencerCampaign:campaign,cancellationOpen:false});

        this.socket.emit('editInfluencerCampaign', {key:await SecureStore.getItemAsync('influencerCampaignSelectedKey'),clientUsername:await SecureStore.getItemAsync('clientSelectedUsername'),influencerCampaign:campaign});

          }



    _approve= async () => {

      if(this.state.influencerEvent.dateOptions!='' && this.state.previousSelected==''){
      Alert.alert(
            'Pick a date first'
         )
       }
       else{

         var campaign=this.state.influencerCampaign;
         var event=this.state.influencerEvent;
         console.log("event:"+Object.keys(event));

         var eventFound = campaign.influencerEvent.find(function(element) {
          if(element.key.valueOf()==event.key.valueOf()){
              return element;
                    }
              });

        var index = campaign.influencerEvent.indexOf(eventFound);
        console.log("index:"+index);

        event["clientApproved"]=true;
        event["dateSelected"]=this.state.previousSelected;

        campaign.influencerEvent[index]=event;
        console.log("..cli:"+campaign.influencerEvent[index]["clientApproved"])

        this.setState({influencerCampaign:campaign});

        this.socket.emit('editInfluencerCampaign', {key:await SecureStore.getItemAsync('influencerCampaignSelectedKey'),clientUsername:await SecureStore.getItemAsync('clientSelectedUsername'),influencerCampaign:campaign,index:index});

          }

    }

    _sendUploadNotification= async () => {

      if(this.state.influencerEvent.linkToPost==''){
      Alert.alert(
            'Upload a link to the post first'
         )
       }
       else{

         var campaign=this.state.influencerCampaign;
         var event=this.state.influencerEvent;

         var eventFound = campaign.influencerEvent.find(function(element) {
          if(element.key.valueOf()==event.key.valueOf()){
              return element;
                    }
              });

        var index = campaign.influencerEvent.indexOf(eventFound);

        event["linkToPost"]=this.state.linkToPost;

        event["postUploaded"]=true;

        campaign.influencerEvent[index]=event;

        this.setState({influencerCampaign:campaign});

        this.socket.emit('editInfluencerCampaign', {key:await SecureStore.getItemAsync('influencerCampaignSelectedKey'),clientUsername:await SecureStore.getItemAsync('clientSelectedUsername'),influencerCampaign:campaign,index:index});

          }

    }

    _deleteEvent= async () => {
      var campaign=this.state.influencerCampaign;
      var event=this.state.influencerEvent;

      var eventFound = campaign.influencerEvent.find(function(element) {
       if(element.key.valueOf()==event.key.valueOf()){
           return element;
                 }
           });

     var index = campaign.influencerEvent.indexOf(eventFound);
      campaign.influencerEvent.splice(index, 1);

      this.setState({influencerCampaign:campaign});

      this.socket.emit('editInfluencerCampaign', {key:await SecureStore.getItemAsync('influencerCampaignSelectedKey'),clientUsername:await SecureStore.getItemAsync('clientSelectedUsername'),influencerCampaign:campaign,index:index,justDeleted:true, event:event});



    };

    _updateEventAndSend= async () => {

               var campaign=this.state.influencerCampaign;
               var event=this.state.influencerEvent;

               var eventFound = campaign.influencerEvent.find(function(element) {
                if(element.key.valueOf()==event.key.valueOf()){
                    return element;
                          }
                    });

              var index = campaign.influencerEvent.indexOf(eventFound);

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

      if(dateOptions!=[]){
        event["dateOptions"]=dateOptions;
      }
      if(this.state.influencerCost!=''){
      event["influencerCost"]=this.state.influencerCost;
      }
      if(this.state.additionalDetails!=''){
      event["additionalDetails"]=this.state.additionalDetails;
      }

      if(this.state.location!=''){
      event["location"]=this.state.location;
      }

      if(this.state.product!=''){
      event["product"]=this.state.product;
      }

      event["clientCancelled"]=false;

      campaign.influencerEvent[index]=event;


      this.setState({influencerCampaign:campaign,influencerEvent:event});

      this.socket.emit('editInfluencerCampaign', {key:await SecureStore.getItemAsync('influencerCampaignSelectedKey'),clientUsername:await SecureStore.getItemAsync('clientSelectedUsername'),influencerCampaign:campaign,index:index});


    }


    dependentOnStatus(){

      if(this.state.influencerEvent.clientCancelled==true){
        return(
          <View>
          <View>
          <Text> client cancelled because: {this.state.influencerEvent["clientReasonForCancellation"]} </Text>
          </View>

          <View>
          <Button title="Update Details and Resend To Client" onPress={()=> this._updateEventAndSend()} />
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




          </View>



            );
      }

      if(this.state.influencerEvent.postUploaded==true){
        return(
          <View>
          <Text> Link to post: {this.state.influencerEvent["linkToPost"]} </Text>
          </View>

            );
      }
      else{

      if(this.state.influencerEvent.clientApproved==true){
        return(
          <View>
          <TextInput
              placeholder="Link To Post"
                onChangeText={(text) => this.setState({linkToPost:text})}
                style={styles.input}
                />

              <View>
              <Button title="Upload ScreenShots" onPress={()=> this._uploadScreenShots()} />
              </View>

              <View>
              <Button title="Send Upload Notification" onPress={()=> this._sendUploadNotification()} />
              </View>

              <View>
              <Text> Selected Date: {this.state.influencerEvent["dateSelected"]["date"]} </Text>
              </View>

          </View>

            );
          }

          else{
            return(
              <View>

              <FlatList
              data={this.state.influencerEvent["dateOptions"]}
              extraData={this.state}

              renderItem={({item}) =>

              {
                  return (

                      <View style={styles.clientContainer}>

                      <View style={styles.listText}>

                        <Text>
                        {item["date"]}
                        </Text>
                        </View>

                      </View>

                  );
                }
              }

            />


              <View>
                          <Button title="Cancel" onPress={()=> this._openCloseCancel()} />
                          </View>

                          <View>
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
                              <Button title="Confirm Cancellation" onPress={this._cancel} />
                            </View>

                          </Overlay>
                          </View>

              </View>

                );

          }
        }
        }


    render() {
      return (
        <View style={styles.container}>

        <View>
        <Button title="View Influencer Profile" onPress={()=> this._goToInfluencerProfile()} />
        </View>

        <View>
        <Text>{this.state.influencer["fullName"]}</Text>
        </View>



        <View>
        {this.dependentOnStatus()}
        </View>

        <View>
        <Button title="Delete Event" onPress={()=> this._deleteEvent()} />
        </View>


        <View>

              <Text> Location:{this.state.influencerEvent.location} </Text>
              <Text> product:{this.state.influencerEvent.product} </Text>
              <Text> influencerCost:{this.state.influencerEvent.influencerCost} </Text>
              <Text> additionalDetails:{this.state.influencerEvent.additionalDetails} </Text>
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
