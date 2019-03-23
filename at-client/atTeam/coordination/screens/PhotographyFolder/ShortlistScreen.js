import React from 'react';
import { Alert,Text,ScrollView,FlatList,View,TouchableOpacity, StyleSheet,KeyboardAvoidingView,TextInput, Button} from 'react-native';
import io from 'socket.io-client/dist/socket.io';
import { SecureStore } from 'expo';
import { CheckBox } from 'react-native-elements'


export default class ShortlistScreen extends React.Component {

  constructor(){
    super()
    this.state={
      dataSource:[],
      selected:'',
      previousSelected:'',
      finalizedPhotographer:'',
    }

    this.socket=io.connect('http://localhost:3000/photography', {reconnect: true});


  }

  async componentDidMount(){

    this.socket.emit('requestAllAcceptances', {key:await SecureStore.getItemAsync('shootSelectedKey'),clientUsername:await SecureStore.getItemAsync('clientSelectedUsername')});

    this.socket.on('gottenAllAcceptances', async(data)=>{


          this.setState({
            dataSource:data,
          });

        });
      };

      _photographerProfile= async (item) => {

      this.props.navigation.navigate('PhotographerProfile',{photographerProfile:item['profile']});

      }



  _choosePhotographer = async () => {

    this.socket.emit('chooseAcceptedPhotographer', {key:await SecureStore.getItemAsync('shootSelectedKey'),clientUsername:await SecureStore.getItemAsync('clientSelectedUsername'),shoot:this.state.previousSelected});

    this.setState({
      finalizedPhotographer:this.state.previousSelected["photographer"]["firstName"],
    });
  //  this.props.navigation.navigate('SchedulingShoot');

  }

  _filterPhotographer = async (item) => {
    if(this.state.previousSelected==item){
      this.state.selected='';
    }

    else{

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

        <View style={styles.listText}>

          <Text>
          finalizedPhotographer:{this.state.finalizedPhotographer}

          </Text>

          </View>
        <FlatList
        data={this.state.dataSource}
        extraData={this.state}
        renderItem={({item}) =>

        {
            return (


                <View style={styles.clientContainer}>

                <View style={styles.listText}>

                  <Text>
                  {item.photographer.firstName} {item.photographer.lastName}
                  </Text>

                  <View>

                  <View>
                  <Button title="View Photographer Profile" onPress={()=>this._photographerProfile(item)} />
                    </View>

                  <FlatList
                  data={item.dateOptions}
                  extraData={this.state}
                  renderItem={({item}) =>

                  {
                      return (
                        <View style={styles.listText}>

                          <Text>
                          {item.date}
                          </Text>

                          </View>
                      );
                    }}
                    />


                  </View>


                  </View>


                <View>

                <CheckBox
                  title='Select'
                  checked={item.selected}
                  onPress={() => this._filterPhotographer(item)}
                />
                </View>

                </View>

            );
          }
        }

      />

      <View>
      <Button title="Finalize Shoot" onPress={this._choosePhotographer} />
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
