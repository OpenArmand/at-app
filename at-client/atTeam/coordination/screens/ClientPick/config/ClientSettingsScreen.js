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
      dataSource:[{key:"AssignPhotographers", value:"Assign Photographers"}],
    }

  }



  _select = (key) =>{
          if(key=="AssignPhotographers"){
            this.props.navigation.navigate('PhotographerAssign');
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
