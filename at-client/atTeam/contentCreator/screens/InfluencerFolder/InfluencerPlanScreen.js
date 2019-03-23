import React from 'react';
import { Alert,Text,ScrollView,FlatList,View,TouchableOpacity, StyleSheet,KeyboardAvoidingView,TextInput, Button} from 'react-native';
import io from 'socket.io-client/dist/socket.io';
import { SecureStore } from 'expo';


export default class InfluencerPlanScreen extends React.Component {


  constructor(){
    super()

    this.state = {
      influencerCampaign:'',
      };

    this.socket=io.connect('http://localhost:3000/influencer', {reconnect: true});

  };

  async componentDidMount(){

        var clientSelectedUsername=await SecureStore.getItemAsync('clientSelectedUsername');
        this.socket.emit('getInfluencerCampaign', {key:await SecureStore.getItemAsync('influencerCampaignSelectedKey'),clientUsername:await SecureStore.getItemAsync('clientSelectedUsername')});

        this.socket.on('gottenInfluencerCampaign', async(data)=>{

          console.log("sendTo:");

          console.log("sendTo:"+ data["influencerPlan"]);

          this.setState({
            influencerCampaign:data,
            }
          );
        });
      }


      _sendToCoordination= async () => {

      var influencerCampaign=this.state.influencerCampaign;

      influencerCampaign["influencerPlan"]= {contentCreatorSendsToCoordination:true};

      console.log("  influencerCampaign['influencerPlan'][contentCreatorSendsToCoordination]:"+  influencerCampaign["influencerPlan"]["contentCreatorSendsToCoordination"]);

      await this.setState({
          influencerCampaign:influencerCampaign,
          }
        );

        this.socket.emit('editInfluencerCampaign', {key:await SecureStore.getItemAsync('influencerCampaignSelectedKey'),clientUsername:await SecureStore.getItemAsync('clientSelectedUsername'),influencerCampaign:this.state.influencerCampaign});



      }



      action(){
        if(this.state.influencerCampaign.influencerPlan==undefined || this.state.influencerCampaign.influencerPlan.contentCreatorSendsToCoordination==false){
          return(
            <View>
            <Button title="Send to Coordination Team" onPress={()=> this._sendToCoordination()} />

            </View>

          );
        }
      }


          render() {
            return (
              <View style={styles.container}>

              <View>

              {this.action()}

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
