import React from 'react';
import { Alert,Text,ScrollView,FlatList,View,TouchableOpacity, StyleSheet,KeyboardAvoidingView,TextInput, Button} from 'react-native';
import io from 'socket.io-client/dist/socket.io';
import { SecureStore } from 'expo';
import { CheckBox,Overlay } from 'react-native-elements'

export default class InfluencerEventScreen extends React.Component {

  constructor(){
    super()

    this.state = {
      influencerEvent:'',
      influencerCampaign:'',
      influencer:'',
      selected:'',
      previousSelected:'',
      cancellationOpen:false,
      cancellationReason:'',


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



    dependentOnStatus(){

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

          <View>
          <Text> Once the influencer posts, their posts will show up here </Text>
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

              <View>
              <Text>The client has to pick from the following dates: </Text>
              </View>


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

              <Text> Location:{this.state.influencerEvent.location} </Text>
              <Text> product:{this.state.influencerEvent.product} </Text>
              <Text> influencerCost:{this.state.influencerEvent.influencerCost} </Text>
              <Text> additionalDetails:{this.state.influencerEvent.additionalDetails} </Text>
              </View>

              <View>
              {this.dependentOnStatus()}
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
