import React from 'react';
import { Alert,Text,ScrollView,FlatList,View,TouchableOpacity, StyleSheet,KeyboardAvoidingView,TextInput, Button} from 'react-native';
import io from 'socket.io-client/dist/socket.io';
import { SecureStore } from 'expo';

export default class MediaScreen extends React.Component {
  static navigationOptions = {
    header: null,
    drawerLabel: 'Ads',
  };


  constructor(){
    super()

    this.state = {
      adSet:'',
      };

    this.socket=io.connect('http://localhost:3000/ad', {reconnect: true});

};


async componentDidMount(){

      var clientSelectedUsername=await SecureStore.getItemAsync('clientSelectedUsername');
      this.socket.emit('requestAdSet', {key:await SecureStore.getItemAsync('adSelectedKey'),clientUsername:await SecureStore.getItemAsync('clientSelectedUsername')});

      this.socket.on('gottenAdSet', async(data)=>{
        console.log("data.adSet"+data.adSet);


        console.log("data cc:"+data.adSet.contentCreatorDone);
        this.setState({
          adSet:data.adSet,
          }
        )
      });
    }

      _sendToAdTeam= async () => {

      await this.socket.emit('sendToAd', {key:await SecureStore.getItemAsync('adSelectedKey'),clientUsername:await SecureStore.getItemAsync('clientSelectedUsername')});

      }


  action(){

    if(this.state.adSet.contentCreatorDone==false){
      return(
      <View style={styles.container}>
      <Button title="Send to Ad Team" onPress={()=> this._sendToAdTeam()} />
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
