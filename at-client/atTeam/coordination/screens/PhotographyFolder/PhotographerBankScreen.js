import React from 'react';
import { Button,Alert,Text,ScrollView,FlatList,View,TouchableOpacity, StyleSheet,KeyboardAvoidingView,TextInput} from 'react-native';
import io from 'socket.io-client/dist/socket.io';
import { SecureStore } from 'expo';
import { CheckBox } from 'react-native-elements'
import DateTimePicker from 'react-native-modal-datetime-picker';


export default class PhotographerBankScreen extends React.Component {

  constructor(){
    super()
    this.state={
      dataSource:[],
      shortListedPhotographers:[],
      clientUsername:'',
      minDate:'',
      maxDate:'',
      isMinDateTimePickerVisible: false,
      isMaxDateTimePickerVisible: false,
      details:'',
      duration:'',
      dateChange:false,
      mediaLink:'',
      shootPlanApproved:false,
      cancelDate:false,

    }

  this.socket=io.connect('http://localhost:3000/photography', {reconnect: true});

  }

  _showMinDateTimePicker = () => this.setState({ isMinDateTimePickerVisible: true });
  _showMaxDateTimePicker = () => this.setState({ isMaxDateTimePickerVisible: true });

    _hideMinDateTimePicker = () => this.setState({ isMinDateTimePickerVisible: false });
    _hideMaxDateTimePicker = () => this.setState({ isMaxDateTimePickerVisible: false });



    _handleDatePickedMax = async(date) => {
      var IndiaDateToday=date.toLocaleDateString('en-US', {timeZone: "Asia/Kolkata"}); //1/27/2019
      this.setState({maxDate:IndiaDateToday});
      this._hideMaxDateTimePicker();
    };

    _handleDatePickedMin = async (date) => {
      var IndiaDateToday=date.toLocaleDateString('en-US', {timeZone: "Asia/Kolkata"}); //1/27/2019
      this.setState({minDate:IndiaDateToday});
      this._hideMinDateTimePicker();
    };



  async componentDidMount(){

        var clientSelectedUsername=await SecureStore.getItemAsync('clientSelectedUsername');
        this.socket.emit('requestAllClientPhotographers',{clientUsername:await SecureStore.getItemAsync('clientSelectedUsername'),key:await SecureStore.getItemAsync('shootSelectedKey')});
        this.socket.on('gottenAllClientPhotographers', async(data)=>{

          var shootPlanApproved=data.shoot.shootPlanApproved;
          var mediaLink=data.shoot.mediaLink;
          var minDate=data.shoot.minDate;
          var maxDate=data.shoot.maxDate;
          var details=data.shoot.details;
          var duration=data.shoot.duration;
          var cancelDate= data.cancelDate;

          if('chosenShootRequestByCoordination' in data.shoot){
            var dateChange=data.shoot.chosenShootRequestByCoordination.clientDateChange;

          }
          else{
              var dateChange=false;
              var mediaLink='';
              var minDate='';
              var maxDate='';
              var details='';
              var duration='';


          }
             this.setState({
               dataSource:data.photographers,
               clientUsername:clientSelectedUsername,
               dateChange:dateChange,
               mediaLink:mediaLink,
                minDate:minDate,
                maxDate:maxDate,
                details:details,
                duration:duration,
                shootPlanApproved:shootPlanApproved,
                cancelDate:cancelDate,
             });

           });
        }

        _filter = async (item) => {

          var shortListedPhotographersArr=this.state.shortListedPhotographers;
          var selectedItemIndex= shortListedPhotographersArr.indexOf(item);
          var dataSourceArr=this.state.dataSource;
          var datasourceItemIndex=dataSourceArr.indexOf(item);

       if(selectedItemIndex>-1){

          //if already selected
          shortListedPhotographersArr.splice(selectedItemIndex, 1);
          dataSourceArr[datasourceItemIndex]["selected"]=false;
        }
        else{
          console.log("item:"+item);

      shortListedPhotographersArr.push(item);
      dataSourceArr[datasourceItemIndex]["selected"]=true;
        }

        this.setState({shortListedPhotographers:shortListedPhotographersArr,dataSource:dataSourceArr});

      }

      _photographerProfile= async (item) => {
        console.log("helo?")

      this.props.navigation.navigate('PhotographerProfile',{photographerProfile:item.profile});

      }

_invitePhotographersWithClientDates= async () =>{
  console.log(this.state.shortListedPhotographers);

  this.socket.emit('invitePhotographersWithClientDates',{shortListedPhotographers:this.state.shortListedPhotographers, clientUsername:await SecureStore.getItemAsync('clientSelectedUsername'),key:await SecureStore.getItemAsync('shootSelectedKey'),details:this.state.detail});

    }


