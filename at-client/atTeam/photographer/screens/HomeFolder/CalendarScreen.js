import React from 'react';
import {CalendarList,Agenda} from 'react-native-calendars';
import io from 'socket.io-client/dist/socket.io';
import { SecureStore } from 'expo';

//@flow

import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { WebBrowser } from 'expo';

import { MonoText } from '../../components/StyledText';

export default class CalendarScreen extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      items: {},
    };

    this.socket=io.connect('http://localhost:3000/calendarHome', {reconnect: true});

  }



  render() {


    return (
      <Agenda
         items={this.state.items}
         loadItemsForMonth={this.loadItems.bind(this)}
         renderItem={this.renderItem.bind(this)}
         renderEmptyDate={this.renderEmptyDate.bind(this)}
         rowHasChanged={this.rowHasChanged.bind(this)}
       />

          );

        }

         loadItems= async(day)  =>{


          this.socket.emit('getPhotographerCalendarItems', {username:await SecureStore.getItemAsync('usernameToken')});

          this.socket.on('gottenPhotographerCalendarItems', async(data)=>{
            console.log("data:"+data);

            this.setState({items:data});


          });


          }

          renderItem(item) {
            return (
              <Text>{item}</Text>
            );
          }

          renderEmptyDate() {
            return (
              <View style={styles.emptyDate}><Text>This is empty date!</Text></View>
            );
          }

          rowHasChanged(r1, r2) {
            return r1.name !== r2.name;
          }

          timeToString(time) {
            const date = new Date(time);
            return date.toISOString().split('T')[0];
          }
        };




        const styles = StyleSheet.create({
    item: {
      backgroundColor: 'white',
      flex: 1,
      borderRadius: 5,
      padding: 10,
      marginRight: 10,
      marginTop: 17
    },
    emptyDate: {
      height: 15,
      flex:1,
      paddingTop: 30
    }
  });
