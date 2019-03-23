import React from 'react';
import { Alert,Text,ScrollView,FlatList,View,TouchableOpacity, StyleSheet,KeyboardAvoidingView,TextInput, Button} from 'react-native';
import io from 'socket.io-client/dist/socket.io';
import { SecureStore } from 'expo';
import { CheckBox } from 'react-native-elements'


export default class ShootPickerScreen extends React.Component {

  constructor(){
    super()
    this.state={
      dataSource:[],
      selected:'',
      previousSelected:'',
    }

    this.socket=io.connect('http://localhost:3000/photography', {reconnect: true});


  }

  async componentDidMount(){

    this.socket.emit('requestAllShoots', {clientUsername:await SecureStore.getItemAsync('clientSelectedUsername')});

    this.socket.on('gottenAllShoots', async(data)=>{

          this.setState({
            dataSource:data
          });

          console.log("dataMount:"+data);

        });
      };


  _createShoot= async () => {

    var key = Math.random().toString(36).substring(7);

  await  this.socket.emit('createShoot', {clientUsername:await SecureStore.getItemAsync('clientSelectedUsername'),key:key});
  await   this.socket.on('shootCreated', async(data)=>{
  });


                  var newDate= new Date();

                  var IndiaDateToday=newDate.toLocaleDateString('en-US', {timeZone: "Asia/Kolkata"}); //1/27/2019

                  var name="initiated:"+IndiaDateToday;

                    var newShoot= {name:name,shortListedPhotographers:[],key:key};
                    var existingShoots=this.state.dataSource;
                    if(existingShoots==undefined || existingShoots==null){
                      existingShoots=[];
                    }

                    existingShoots.unshift(newShoot);

                    this.setState({dataSource:existingShoots});


      }

      _deleteShoot= async (item) => {



        console.log("item.key: "+item.key);

      await  this.socket.emit('deleteShoot', {clientUsername:await SecureStore.getItemAsync('clientSelectedUsername'),key:item.key});
      await   this.socket.on('shootDeleted', async(data)=>{
      });

      var photoShoots= this.state.dataSource;

      var index = photoShoots.indexOf(item);
      photoShoots.splice(index, 1);
      this.setState({dataSource:photoShoots});




          }


  _enterPhotography = async () => {

    this.props.navigation.navigate('PhotographyTabNavigator');

  }

  _filterShoot = async (item) => {
    if(this.state.previousSelected==item){
    }

    else{

    await SecureStore.setItemAsync('shootSelectedKey',item.key);
    item.selected=true;
    this.state.previousSelected.selected=false;
    var a= this.state.selected;
    a+="add";
    this.setState({selected:a});
    this.setState({previousSelected:item});

    }
  }


    render() {
      return (
        <View style={styles.container}>
        <FlatList
        data={this.state.dataSource}
        extraData={this.state}
        renderItem={({item}) =>

        {
            return (

                <View style={styles.clientContainer}>

                <View style={styles.listText}>

                  <Text>
                  {item.name}
                  </Text>

                  </View>

                  <View>
                  <Button title="Delete" onPress={()=> this._deleteShoot(item)} />

                </View>
                <View>

                <CheckBox
                  title='Select'
                  checked={item.selected}
                  onPress={() => this._filterShoot(item)}
                />
                </View>

                </View>

            );
          }
        }

      />

        <View>
        <Button title="Create New Shoot" onPress={this._createShoot} />
        </View>


      <View>
      <Button title="See Shoot details" onPress={this._enterPhotography} />
      </View>

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
     width: "30%",
      height: 48,
       backgroundColor: "white" }

});