      _invitePhotographers = async () =>{

        console.log("this.state.shootPlanApproved:"+this.state.shootPlanApproved);

        console.log(this.state.shortListedPhotographers);
        if(this.state.minDate!='' && this.state.maxDate!='' && this.state.maxDate!='' && this.state.duration!='' && this.state.shortListedPhotographers.length!=0){
          if(this.state.shootPlanApproved==true){
            this.socket.emit('invitePhotographers',{shortListedPhotographers:this.state.shortListedPhotographers, clientUsername:await SecureStore.getItemAsync('clientSelectedUsername'),mediaLink:this.state.mediaLink,key:await SecureStore.getItemAsync('shootSelectedKey'),minDate:this.state.minDate, maxDate:this.state.maxDate,details:this.state.details, duration:this.state.duration});

                    this.socket.on('PhotographerInvitedMsg', function(data){
                      console.log(data);
                      alert(data);
                    });
          }
          else{
            Alert.alert(
                  'Shoot Plan needs approval first!'
               )
          }


                }
                else{
                  Alert.alert(
                        'Duration,Media Link,Min date and Max date need to be set and at least one photographer must be picked.'
                     )
                }
          }



          action() {
            if (this.state.dateChange==true && this.state.cancelDate==false) {

                return(

                <View>
                  <Button title="Invite Photographers With Confirmed Date Known" onPress={this._invitePhotographersWithClientDates} />
                </View>

              );

          }
          else{
            return (
              <View>
              <View>
              <TextInput
              placeholder="Duration"
                onChangeText={(text) => this.setState({duration:text})}
                style={styles.input}
                />
                </View>


                <View>
                <TextInput
                placeholder="Media Link"
                  onChangeText={(text) => this.setState({mediaLink:text})}
                  style={styles.input}
                  />
                  </View>

              <View >
            <TouchableOpacity onPress={this._showMinDateTimePicker}>
              <Text>Minimum Date: {this.state.minDate}</Text>
            </TouchableOpacity>
            <DateTimePicker
            mode='date'
              isVisible={this.state.isMinDateTimePickerVisible}
              onConfirm={this._handleDatePickedMin}
              onCancel={this._hideMinDateTimePicker}
            />
          </View>

          <View >
          <TouchableOpacity onPress={this._showMaxDateTimePicker}>
          <Text>Maximum Date:{this.state.maxDate}</Text>
          </TouchableOpacity>
          <DateTimePicker
          mode='date'
          isVisible={this.state.isMaxDateTimePickerVisible}
          onConfirm={this._handleDatePickedMax}
          onCancel={this._hideMaxDateTimePicker}
          />
          </View>

            <View>
              <Button title="Invite Photographers" onPress={this._invitePhotographers} />
            </View>

            </View>

          );
          }
        }

        shootPlan(){
          if(this.state.shootPlanApproved==true){
            return(
              <View>
                <Text> Shoot plan is approved</Text>
              </View>
            )
          }
          else{
            return(
              <View>
                <Text> Shoot plan is not approved, wait for it to be and then send the invites! </Text>
              </View>

            )
          }
        }


    render() {
      return (
      <View >
          <View >
      <Text> Use this page to configure {this.state.clientUsername} here</Text>
          </View>

        <View>
      <Text>Assign Photographers</Text>
      </View>

      <View>
             <FlatList
             data={this.state.dataSource}
             extraData={this.state}
             renderItem={({item}) =>

             {
                 return (

                     <View style={styles.clientContainer}>

                     <View style={styles.listText}>

                       <Text>
                       {item.username}
                       </Text>

                       </View>

                       <View style={styles.listText}>

                         <Text>
                         {item.firstName} {item.lastName}
                         </Text>

                         </View>

                         <View>
                           <Button title="View Photographer Profile" onPress={()=>this._photographerProfile(item)} />
                           </View>

                     <View>

                     <CheckBox
                       title='Select'
                       checked={item.selected}
                       onPress={() => this._filter(item)}
                     />
                     </View>

                     <View>

                     <CheckBox
                       title='Invited'
                       checked={item.invited}
                     />
                     </View>

                     <View>

                     <CheckBox
                       title='Invited with Dates'
                       checked={item.invitedWithDatesKnown}
                     />
                     </View>

                     </View>

                 );
               }
             }

           />

          </View>



          <TextInput
          placeholder="Additional details"
            onChangeText={(text) => this.setState({details:text})}
            style={styles.input}
            />


      <View >

      {this.action()}
      </View>

      <View >

      {this.shootPlan()}
      </View>


        </View>




            )

          }


      };



      const styles = StyleSheet.create({
        container: {
          alignItems: 'center',
          backgroundColor: '#fff',
        },
        assignContainer: {
          alignItems: 'center',
          flex: 1,
          backgroundColor: '#fff',
        },
        configure:{
          backgroundColor: '#fff',

        },
        assignPhotographer:{
          paddingBottom:10
        },
        assignphotographer: {
          paddingBottom:10

        },
        buttonContainer:{
          backgroundColor:'#000000',

        },
        buttonText:{
          textAlign:'center',
          color: '#FFFFFF',
          fontWeight:'700',
        },
      });
