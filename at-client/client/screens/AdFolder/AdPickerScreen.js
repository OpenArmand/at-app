import React from 'react';
import { Alert,Text,ScrollView,FlatList,View,TouchableOpacity, StyleSheet,KeyboardAvoidingView,TextInput, Button} from 'react-native';
import io from 'socket.io-client/dist/socket.io';
import { SecureStore } from 'expo';
import { CheckBox } from 'react-native-elements'


export default class AdPickerScreen extends React.Component {

  constructor(){
    super()
    this.state={
      dataSource:[],
      selected:'',
      previousSelected:'',
    }

    this.socket=io.connect('http://localhost:3000/ad', {reconnect: true});


  }

  async componentDidMount(){

    this.socket.emit('requestAllAdSets', {clientUsername:await SecureStore.getItemAsync('clientSelectedUsername')});

    this.socket.on('gottenAllAdSets', async(data)=>{

      console.log("Object.keys(data[0]):"+Object.keys(data[0]));

          this.setState({
            dataSource:data
          });

        });
      };


  _createAdSet= async () => {

    var key = Math.random().toString(36).substring(7);

  await  this.socket.emit('createAd', {clientUsername:await SecureStore.getItemAsync('clientSelectedUsername'),key:key});
  await   this.socket.on('adSetCreated', async(data)=>{
  });


                  var newDate= new Date();

                  var IndiaDateToday=newDate.toLocaleDateString('en-US', {timeZone: "Asia/Kolkata"}); //1/27/2019

                  var name="initiated:"+IndiaDateToday;

                    var newAdSet= {name:name,key:key};
                    var existingAdSets=this.state.dataSource;
                    if(existingAdSets==undefined || existingAdSets==null){
                      existingAdSets=[];
                    }

                    existingAdSets.unshift(newAdSet);

                    this.setState({dataSource:existingAdSets});

      }


  _enterAdSet = async () => {
    this.props.navigation.navigate('AdPlan');
  }

  _filterAd = async (item) => {
    if(this.state.previousSelected==item){
    }
    else{
    await SecureStore.setItemAsync('adSelectedKey',item.key);
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

                <CheckBox
                  title='Select'
                  checked={item.selected}
                  onPress={() => this._filterAd(item)}
                />
                </View>

                </View>

            );
          }
        }

      />



      <View>
      <Button title="See Ad details" onPress={this._enterAdSet} />
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
