import React from 'react';
import { Alert,Text,ScrollView,FlatList,View,TouchableOpacity, StyleSheet,KeyboardAvoidingView,TextInput} from 'react-native';
import io from 'socket.io-client/dist/socket.io';
import { SecureStore } from 'expo';
import { CheckBox } from 'react-native-elements'



export default class PhotographerAssignScreen extends React.Component {

  static navigationOptions = {
  title: 'Assign Photographers',
}
  constructor(){
    super()
    this.state={
      dataSource:[],
      selectedPhotographers:[],
      clientUsername:'',

    }

  this.socket=io.connect('http://localhost:3000/entities', {reconnect: true});

  }


  async componentDidMount(){

        var clientSelectedUsername=await SecureStore.getItemAsync('clientSelectedUsername');
        this.socket.emit('requestAllPhotographers',{clientUsername:await SecureStore.getItemAsync('clientSelectedUsername')});
        this.socket.on('gottenAllPhotographers', async(data)=>{

          console.log("data:"+ data[0]["selected"]);

             this.setState({
               dataSource:data,
               clientUsername:clientSelectedUsername,

             });


           });

        }

        _filter = async (item) => {

          var selectedPhotographersArr=this.state.selectedPhotographers;
          var selectedItemIndex= selectedPhotographersArr.indexOf(item);
          var dataSourceArr=this.state.dataSource;
          var datasourceItemIndex=dataSourceArr.indexOf(item);

        if(selectedItemIndex>-1){

          //if already selected
          selectedPhotographersArr.splice(selectedItemIndex, 1);
          dataSourceArr[datasourceItemIndex]["selected"]=false;
        }
        else{

      selectedPhotographersArr.push(item);
      dataSourceArr[datasourceItemIndex]["selected"]=true;
        }

        this.setState({selectedPhotographers:selectedPhotographersArr,dataSource:dataSourceArr});

      }



      _assignPhotographers = async () =>{
        this.socket.emit('assignPhotographers',{selectedPhotographers:this.state.selectedPhotographers, clientUsername:await SecureStore.getItemAsync('clientSelectedUsername')});
                this.socket.on('PhotographerAssignedMsg', function(data){
                  console.log(data);
                  alert(data);


                });

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

                     </View>

                 );
               }
             }

           />

          </View>



      <View>
          <TouchableOpacity
          style={styles.buttonContainer}
          onPress={this._assignPhotographers}
          >

          <Text style={styles.buttonText}> Assign Photographers </Text>
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
