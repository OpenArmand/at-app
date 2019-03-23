import React from 'react';
import { Button,Text,ScrollView,FlatList,View, StyleSheet, TouchableOpacity } from 'react-native';
import io from 'socket.io-client/dist/socket.io';
import { SecureStore } from 'expo';
import { CheckBox } from 'react-native-elements'


export default class ActivityScreen extends React.Component {
  constructor(){
    super()
    this.state={
      dataSource:[],

    }

  this.socket=io.connect('http://localhost:3000/activity', {reconnect: true});

  }

  async componentDidMount(){

    this.socket.emit('requestAllActivity', await SecureStore.getItemAsync('clientSelectedUsername'));

    this.socket.on('gottenAllActivity', async(data)=>{

      this.setState({dataSource:data});
      console.log(data);

    });


  }




    render() {
      return (
        <View>
        <FlatList
        data={this.state.dataSource}
        renderItem={({item}) =>

        {
            return (


                <View style={styles.listText}>

                  <Text>
                  {item.msg}
                  </Text>

                </View>


            );
          }
        }

      />


      </View>


      );
    }
  };

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15,
    backgroundColor: '#fff',
  },
  clientContainer:{
    flex: 1,
    paddingTop: 15,
    flexDirection: 'row'
  },
  listText:{
    paddingLeft:5,
      height: 48,
}

});
