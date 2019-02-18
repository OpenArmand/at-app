import React from 'react';
import { Text,ScrollView, StyleSheet, View, Button, FlatList, Dimensions,  TouchableOpacity,Image } from 'react-native';
import io from 'socket.io-client/dist/socket.io';
import { SecureStore } from 'expo';
import { getUrl } from '../../../../utils';


export default class FacebookPostsScreenOG extends React.Component {
  static navigationOptions = {
  };

  constructor(){
    console.log("testCode");
    super()
    this.state={
      dataSource:[],
    }

    this.socket = io.connect(getUrl('/content'), {reconnect: true});
  };

  async componentDidMount(){
    this.socket.emit('getCalendar', {
      clientUsername: 'Meet', //await SecureStore.getItemAsync('clientSelectedUsername')
    });

    this.socket.on('gottenCalendar', async(data) => {
      console.log('calendar...', data);
      this.setState({dataSource:data});
    });
  }

  _done = async () => {
    await this.socket.emit('done', {
      clientUsername: await SecureStore.getItemAsync('clientSelectedUsername'),
      entity: await SecureStore.getItemAsync('entityToken'),
      msg: 'Create Content Calendar'
    });

    this.props.navigation.navigate('Home');
  }


  render() {
    return (
      <FlatList
        data={this.state.dataSource}
        renderItem={
          ({item}) => {
            return (
              <View>
                <Image source={{ uri: `data:${item.contentType};base64,${item.base64}` }} style={{ width: 414, height: 414 }} />
                <Text>{item.caption}</Text>
                <Text>{item.tags}</Text>
                <Text>{item.hashtags}</Text>
                <Text>{item.location}</Text>
                <Text>{item.date}</Text>
                <Text>{item.time}</Text>
                <View style={styles.container}>
                  <Button title="Approve" onPress={this._done} />
                </View>

                <View style={{ width: "100%", height: 1, backgroundColor: "gray" }} />
              </View>
            );
          }
        }
      />
    );
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 25,
    backgroundColor: '#fff',
  },
});
