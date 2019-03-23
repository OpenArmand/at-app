import React from 'react';
import { Icon } from 'expo';
import { Button, Image, StyleSheet,View,Text, FlatList, TextInput} from 'react-native';
import { withNavigation } from 'react-navigation';
import {Overlay, CheckBox} from 'react-native-elements'
import io from 'socket.io-client/dist/socket.io';
import { SecureStore } from 'expo';


class Comments extends React.Component {
  constructor(props) {

  super(props);

  this.state={
    newComment:'',
    comments:[],
    isVisible:false,
    plan:'',
    refresh:false,

  }

  this.socket=io.connect('http://localhost:3000/planComments', {reconnect: true});

};
async componentDidMount(){

  this.setState({plan:this.props.plan});

  await this.socket.emit('getComments', {clientUsername:await SecureStore.getItemAsync('clientSelectedUsername'), entity:await SecureStore.getItemAsync('entityToken'), plan:this.state.plan});

  this.socket.on('gottenComments', async(data)=>{
    //console.log("data.comments "+data.comments);

    if(data.comments==null || data.comments==''){
      data.comments=[];
    }

   this.setState({comments:data.comments});
   //console.log("data.comments "+data.comments);

  });
}

      _post=async () => {


        if(this.state.newComment!==''){

          let key = Math.random().toString(36).substring(7);
          let commentObj={key:key, comment:this.state.newComment, subComments:[], firstName:await SecureStore.getItemAsync('firstNameToken')}

          await this.socket.emit('postComment', {clientUsername:await SecureStore.getItemAsync('clientSelectedUsername'), entity:await SecureStore.getItemAsync('entityToken'), plan:this.state.plan, commentObj:commentObj,firstName:await SecureStore.getItemAsync('firstNameToken')});

          var commentArr= this.state.comments;
          commentArr.push(commentObj);

          this.setState({comments:commentArr});


        }


      }

      _resolved=async (item) => {
        var commentArr= this.state.comments;
        var found = commentArr.find(function(element) {
        if(element.key.valueOf()==item.key.valueOf()){
        return element;
        }
        });

        var index = commentArr.indexOf(found);

        var setToBoolean= !commentArr[index]["resolved"];

        commentArr[index]["resolved"]=setToBoolean;
        this.setState({comments:commentArr});


      await this.socket.emit('resolvedComment', {clientUsername:await SecureStore.getItemAsync('clientSelectedUsername'), entity:await SecureStore.getItemAsync('entityToken'),plan:this.state.plan, commentKey:item.key, setToBoolean:setToBoolean});


      }



      _delete=async (item) => {

        if(item["firstName"]==await SecureStore.getItemAsync('firstNameToken')){

      var commentArr= this.state.comments;

      var found = commentArr.find(function(element) {
      if(element.key.valueOf()==item.key.valueOf()){
      return element;
      }
      });

      var index = commentArr.indexOf(found);
      commentArr.splice(index, 1);
      this.setState({comments:commentArr});
      await this.socket.emit('deleteComment', {clientUsername:await SecureStore.getItemAsync('clientSelectedUsername'), entity:await SecureStore.getItemAsync('entityToken'), plan:this.state.plan,commentKey:item.key});

        }
      }

      _viewComments= async () => {
          this.setState({isVisible:!this.state.isVisible});

        }

        _deleteSubComment=async (item) => {

          if(item["firstName"]==await SecureStore.getItemAsync('firstNameToken')){


          var stateComments=this.state.comments;

          var found = stateComments.find(function(element) {
            var eleCommentArr=element["subComments"];
            for(var i=0; i<eleCommentArr.length;i++){
              if(eleCommentArr[i].key.valueOf()==item.key.valueOf()){
              return element;
              }
            }
          });

          var subCommentArr= found.subComments;

          var commentIndex = stateComments.indexOf(found);
          var subCommentIndex = subCommentArr.indexOf(item);


          if (subCommentArr.length==1){
            subCommentArr=[];
          }
          else{
            subCommentArr.splice(subCommentIndex, 1);

          }

          stateComments[commentIndex]["subComments"]=subCommentArr;

          this.setState({comments:stateComments});

          //console.log("hellow?")
          await this.socket.emit('deleteSubComment', {clientUsername:await SecureStore.getItemAsync('clientSelectedUsername'), entity:await SecureStore.getItemAsync('entityToken'), plan:this.state.plan,subCommentKey:item.key, item:item});
    

          }
        }


