import React from 'react';
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  FlatList,
} from 'react-native';

export default class MainAccountScreen extends React.Component {
  static navigationOptions = {
    header: null,
    drawerLabel: 'Account',
  };

    constructor(){
      super()
      this.state={
        dataSource:[{key:"Profile",value:"Profile"}],
      }

    }



    _select = (key) =>{
            if(key=="Profile"){
              this.props.navigation.navigate('Profile');
            }
          }


      render() {
        return (
          <View style={styles.container}>
          <FlatList
          data={this.state.dataSource}

          renderItem={({item}) =>

          {
              return (
                <View>
                <TouchableOpacity onPress={() => this._select(item.key)}>

                  <Text style={{ width: "100%", height: 48, backgroundColor: "white" }}>
                  {item.value}
                  </Text>
                  <View style={{ width: "100%", height: 1, backgroundColor: "gray" }} />
                </TouchableOpacity>
                </View>

              );


            }
          }


        />
        </View>
        );

            }

        };


        const styles = StyleSheet.create({
          container: {
            paddingTop: 30,
            flex: 1,
            backgroundColor: '#fff',
          },
          assignContainer: {
            alignItems: 'center',
            paddingTop: 30,
            flex: 1,
            backgroundColor: '#fff',
            flexDirection: 'row'
          },
          configure:{
            paddingTop: 30,
            backgroundColor: '#fff',
            paddingBottom: 120,

          },
          assignContentCreator:{
            paddingBottom:10
          },
          assignCore: {
            paddingBottom:10

          },
          buttonContainer:{
            backgroundColor:'#000000',
            paddingVertical:15,

          },
          buttonText:{
            textAlign:'center',
            color: '#FFFFFF',
            fontWeight:'700',
          },
        });

        //{this.state.type}
