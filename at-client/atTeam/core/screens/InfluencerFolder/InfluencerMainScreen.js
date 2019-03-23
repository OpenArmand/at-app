import React from 'react';
import { Alert,Text,ScrollView,FlatList,View,TouchableOpacity, StyleSheet,KeyboardAvoidingView,TextInput, Button} from 'react-native';
import io from 'socket.io-client/dist/socket.io';
import { SecureStore } from 'expo';


export default class InfluencerMainScreen extends React.Component {


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
        )
      });
    }


_goToInfluencerPlan= async () => {
  this.props.navigation.navigate('Plan');
    }


    _eventDetails= async (item) => {
      this.props.navigation.navigate('Event',{influencerEvent:item});

        }


influencerPlan(){
  if(this.state.influencerCampaign.influencerPlan!=undefined){
    return(
      <View>
      <Button title="View Influencer Plan" onPress={()=> this._goToInfluencerPlan()} />
      </View>
            )
          }
        }


    render() {
      return (
        <View style={styles.container}>

        <View>

        {this.influencerPlan()}

        </View>

        <View>
        <FlatList
        data={this.state.influencerCampaign.influencerEvent}
        extraData={this.state}
        renderItem={({item}) =>

        {
            return (

                <View style={styles.clientContainer}>

                <View style={styles.listText}>

                  <Text>
                  {item.influencer.fullName}
                  </Text>
                  </View>

                  <View>
                  <Button title="See Event Details" onPress={()=> this._eventDetails(item)} />
                </View>

                </View>

            );
          }
        }

      />

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