      _respond= async (item) => {
        if(this.state.newComment!==''){


          let key = Math.random().toString(36).substring(7);
          let commentObj={key:key, comment:this.state.newComment, firstName:await SecureStore.getItemAsync('firstNameToken')}

          var commentArr= item.subComments;

          commentArr.push(commentObj);

          var stateComments=this.state.comments;

    /*      var found = stateComments.find(function(element) {
          if(element.key.valueOf()==item.key.valueOf()){
          return element;
          }
        });*/

          var index = stateComments.indexOf(item);

          stateComments[index]["subComments"]=commentArr;

          this.setState({comments:stateComments});

          this.setState({refresh:!this.state.refresh});


          await this.socket.emit('postSubComment', {clientUsername:await SecureStore.getItemAsync('clientSelectedUsername'), entity:await SecureStore.getItemAsync('entityToken'), plan:this.state.plan,commentKey:item.key,item:item, commentObj:commentObj});


        }

        }


  render() {



    return (
      <View>

      <Button
      title="View Comments"
      onPress={this._viewComments}
    />


    <Overlay isVisible={this.state.isVisible}>
        <Text> Comment away</Text>
        <Button
          title="X"
          onPress={this._viewComments}
        />

      <FlatList
      data={this.state.comments}
      extraData={this.state}
      renderItem={({item}) =>
      {
        return (

            <View style={styles.clientContainer}>

            <View style={styles.commentContainer}>

            <View>
            <Text>
            {item.firstName}
            </Text>
          </View>

            <View style={styles.commentText}>

              <Text>
              {item.comment}
              </Text>

              </View>

              <View style={styles.commentActionsContainer}>

              <View>
              <Button title="delete" onPress={()=> this._delete(item)} />

            </View>

            <View>

            <CheckBox
              title='Resolved'
              checked={item.resolved}
              onPress={() => this._resolved(item)}
            />
            </View>

            <View>

            <Button title="Respond" onPress={()=> this._respond(item)} />

            </View>

          </View>

          </View>

          <FlatList
      data={item.subComments}
      extraData={this.state.refresh}
      renderItem={({item}) =>
      {
        return (

          <View style={styles.subCommentContainer}>

    <View>
          <View>
          <Text>
          {item.firstName}
          </Text>
        </View>

               <Text>
               {item.comment}
               </Text>

              </View>

              <View style={styles.commentActionsContainer}>

              <View>
              <Button title="delete" onPress={()=> this._deleteSubComment(item)} />

            </View>
              <View>

             </View>


            </View>

            </View>

         )
        }
      }
      />




            </View>
          )
        }
      }
      />

      <TextInput
      placeholder="write comment"
        onChangeText={(text) => this.setState({newComment:text})}

        style={styles.input}
        />

        <View>
        <Button title="post" onPress={()=> this._post()} />

      </View>
      </Overlay>

      </View>


    )
}
}



  const styles = StyleSheet.create({
    container:{
      fontSize: 40,
      height:40,
      marginBottom: 20,
      paddingHorizontal:10,
      paddingBottom:10,


    },
    approvalImage: {
      width: 100,
      height: 80,
      resizeMode: 'contain',
      marginTop: 3,
      paddingBottom:10,

    },
      clientContainer:{
    flex: 1,
    paddingTop: 15,
        },

        commentActionsContainer:{
          flexDirection: 'row',

          },

          subCommentContainer:{
            paddingLeft: 15,
            },



        commentText:{
          paddingLeft:5,
           width: "30%",
            height: 48,
             backgroundColor: "white" },

             subCommentText:{
               paddingLeft:20,
                width: "30%",
                 height: 48,
                  backgroundColor: "white" },
  });

  export default withNavigation(Comments);
