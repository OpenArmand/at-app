import React from 'react';
import { Alert,Text,ScrollView,FlatList,View,TouchableOpacity, StyleSheet,KeyboardAvoidingView,TextInput, Picker} from 'react-native';
import io from 'socket.io-client/dist/socket.io';
import { SecureStore } from 'expo';


export default class ClientSettingsScreen extends React.Component {

  static navigationOptions = {
  title: 'ClientSettings',
}
  constructor(){
    super()
    this.state={
      dataSource:[{key:"Assign a core",value:"Assign a Core"},{key:"Assign a content creator",value:"Assign a Content Creator"},{key:"AssignPhotographers", value:"Assign Photographers"},{key:"ConfigCalendar", value:"Configure the calendar"},{key:"RemoveService", value:"Remove a service"},{key:"AddService", value:"Add a service"}],
    }

  }



  _select = (key) =>{
          if(key=="Assign a core"){
            this.props.navigation.navigate('CoreAssign');
          }
          else if(key=="Assign a content creator"){
            this.props.navigation.navigate('ContentCreatorAssign');
          }
          else if(key=="AssignPhotographers"){
            this.props.navigation.navigate('PhotographerAssign');
          }

          else if(key=="RemoveService"){
            this.props.navigation.navigate('SelectRemoveService');
          }

          else if(key=="AddService"){
            this.props.navigation.navigate('SelectAddService');
          }
        }


    render() {
      return (
        <FlatList
        data={this.state.dataSource}

        renderItem={({item}) =>

        {
            return (
              <View>
              <TouchableOpacity onPress={() => this._select(item.key)}>

                <Text style={{ width: "100%", height: 48, backgroundColor: "white" }}>
                {item.value}
                </Text>
                <View style={{ width: "100%", height: 1, backgroundColor: "gray" }} />
              </TouchableOpacity>
              </View>

            );


          }
        }


      />
      );

          }

      };


      const styles = StyleSheet.create({
        container: {
          alignItems: 'center',
          paddingTop: 30,
          flex: 1,
          backgroundColor: '#fff',
        },
        assignContainer: {
          alignItems: 'center',
          paddingTop: 30,
          flex: 1,
          backgroundColor: '#fff',
          flexDirection: 'row'
        },
        configure:{
          paddingTop: 30,
          backgroundColor: '#fff',
          paddingBottom: 120,

        },
        assignContentCreator:{
          paddingBottom:10
        },
        assignCore: {
          paddingBottom:10

        },
        buttonContainer:{
          backgroundColor:'#000000',
          paddingVertical:15,

        },
        buttonText:{
          textAlign:'center',
          color: '#FFFFFF',
          fontWeight:'700',
        },
      });

      //{this.state.type}
