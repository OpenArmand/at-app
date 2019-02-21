import React from 'react';
import { Alert,Text,ScrollView,FlatList,View,TouchableOpacity, StyleSheet,KeyboardAvoidingView,TextInput} from 'react-native';
import io from 'socket.io-client/dist/socket.io';
import { SecureStore } from 'expo';
import { CheckBox } from 'react-native-elements'

import { getUrl } from '../../../../../utils';


export default class ContentCreatorAssignScreen extends React.Component {

  static navigationOptions = {
  title: 'ContentCreatorAssign',
}
  constructor(){
    super()
    this.state={
      dataSource:[],
      clientUsername:'',
      contentCreators:[],
      selected:'',
      previousSelected:'',
      selectedContentCreator:'',
      configClicked:'false',




    }

  this.socket=io.connect(getUrl('/entities'), {reconnect: true});

  }


  async componentWillMount(){

    var configClicked=await SecureStore.getItemAsync('configClicked');

        var clientUsername=await SecureStore.getItemAsync('clientSelectedUsername');

        this.socket.emit('requestAllContentCreators','');
        this.socket.on('gottenAllContentCreators', async(data)=>{
          var contentCreatorArray=[];

          for (var i = 0; i < data.length; i++) {
             contentCreatorArray.push({key:data[i]["username"],username:data[i]["username"],selected:false});
           };

             this.setState({
               dataSource:contentCreatorArray,
               clientUsername:clientUsername,
               configClicked:configClicked,

             });


           });

        }

        _filter = async (item) => {
        if(this.state.previousSelected==item){

        }
        else{

      //  await SecureStore.setItemAsync('clientSelectedUsername',item.username);

        item.selected=true;
        this.state.previousSelected.selected=false;
        var a= this.state.selected;
        a+="add";
        this.setState({selectedContentCreator:item.username, selected:a,previousSelected:item });

        }
      }



      _assigncontentCreator = () =>{
        this.socket.emit('assignContentCreator',{contentCreatorUsername:this.state.selectedContentCreator, clientUsername:this.state.clientUsername, configClicked:this.state.configClicked });
                this.socket.on('ContentCreatorAssignedMsg', function(data){
                  console.log(data);
                  alert(data);


                });
                this.props.navigation.navigate('Drawer');



          }


    render() {
      return (
      <View >
          <View >
      <Text> Use this page to configure {this.state.clientUsername} here</Text>
          </View>

        <View>
      <Text>Assign a contentCreator</Text>
      </View>

      <View>
             <FlatList
             data={this.state.dataSource}
             extraData={this.state.selected}
             renderItem={({item}) =>

             {
                 return (

                     <View style={styles.clientContainer}>

                     <View style={styles.listText}>

                       <Text>
                       {item.username}
                       </Text>

                       </View>

                     <View>

                     <CheckBox
                       title='Select'
                       checked={item.selected}
                       onPress={() => this._filter(item)}
                     />
                     </View>

                     </View>

                 );
               }
             }

           />

          </View>



      <View>
          <TouchableOpacity
          style={styles.buttonContainer}
          onPress={this._assigncontentCreator}
          >

          <Text style={styles.buttonText}> Confirm </Text>
          </TouchableOpacity>

          </View>

        </View>




            )

          }


      };



      const styles = StyleSheet.create({
        container: {
          alignItems: 'center',
          backgroundColor: '#fff',
        },
        assignContainer: {
          alignItems: 'center',
          flex: 1,
          backgroundColor: '#fff',
        },
        configure:{
          backgroundColor: '#fff',

        },
        assignContentCreator:{
          paddingBottom:10
        },
        assigncontentCreator: {
          paddingBottom:10

        },
        buttonContainer:{
          backgroundColor:'#000000',

        },
        buttonText:{
          textAlign:'center',
          color: '#FFFFFF',
          fontWeight:'700',
        },
      });
