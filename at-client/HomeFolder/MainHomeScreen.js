import React from 'react';
import {  FlatList,Button, Image,  Platform,  ScrollView,  StyleSheet,  Text,  TouchableOpacity,  View,}from 'react-native';
import { WebBrowser } from 'expo';

import { SecureStore } from 'expo';

import io from 'socket.io-client/dist/socket.io';
window.navigator.userAgent='react-native';


export default class HomeScreen extends React.Component {
  static navigationOptions = {
    header: null,
    drawerLabel: 'Home',
      };


      constructor(){
        console.log("testCode");
        super()
        this.state={
          dataSource:[],
          message:'',
          client:SecureStore.getItemAsync('clientSelectedUsername')
        }
      this.socket=io.connect('http://localhost:3000/toDos', {reconnect: true});

    };



      async componentDidMount(){

        console.log("hello");

        var clientUsername=await SecureStore.getItemAsync('clientSelectedUsername');
        console.log(clientUsername);

        if(clientUsername!=undefined){

        var entity=await SecureStore.getItemAsync('entityToken');

        this.socket.emit('requestToDos', {clientUsername:clientUsername, entity:entity});

        this.socket.on('gottenToDos', async(data)=>{
          console.log(data);
        var toDos = [];
         for (i = 0; i < data.length; i++) {

            toDos.push({"key":i,"calendarMessage":data[i]["calendarMessage"],"screen":data[i]["screen"]});
            if(i===data.length-1){
              this.setState({
                dataSource:toDos,
                message:"Here's what you've got to do:"
              });
            }
          }

        });
      }
      else{
        this.setState({message:'Go select a client first!'});
      }

      }

      _selectToDo = async (screen) => {

        //code that gets the navigate word
        console.log(screen);
        this.props.navigation.navigate(screen);


      }

  _signOutAsync = async () => {
await SecureStore.deleteItemAsync('userToken')
this.props.navigation.navigate('Auth');
}

_pickClientAsync= async () => {
this.props.navigation.navigate('Client');
}


  render() {
    return (
      <View style={styles.container}>
          <View style={styles.welcomeContainer}>
            <Image source={require('../assets/images/at_sign.png')}
              style={styles.welcomeImage}/>
          </View>

          <View style={styles.getStartedContainer}>

            <Text>{this.state.message}</Text>

            </View>
            <View>
            <FlatList
            data={this.state.dataSource}
            renderItem={({item}) =>

            {
                return (
                  <TouchableOpacity onPress={() => this._selectToDo(item.screen)}>

                    <Text style={{ width: "100%", height: 48, backgroundColor: "white" }}>
                    {item.calendarMessage}
                    </Text>
                    <View style={{ width: "100%", height: 1, backgroundColor: "gray" }} />
                  </TouchableOpacity>
                );


              }
            }


            />
            </View>

            <View>
              <Button title="Actually I don't care about this. Sign me out :)" onPress={this._signOutAsync} />
              </View>

              <View>
                <Button title="Pick a client" onPress={this._pickClientAsync} />
                </View>

            </View>

        );

    };


    }




const styles = StyleSheet.create({
  container: {
    paddingTop: 30,
    flex: 1,
    backgroundColor: '#fff',
  },
  approval:{
    paddingTop: 30,
    flex: 1,
    backgroundColor: '#fff',
    paddingBottom: 120,

  },
  icon:{
    width: 24,
    height: 24,
  },
  developmentModeText: {
    marginBottom: 20,
    color: 'rgba(0,0,0,0.4)',
    fontSize: 14,
    lineHeight: 19,
    textAlign: 'center',
  },
  contentContainer: {
    paddingTop: 30,
  },
  welcomeContainer: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  welcomeImage: {
    width: 100,
    height: 80,
    resizeMode: 'contain',
    marginTop: 3,
    marginLeft: -10,
  },
  getStartedContainer: {
    alignItems: 'center',
    marginHorizontal: 50,
  },
  homeScreenFilename: {
    marginVertical: 7,
  },
  codeHighlightText: {
    color: 'rgba(96,100,109, 0.8)',
  },
  codeHighlightContainer: {
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 3,
    paddingHorizontal: 4,
  },
  getStartedText: {
    fontSize: 17,
    color: 'rgba(96,100,109, 1)',
    lineHeight: 24,
    textAlign: 'center',
  },
  tabBarInfoContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    ...Platform.select({
      ios: {
        shadowColor: 'black',
        shadowOffset: { height: -3 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
      android: {
        elevation: 20,
      },
    }),
    alignItems: 'center',
    backgroundColor: '#fbfbfb',
    paddingVertical: 20,
  },
  tabBarInfoText: {
    fontSize: 17,
    color: 'rgba(96,100,109, 1)',
    textAlign: 'center',
  },
  navigationFilename: {
    marginTop: 5,
  },
  helpContainer: {
    marginTop: 15,
    alignItems: 'center',
  },
  helpLink: {
    paddingVertical: 15,
  },
  helpLinkText: {
    fontSize: 14,
    color: '#2e78b7',
  },
});
