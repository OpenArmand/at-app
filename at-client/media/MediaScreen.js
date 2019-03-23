import React from 'react';
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

export default class MediaScreen extends React.Component {
  static navigationOptions = {
    header: null,
    drawerLabel: 'Photography',
  };

    render() {
      return (
        <View style={styles.container}>

        <Text>Photography</Text>
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
