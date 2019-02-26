import React from 'react';
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Button,
  TextInput,

} from 'react-native';

import { SecureStore, ImagePicker, FileSystem } from 'expo';
import { CheckBox } from 'react-native-elements'
window.navigator.userAgent='react-native';

import io from 'socket.io-client/dist/socket.io';

import { getUrl } from '../../../../utils';

export default class CreatePostScreen extends React.Component {

  static navigationOptions = {
    header: null,
    drawerLabel: 'Content',
  };

  constructor(){
    super()

    this.state = {
      uri: null,
      type: null,
      caption: null,
      tags: null,
      hashtags: null,
      location: null,
      facebook: false,
      instagram: false,
      date: null,
      time: null,
      height: null,
      width: null,
    };

    this.socket=io.connect(getUrl('/content'), {reconnect: true});
  }

  _createPost = async() => {
    const processChunks = async (uri, chunkSize, cb) => {
      // since we are chunking base64
      if (chunkSize % 3 != 0)
        throw new Error("number of bytes should be multiple of 3")

      const fileInfo = await FileSystem.getInfoAsync(uri, {
        size: true
      });

      const fileSize = fileInfo.size; // in bytes
      let start = 0;
      for(let i = 0; i < Math.ceil(fileSize / chunkSize); i++) {
        const chunk = await FileSystem.readAsStringAsync(uri, {
          encoding: FileSystem.EncodingTypes.Base64,
          length: chunkSize,
          position: start,
        });

        await cb(chunk, i);
        start += chunkSize;
      }
    };

    // tell the server that upload is started
    await this.socket.emit('upload', {
      uri: this.state.uri,
      type: this.state.type,
    });

    const sendChunk = async (chunk, index) => {
      console.log('emitted', index, chunk);
      await this.socket.emit('chunk', { chunk, index });
    };

    // chunk size is set to 255kB
    await processChunks(this.state.uri, 255 * 1024, sendChunk);

    // tell the server that the upload is complete and create the post entity
    await this.socket.emit('upload-end', {
        clientUsername: await SecureStore.getItemAsync('clientSelectedUsername'),
        entity: await SecureStore.getItemAsync('entityToken'),
        msg:'Create Post',
        tags: this.state.tags,
        caption: this.state.caption,
        hashtags: this.state.hashtags,
        location: this.state.location,
        facebook: this.state.facebook,
        instagram: this.state.instagram,
        date: this.state.date,
        time: this.state.time,
        height: this.state.height,
        width: this.state.width,
      }) 
  }


      _booleanInstagram(){
        this.setState({instagram:!this.state.instagram});
      }

      _booleanFacebook(){
        this.setState({facebook:!this.state.facebook});
      }


    render() {
      let { image } = this.state;

      return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
           <Button
             title="Pick an image from camera roll"
             onPress={this._pickImage}
           />
           {image &&
                <Image source={{ uri: image }} style={{ width: 50, height: 50 }} />}

                <TextInput
                placeholder="Caption"
                onChangeText={(text) => this.setState({caption:text})}

                  />

                <TextInput
                placeholder="Tags"
                onChangeText={(text) => this.setState({tags:text})}

                  />

              <TextInput
              placeholder="Hashtags"
              onChangeText={(text) => this.setState({hashtags:text})}

                />

              <TextInput
              placeholder="Location"
              onChangeText={(text) => this.setState({location:text})}

                />

                <TextInput
                placeholder="Date(YYYY-MM-DAY)"
                onChangeText={(text) => this.setState({date:text})}

                  />

                <TextInput
                placeholder="Time"
                onChangeText={(text) => this.setState({time:text})}

                  />

                  <CheckBox
                    title='Instagram'
                    checked={this.state.instagram}
                    onPress={() => this._booleanInstagram()}
                  />

                  <CheckBox
                    title='Facebook'
                    checked={this.state.facebook}
                    onPress={() => this._booleanFacebook()}
                  />

                  <Button
                    title="Create Post"
                    onPress={this._createPost}
                  />

         </View>
      );

    }


    _pickImage = async () => {
      let result = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        aspect: [4, 3],
        mediaTypes: ImagePicker.MediaTypeOptions.All,
      });

      if (!result.cancelled) {
        console.log("uri: " + result.uri);
        console.log("type: " + result.type);
        this.setState({
          uri: result.uri,
          type: result.type,
          height: result.height,
          width: result.width,
        });
      }
    };
  }


  const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#fff',
    },
  });
