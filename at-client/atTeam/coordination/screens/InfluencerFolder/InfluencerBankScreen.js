import React from 'react';
import { Alert,Text,ScrollView,FlatList,View,TouchableOpacity, StyleSheet,KeyboardAvoidingView,TextInput, Button} from 'react-native';
import io from 'socket.io-client/dist/socket.io';
import { SecureStore } from 'expo';

export default class InfluencerBankScreen extends React.Component {

  constructor(){
    super()
    this.state={
      influencerDataSource:[],
    }

    this.socket=io.connect('http://localhost:3000/influencer', {reconnect: true});

  }

  async componentDidMount(){

        this.socket.emit('getAllInfluencers', {clientUsername:await SecureStore.getItemAsync('clientSelectedUsername')});

        this.socket.on('gottenAllInfluencers', async(data)=>{


          console.log("keys:"+Object.keys(data))

          console.log("data.length:"+data.length)

          console.log("data:"+data[0]["fullName"])

          this.setState({
            influencerDataSource:data,
            }
          );
        });
      }

      _Assign= async (item) => {
        this.props.navigation.navigate('CreateEvent',{influencer:item});
      }

      _goToCreateInfluencer= async () => {
        this.props.navigation.navigate('CreateInfluencer');
      }


    render() {
      return (
        <View style={styles.container}>


        <FlatList
        data={this.state.influencerDataSource}
        extraData={this.state}
        renderItem={({item}) =>

        {
            return (

                <View style={styles.clientContainer}>

                <View style={styles.listText}>

                  <Text>
                  {item.fullName}
                  </Text>

                  </View>

                <View>

                <Button title="Assign" onPress={()=> this._Assign(item)} />

                </View>

                </View>

            );
          }
        }

      />

      <View>

      <Button title="Add Influencer" onPress={()=> this._goToCreateInfluencer()} />

      </View>

              </View>
      );

    }
  }

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#fff',
    },
  });
