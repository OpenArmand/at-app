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
      budget:'',
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

      _sendToCore= async () => {

        if (this.state.budget==''){
          Alert.alert(
                'input the budget!'
             )
             return false;
        }

      await this.socket.emit('sendToCore', {key:await SecureStore.getItemAsync('adSelectedKey'),clientUsername:await SecureStore.getItemAsync('clientSelectedUsername'),budget:this.state.budget});

      }

      _sendDataToCore= async () => {

      await this.socket.emit('sendDataToCore', {key:await SecureStore.getItemAsync('adSelectedKey'),clientUsername:await SecureStore.getItemAsync('clientSelectedUsername'),budget:this.state.budget});

      }


  action(){

    if(this.state.adSet.adDone==false){

    if(this.state.adSet.contentCreatorDone==true){
      return(
      <View style={styles.container}>
      <View>
      <TextInput
      placeholder="budget"
        onChangeText={(text) => this.setState({budget:text})}

        style={styles.input}
        />

    </View>

      <View>
      <Button title="Send to Core" onPress={()=> this._sendToCore()} />
      </View>

      </View>

    );
    }
  }
  else{
    if(this.state.adSet.adDataDone==false){
    if(this.state.adSet.clientApproval==true){
      return(
      <View>
      <Button title="Send Performance Data to Core" onPress={()=> this._sendDataToCore()} />
      </View>
      )
    }
  }
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
