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
      clientConclusion:'',
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

      _approveAdSet= async () => {

      await this.socket.emit('clientApproveAdSet', {key:await SecureStore.getItemAsync('adSelectedKey'),clientUsername:await SecureStore.getItemAsync('clientSelectedUsername')});

      }

      _conclude= async () => {

      await this.socket.emit('clientConclusion', {key:await SecureStore.getItemAsync('adSelectedKey'),clientUsername:await SecureStore.getItemAsync('clientSelectedUsername'), clientConclusion:this.state.clientConclusion});

      }


  action(){

    if(this.state.adSet.clientApproval==false){

    if(this.state.adSet.coreApproval==true){

    if(this.state.adSet.adDone==true){

    if(this.state.adSet.contentCreatorDone==true){
      return(
      <View style={styles.container}>

      <View>
      <Button title="Approve Ad Set" onPress={()=> this._approveAdSet()} />
      </View>

      </View>

    );
    }
  }
}
}

else{

  if(this.state.adSet.clientConclusionDone==false){
  if(this.state.adSet.coreConclusionDone==true){
    if(this.state.adSet.adDataDone==true){
      return(

        <View style={styles.container}>
        <View>
        <TextInput
        placeholder="Client Conclusion"
          onChangeText={(text) => this.setState({clientConclusion:text})}

          style={styles.input}
          />

      </View>

        <View>
        <Button title="Send Conclusion to client" onPress={()=> this._conclude()} />
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
