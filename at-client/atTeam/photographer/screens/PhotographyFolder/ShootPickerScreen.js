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
    this.socket.emit('requestAllShootsFromAllClients', {username:await SecureStore.getItemAsync('usernameToken')});

    await this.socket.on('gottenAllShootsFromAllClients', async(data)=>{

      console.log("dataFromAllShoots:"+data);

          this.setState({
            dataSource:data
          });

          console.log("dataMount:"+data);

        });
      };




  _enterPhotography = async () => {

    this.props.navigation.navigate('PhotographyTabNavigator');

  }

  _filterShoot = async (item) => {
    if(this.state.previousSelected==item){
    }

    else{

      await SecureStore.setItemAsync('shootSelectedKey',item.key);
      await SecureStore.setItemAsync('clientSelectedUsername',item.clientUsername);

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
                  {item.client}: {item.name}
                  </Text>

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
