import React from 'react';
import { Alert,Text,ScrollView,FlatList,View,TouchableOpacity, StyleSheet,KeyboardAvoidingView,TextInput} from 'react-native';
import io from 'socket.io-client/dist/socket.io';
import { SecureStore } from 'expo';
import { CheckBox } from 'react-native-elements'


export default class PhotographerBankScreen extends React.Component {

  constructor(){
    super()
    this.state={
      dataSource:[],
      shortListedPhotographers:[],
      clientUsername:'',

    }

  this.socket=io.connect('http://localhost:3000/photography', {reconnect: true});

  }


  async componentDidMount(){

        var clientSelectedUsername=await SecureStore.getItemAsync('clientSelectedUsername');
        this.socket.emit('requestAllClientPhotographers',{clientUsername:await SecureStore.getItemAsync('clientSelectedUsername'),key:await SecureStore.getItemAsync('shootSelectedKey')});
        this.socket.on('gottenAllClientPhotographers', async(data)=>{

             this.setState({
               dataSource:data,
               clientUsername:clientSelectedUsername,

             });


           });

        }

        _filter = async (item) => {

          var shortListedPhotographersArr=this.state.shortListedPhotographers;
          var selectedItemIndex= shortListedPhotographersArr.indexOf(item);
          var dataSourceArr=this.state.dataSource;
          var datasourceItemIndex=dataSourceArr.indexOf(item);

       if(selectedItemIndex>-1){

          //if already selected
          shortListedPhotographersArr.splice(selectedItemIndex, 1);
          dataSourceArr[datasourceItemIndex]["selected"]=false;
        }
        else{

      shortListedPhotographersArr.push(item);
      dataSourceArr[datasourceItemIndex]["selected"]=true;
        }

        this.setState({shortListedPhotographers:shortListedPhotographersArr,dataSource:dataSourceArr});

      }



      _invitePhotographers = async () =>{
        console.log(this.state.shortListedPhotographers);
        this.socket.emit('invitePhotographers',{shortListedPhotographers:this.state.shortListedPhotographers, clientUsername:await SecureStore.getItemAsync('clientSelectedUsername'),key:await SecureStore.getItemAsync('shootSelectedKey')});

                this.socket.on('PhotographerInvitedMsg', function(data){
                  console.log(data);
                  alert(data);
                });


                componentDidMount();
          }


    render() {
      return (
      <View >
          <View >
      <Text> Use this page to configure {this.state.clientUsername} here</Text>
          </View>

        <View>
      <Text>Assign Photographers</Text>
      </View>

      <View>
             <FlatList
             data={this.state.dataSource}
             extraData={this.state}
             renderItem={({item}) =>

             {
                 return (

                     <View style={styles.clientContainer}>

                     <View style={styles.listText}>

                       <Text>
                       {item.username}
                       </Text>

                       </View>

                       <View style={styles.listText}>

                         <Text>
                         {item.firstName} {item.lastName}
                         </Text>

                         </View>

                     <View>

                     <CheckBox
                       title='Select'
                       checked={item.selected}
                       onPress={() => this._filter(item)}
                     />
                     </View>

                     <View>

                     <CheckBox
                       title='Invited'
                       checked={item.invited}
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
          onPress={this._invitePhotographers}
          >

          <Text style={styles.buttonText}> Invite Photographers </Text>
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
        assignPhotographer:{
          paddingBottom:10
        },
        assignphotographer: {
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
