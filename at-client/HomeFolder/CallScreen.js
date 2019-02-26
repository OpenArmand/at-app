import React from 'react';
import { Text,ScrollView, StyleSheet, View, Button } from 'react-native';
import io from 'socket.io-client/dist/socket.io';
import { SecureStore } from 'expo';


export default class CallScreen extends React.Component {
  static navigationOptions = {
    title: 'Call',
  };

  constructor(){
    super()
    this.state={
    }

    this.socket=io.connect('http://localhost:3000/call', {reconnect: true});

};


  _doneCall= async () => {

  await this.socket.emit('doneCall', {clientUsername:await SecureStore.getItemAsync('clientSelectedUsername'), entity:await SecureStore.getItemAsync('entityToken')});
  this.props.navigation.navigate('Drawer');

  }


  render() {
    return (
      <View style={styles.container}>
        <Button title="Done with Call" onPress={this._doneCall} />
        </View>
    );
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 25,
    backgroundColor: '#fff',
  },
});
