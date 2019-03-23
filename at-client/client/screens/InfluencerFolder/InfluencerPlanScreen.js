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

          this.setState({
            influencerCampaign:data,
            }
          );
        });
      }


      _clientApproval= async () => {

      var influencerCampaign=this.state.influencerCampaign;

      influencerCampaign.influencerPlan["clientApproved"]=true;

      await this.setState({
          influencerCampaign:influencerCampaign,
          }
        );

        this.socket.emit('editInfluencerCampaign', {key:await SecureStore.getItemAsync('influencerCampaignSelectedKey'),clientUsername:await SecureStore.getItemAsync('clientSelectedUsername'),influencerCampaign:this.state.influencerCampaign});


      }



      action(){
        if(this.state.influencerCampaign.influencerPlan==undefined || this.state.influencerCampaign.influencerPlan.clientApproved==false){
          return(
            <View>
            <Button title="approve influencer plan" onPress={()=> this._clientApproval()} />

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
