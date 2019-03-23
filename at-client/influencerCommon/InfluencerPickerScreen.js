import React from 'react';
import { Alert,Text,ScrollView,FlatList,View,TouchableOpacity, StyleSheet,KeyboardAvoidingView,TextInput, Button} from 'react-native';
import io from 'socket.io-client/dist/socket.io';
import { SecureStore } from 'expo';
import { CheckBox } from 'react-native-elements'


export default class InfluencerPickerScreen extends React.Component {

  constructor(){
    super()
    this.state={
      dataSource:[],
      selected:'',
      previousSelected:'',
    }

    this.socket=io.connect('http://localhost:3000/influencer', {reconnect: true});


  }

  async componentDidMount(){

    this.socket.emit('requestAllInfluencerCampaigns', {clientUsername:await SecureStore.getItemAsync('clientSelectedUsername')});

    this.socket.on('gottenAllInfluencerCampaigns', async(data)=>{
      console.log("data:"+data);

          this.setState({
            dataSource:data
          });

        });
      };



  _enterInfluencerCampaign = async () => {
    this.props.navigation.navigate('Main');
  }

  _filterInfluencerCampaign = async (item) => {
    if(this.state.previousSelected==item){
    }
    else{
    await SecureStore.setItemAsync('influencerCampaignSelectedKey',item.key);
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
                  onPress={() => this._filterInfluencerCampaign(item)}
                />
                </View>

                </View>

            );
          }
        }

      />


      <View>
      <Button title="See Influencer Campaign details" onPress={this._enterInfluencerCampaign} />
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
