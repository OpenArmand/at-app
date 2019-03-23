import React from 'react';
import { Alert,Text,ScrollView,FlatList,View,TouchableOpacity, StyleSheet,KeyboardAvoidingView,TextInput, Button} from 'react-native';
import io from 'socket.io-client/dist/socket.io';
import { SecureStore } from 'expo';

export default class CreateInfluencerScreen extends React.Component {

  constructor(){
    super()

    this.state = {
      fullName:'',
      image:'',
      };

    this.socket=io.connect('http://localhost:3000/influencer', {reconnect: true});

};

_createInfluencer= async () => {

  if(this.state.fullName==''||this.state.fullName==undefined){
  Alert.alert(
        'Add a full name first!'
     )
   }

   else{

     var influencer={fullName:this.state.fullName, image:this.state.image};

     console.log("heloz")

    this.socket.emit('createInfluencer',influencer);

      }
    }

    render() {
      return (
        <View style={styles.container}>

        <View>

        <TextInput
        placeholder="fullName"
          onChangeText={(text) => this.setState({fullName:text})}
          style={styles.input}
          />

        </View>

        <View>

        <Button title="Create Influencer" onPress={()=> this._createInfluencer()} />

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
