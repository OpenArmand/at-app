var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var ss = require('socket.io-stream');
var path = require('path');
var uuid = require('uuid');
var mongoose = require('mongoose');
var nodemailer = require('nodemailer');
var dedent = require('dedent');
var bodyParser = require('body-parser');

var fs= require('fs')
var { Readable } = require('stream');

var User = require('./mongoose/User.js')

var Client= require('./mongoose/Client.js');
var ClientModel= Client.ClientModel;

var ContentCreator= require('./mongoose/ContentCreator.js');
var ContentCreatorModel= ContentCreator.ContentCreatorModel;

var Core= require('./mongoose/Core.js');
var CoreModel= Core.CoreModel;

var Designer= require('./mongoose/Designer.js');
var DesignerModel= Designer.DesignerModel;

var God= require('./mongoose/God.js');
var GodModel= God.GodModel;

var Photographer= require('./mongoose/Photographer.js');
var PhotographerModel= Photographer.PhotographerModel;

var Coordination= require('./mongoose/Coordination.js');
var CoordinationModel= Coordination.CoordinationModel;

var Ad= require('./mongoose/Ad.js');
var AdModel= Ad.AdModel;

var atObjects= require('./mongoose/atObjects.js');

var StrategyModel = atObjects.StrategyModel;
var PostModel = atObjects.PostModel;
var ContentCalendarModel = atObjects.ContentCalendarModel;
var ShootPlanModel = atObjects.ShootPlanModel;
var PhotoShootModel = atObjects.PhotoShootModel;
var InfluencerPlanModel= atObjects.InfluencerPlanModel;
var InfluencerEventModel= atObjects.InfluencerEventModel;
var SurveillanceModel= atObjects.SurveillanceModel;
var AnalyticModel= atObjects.AnalyticModel;
var getMediaModel = atObjects.getMediaModel;

//testcommentchange

app.use(bodyParser.json());
app.use(bodyParser.urlencoded());

app.get('/', function(req, res){
  fs.readFile(__dirname + '/index.html',
  function (err, data) {
    if (err) {
      res.writeHead(500);
      return res.end('Error loading index.html');
    }

    res.writeHead(200);
    res.end(data);
  });});


app.get('/authentication/reset-password/:token', (req, res) => {
  fs.readFile(__dirname + '/reset-password.html', (err, data) => {
    if (err) {
      res.writeHead(500);
      return res.end('Error loading reset password page');
    }

    res.writeHead(200);
    res.end(data);
  });
});


app.post('/authentication/reset-password/:token', (req, res) => {
  User.findOne({ token: req.params.token }, (err, user) => {
    if (err) {
      res.writeHead(406);
      return res.end(JSON.stringify({
        error: "token invalid",
      }));
    }

    if ((new Date().getTime()) > user.expiry.getTime()) {
      res.writeHead(406);
      return res.end(JSON.stringify({
        error: "token expired, generate a new one!",
      }));
    }

    user.password = req.body.password;
    user.save();
    res.writeHead(200);
    return res.end(JSON.stringify({
      status: "password reset successful!",
    }))
  });
});


var authentication = io.of('/authentication');
var MediaModel = null;
mongoose.connect('mongodb://localhost/test');
mongoose.connection.once('open', () => {
  MediaModel = getMediaModel(mongoose.connection);
});

authentication.on('connection', function(socket) {
  console.log('connection established...', socket);

  socket.on('signUp', function(data){
    console.log('signUp', JSON.stringify(data));

    User.findOne({ username: data.screenUserName }, function(err, user) {
      if (user != null) {
        var usernameStatus = { status:"username already exists" }
        socket.emit('loginStatus', usernameStatus); // emit an event to the socket
      }
      else {
        var newUser = new User();
        newUser.username = data.screenUserName ;
        newUser.password = data.screenPassword;
        newUser.firstName = data.screenFirstName;
        newUser.lastName = data.screenLastName;
        newUser.businessName = data.screenBusinessName;
        newUser.email = data.screenEmail;
        newUser.save();

        if (newUser.businessName == "ContentCreator"){
          var newContentCreator = new ContentCreatorModel();
          newContentCreator.username = data.screenUserName ;
          newContentCreator.firstName = data.screenFirstName;
          newContentCreator.lastName = data.screenLastName;
          newContentCreator.businessName = data.screenBusinessName;
          newContentCreator.save();
        }

        else if (newUser.businessName == "Core"){
          var newCore = new CoreModel();
          newCore.username = data.screenUserName ;
          newCore.firstName = data.screenFirstName;
          newCore.lastName = data.screenLastName;
          newCore.businessName = data.screenBusinessName;
          newCore.save();
        }

        else if (newUser.businessName == "Photographer"){
          var newPhotographer = new PhotographerModel();
          newPhotographer.username = data.screenUserName ;
          newPhotographer.firstName = data.screenFirstName;
          newPhotographer.lastName = data.screenLastName;
          newPhotographer.businessName = data.screenBusinessName;
          newPhotographer.save();
        }

        else if (newUser.businessName == "Coordination"){
          var newCoordination = new CoordinationModel();
          newCoordination.username = data.screenUserName ;
          newCoordination.firstName = data.screenFirstName;
          newCoordination.lastName = data.screenLastName;
          newCoordination.businessName = data.screenBusinessName;
          newCoordination.save();
        }

        else if (newUser.businessName == "God"){
          var newGod = new GodModel();
          newGod.username = data.screenUserName ;
          newGod.firstName = data.screenFirstName;
          newGod.lastName = data.screenLastName;
          newGod.businessName = data.screenBusinessName;
          newGod.save();
        }

        else if (newUser.businessName == "Designer"){
          var newDesigner = new DesignerModel();
          newDesigner.username = data.screenUserName ;
          newDesigner.firstName = data.screenFirstName;
          newDesigner.lastName = data.screenLastName;
          newDesigner.businessName = data.screenBusinessName;
          newDesigner.save();
        }

        else if (newUser.businessName == "Ad"){
          var newAd = new AdModel();
          newAd.username = data.screenUserName ;
          newAd.firstName = data.screenFirstName;
          newAd.lastName = data.screenLastName;
          newAd.businessName = data.screenBusinessName;
          newAd.save();
        }

        else {
          var newClient = new ClientModel();
          newClient.username = data.screenUserName ;
          newClient.firstName = data.screenFirstName;
          newClient.lastName = data.screenLastName;
          newClient.businessName = data.screenBusinessName;
          newClient.save();
        }

        var usernameStatus = "good to go";
        socket.emit('loginStatus', usernameStatus); // emit an event to the socket
      }
    });
  });

  socket.on('signIn', async(data) => {
    // fetch user and test password verification
    User.findOne({ username: data.screenUserName }, function(err, user) {
      if (err || user == null) {
        var LoginStatus={status:"no such username"}
        socket.emit('loginStatus', LoginStatus); // emit an event to the socket
      }
      else {
        // test a matching password
        user.comparePassword(data.screenPassword, function(err, isMatch) {
          if (isMatch) {
            var LoginStatus = { status:"success", businessName: user.businessName };
          }
          else {
            var LoginStatus = { status: "incorect password" };
          }
          socket.emit('loginStatus', LoginStatus); // emit an event to the socket
        });
      }
    });
  });

  socket.on('reset-password-request', (data) => {
    const email = data.email;

    User.findOne({ $or: [ { username: email }, { email: email } ] }, (err, user) => {
      if (err) {
        console.log('error occured while fetching user', err);
      }

      user.generateResetToken(async (err, user) => {
        console.log('err', err);
        console.log('user', user);

        const link = `http://192.168.1.11:3000/authentication/reset-password/${user.token}`;
        const email = dedent`
          Hello, @${user.username}!

          Use this link to reset your password. This link will expire in 60 minutes!
          ${link}
        `;

        // Generate test SMTP service account from ethereal.email
        // Only needed if you don't have a real mail account for testing
        let account = await nodemailer.createTestAccount();

        // create reusable transporter object using the default SMTP transport
        let transporter = nodemailer.createTransport({
          host: "smtp.ethereal.email",
          port: 587,
          secure: false, // true for 465, false for other ports
          auth: {
            user: account.user, // generated ethereal user
            pass: account.pass // generated ethereal password
          }
        });

        //let transporter = nodemailer.createTransport({
          //service: 'gmail',
          //auth: {
            //user: 'email@dot.tld',
            //pass: 'Use App Password here',
          //}
        //});

        // setup email data with unicode symbols
        let mailOptions = {
          from: '"Crave Password Resetter" <no-reply@crave.social>', // sender address
          to: "crave.surveillance@gmail.com", // list of receivers
          subject: "at Account password reset", // Subject line
          text: email, // plain text body
        };

        // send mail with defined transport object
        let info = await transporter.sendMail(mailOptions)

        console.log("Message sent: %s", info.messageId);
        // Preview only available when sending through an Ethereal account
        console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));

        // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
        // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
      });
    });
  });
});



    var entities = io.of('/entities');

    entities.on('connection', function(socket){
        socket.on('requestAllClients', function(data){
          var entity=data.entity;
          var username=data.username;

         if(entity==="ContentCreator"){
            var model=ContentCreatorModel;
          }
          else if(entity==="Core"){
            var model=CoreModel;
          }
          /*
          else if(entity==="Coordination"){
            var model=CoordinationModel;

          }

          else if(entity==="Client"){
            var model=ClientModel;
          }

          else if(entity==="Ad"){
            var model=AdModel;
          }
          else if(entity==="God"){
            var model=GodModel;
          }*/


          if(model===ContentCreatorModel || model===CoreModel){
            model.findOne({username:username}, function(err, user) {
              var clients=user.getClients();



              socket.emit('gottenAllClients', clients); // emit an event to the socket

            });
          }


          else{

              ClientModel.find({}, function(err, users) {


                var clients=[];
                for(var i=0; i<users.length;i++){
                    var clientObj={key:users[i]["username"], businessName:users[i]["businessName"], username:users[i]["username"]};
                    clients.push(clientObj);
                }
                socket.emit('gottenAllClients', clients); // emit an event to the socket

              })
            }


          });

        socket.on('requestClient', function(data){

              ClientModel.find({username:data}, function(err, user) {
                if (err){
                  //console.log(err);
                }
                else{

                socket.emit('gottenClient', user); // emit an event to the socket
                }
              })
            });

          //if creator
          //if core ..


              socket.on('requestAllContentCreators', function(data){
                    ContentCreatorModel.find({}, function(err, users) {

                      socket.emit('gottenAllContentCreators', users); // emit an event to the socket
                    })
                  });

                  socket.on('requestAllCores', function(data){
                        CoreModel.find({}, function(err, users) {
                          socket.emit('gottenAllCores', users); // emit an event to the socket
                        })
                      });

                //if creator
                //if core ..



                  socket.on('assignContentCreator', async function(data){
                        var msg='';
                        var stop;
                        var clientObj;
                        var contentCreatorOldUsername;

                        await  ClientModel.findOne({username:data.clientUsername}, function(err, user) {
                          if (err || user==undefined){
                            msg+="error";
                          }
                          else{

                            if(user.contentCreatorUsername==undefined||user.contentCreatorUsername==null||user.contentCreatorUsername==''){
                              user.contentCreatorUsername=data.contentCreatorUsername;
                               contentCreatorOldUsername="none";
                            }
                            else if(user.contentCreatorUsername.valueOf()==data.contentCreatorUsername.valueOf()){
                              socket.emit('ContentCreatorAssignedMsg', 'This content creator is already assigned to this client'); // emit an event to the socket
                               stop='true';
                            }
                            else{
                               contentCreatorOldUsername=user.contentCreatorUsername;
                              user.contentCreatorUsername=data.contentCreatorUsername;
                            }

                            if(stop!='true'){

                            msg+=user.contentCreatorUsername+" assigned to "+user.businessName;
                            if(data.configClicked!='true'){
                              user.popAndAdd(user.signUpQueue,"Core","Assign A Content Creator");

                            }


                          clientObj={key:user.username,username:user.username,businessName:user.businessName};
                            user.save();
                          }

                          }
                        })

                        if(stop!='true'){

                        ContentCreatorModel.findOne({username:data.contentCreatorUsername}, function(err, user) {
                          if (err || user== undefined){
                            msg+="error";
                          }
                          else{

                            var clients=user.clients;
                            var clientArr=[];
                            //console.log("clients:"+clients);

                            if (clients==undefined || clients==""){
                              clientArr.push(clientObj);
                              user.clients=clientArr;
                              //console.log("user.clients:"+user.clients);
                            }
                            else{
                              //on old client
                              clients.push(clientObj);
                            }
                          user.clientUsername=data.clientUsername;
                          msg+= "assigned clients:"+user.clients;
                          }

                          user.save();

                          socket.emit('ContentCreatorAssignedMsg', msg); // emit an event to the socket

                        })

                      if(contentCreatorOldUsername!='none'){
                        //console.log("contentCreatorOldUsername: "+contentCreatorOldUsername);
                        ContentCreatorModel.findOne({username:contentCreatorOldUsername}, function(err, user) {
                          if (err || user== undefined){
                            msg+="error";
                          }
                          else{

                            var clients=user.clients;
                            //console.log("clients:"+clients);
                              //on old client

                              var foundClient = clients.find(function(element) {
                                if(element.username.valueOf()==data.clientUsername.valueOf()){
                                return element;
                                }
                              });

                              var index = clients.indexOf(foundClient);
                              clients.splice(index, 1);
                              user.clients=clients;

                            }
                          user.clientUsername='';

                          user.save();


                        })
                      }
                    }


                      });

                      socket.on('assignCore', async function(data){
                        var stop;
                            var msg='';
                            var clientObj;
                            var coreOldUsername;
                            await  ClientModel.findOne({username:data.clientUsername}, function(err, user) {
                              if (err || user==undefined){
                                msg+="error";
                              }
                              else{

                                if(user.coreUsername==undefined||user.coreUsername==null||user.coreUsername==''){
                                  user.coreUsername=data.coreUsername;
                                   coreOldUsername="none";
                                }
                                else if(user.coreUsername.valueOf()==data.coreUsername.valueOf()){
                                  socket.emit('CoreAssignedMsg', 'This core is already assigned to this client'); // emit an event to the socket

                                   stop='true';
                                }
                                else{
                                   coreOldUsername=user.coreUsername;
                                  user.coreUsername=data.coreUsername;
                                }

                              if(stop!='true'){

                                //console.log(stop);
                                msg+=user.coreUsername+" assigned to "+user.businessName;
                                if(data.configClicked!='true'){
                                  user.popAndAdd(user.signUpQueue,"God","Assign A Core");

                                }


                              clientObj={key:user.username,username:user.username,businessName:user.businessName};
                                user.save();

                                }

                              }
                            })

                            if(stop!='true'){
                              //console.log("stop again:"+stop);


                            CoreModel.findOne({username:data.coreUsername}, function(err, user) {
                              if (err || user== undefined){
                                msg+="error";
                              }
                              else{

                                var clients=user.clients;
                                var clientArr=[];
                                //console.log("clients:"+clients);

                                if (clients==undefined || clients==""){
                                  clientArr.push(clientObj);
                                  user.clients=clientArr;
                                  //console.log("user.clients:"+user.clients);
                                }
                                else{
                                  //on old client
                                  clients.push(clientObj);
                                }
                              user.clientUsername=data.clientUsername;
                              msg+= "assigned clients:"+user.clients;
                              }

                              user.save();

                              socket.emit('CoreAssignedMsg', msg); // emit an event to the socket

                            })

                          if(coreOldUsername!='none'){
                            CoreModel.findOne({username:coreOldUsername}, function(err, user) {
                              if (err || user== undefined){
                                msg+="error";
                              }
                              else{

                                var clients=user.clients;
                                //console.log("clients:"+clients);
                                  //on old client

                                  var foundClient = clients.find(function(element) {
                                    if(element.username.valueOf()==data.clientUsername.valueOf()){
                                    return element;
                                    }
                                  });

                                  var index = clients.indexOf(foundClient);
                                  clients.splice(index, 1);
                                  user.clients=clients;

                                }
                              user.clientUsername='';

                              user.save();


                            })
                          }

                        }


                          });

});

    var calendar = io.of('/calendar');

    calendar.on('connection', function(socket){
      socket.on('createCalendarItem', function(data){
          ClientModel.findOne({ username: data }, function(err, user) {
          var items;
          if (user.getApprovalItems==undefined || user.getApprovalItems==[]){
             items={needed:"none"};
          }
          else{
            items={needed:user.getApprovalItems};
          }
          socket.emit('gottenApprovalItems', items); // emit an event to the socket

          });
        });

    });



    var getClient = io.of('/client');

    calendar.on('connection', function(socket){
      socket.on('createCalendarItem', function(data){
          ClientModel.findOne({ username: data }, function(err, user) {
          var items;
          if (user.getApprovalItems==undefined || user.getApprovalItems==[]){
             items={needed:"none"};
          }
          else{
            items={needed:user.getApprovalItems};
          }
          socket.emit('gottenApprovalItems', items); // emit an event to the socket

          });
        });

    });


    var clientConfig = io.of('/clientConfig');

    clientConfig.on('connection', function(socket){
        socket.on('requestAllServices', function(data){
              ClientModel.findOne({username:data}, function(err, user) {
                socket.emit('gottenAllServices', user.services); // emit an event to the socket
              })
            });

            socket.on('requestRemoval',  function(data){
                  ClientModel.findOne({username:data.clientUsername}, async function(err, user) {
                    await user.removeService(data.service);
                    user.save();
                  })
                });


      socket.on('requestAllAddServices', function(data){
              ClientModel.findOne({username:data}, function(err, user) {

                var dataSource=[{key:"2HourPhotography",value:"Two Hours of Photography"},{key:"4HourPhotography",value:"Four Hours of Photography"},
                      {key:"Influencers", value:"Influencer Management"},{key:"Ads", value:"Ad Management"},
                      {key:"15Posts", value:"Fifteen Posts"},{key:"30Posts", value:"Thirty Posts"},{key:"Surveillance", value:"Surveillance"},
                      {key:"EngagementCampaign", value:"Engagement Campaign"}]

                var RemoveServices=[];



                      for(var j=0;j<dataSource.length;j++){

                          for(var i=0;i<user.services.length;i++){

                            if(user.services[i].valueOf()==dataSource[j]["key"].valueOf()){
                              RemoveServices.push(dataSource[j]["key"]);
                            }
                            else{
                              if(user.services[i].valueOf()=="4HourPhotography" && dataSource[j]["key"].valueOf()=="2HourPhotography"){
                                RemoveServices.push(dataSource[j]["key"]);
                              }
                              else if(user.services[i].valueOf()=="2HourPhotography" && dataSource[j]["key"].valueOf()=="4HourPhotography"){
                                RemoveServices.push(dataSource[j]["key"]);
                              }
                              else if(user.services[i].valueOf()=="15Posts" && dataSource[j]["key"].valueOf()=="30Posts"){
                                RemoveServices.push(dataSource[j]["key"]);
                              }
                              else if(user.services[i].valueOf()=="30Posts" && dataSource[j]["key"].valueOf()=="15Posts"){
                                RemoveServices.push(dataSource[j]["key"]);
                              }

                            }

                          }
                        }

                        for(var p=0;p<RemoveServices.length;p++){

                          var found = dataSource.find(function(element) {
                            if(element.key.valueOf()==RemoveServices[p].valueOf()){
                            return element;
                            }
                          });

                          var index = dataSource.indexOf(found);
                          dataSource.splice(index, 1);

                        }




                  socket.emit('gottenAllAddServices', dataSource); // emit an event to the socket
                       })
                     });

            socket.on('requestAdd', function(data){
              //console.log("data:"+data)

                  ClientModel.findOne({username:data.clientUsername}, async function(err, user) {
                    //console.log("service:"+data.service)

                    await user.addService(data.service);
                    user.save();
                      })
                    });




          });

var package = io.of('/package');

  package.on('connection', function(socket){
    socket.on('startFreeTrial',  function(data){
      var msg='';


      ClientModel.findOne({username:data.clientUsername}, async function(err, user) {
        if(user==undefined || err){
          //console.log("no model error")
        }
        else{

      await user.startFreeTrial(data.selectedPackage);

        msg+="successfully added:";


        user.save(function (err) {
          if(err) {
            msg+=err;
          }
        });

        socket.emit('selectPackageMsg', msg); // emit an event to the socket


                      }


                    })
                  });
                });


  var calendarHome = io.of('/calendarHome');
  calendarHome.on('connection', function(socket){
    socket.on('getAllCalendarItems', function(data){


      ClientModel.findOne({ username: data.clientUsername}, function(err, user) {

        var neededCalendar=user.getCalendarAndToDos(data.entity)["neededCalendar"];

        finalDates =[ ...neededCalendar.keys() ];
        //console.log("From INDEX: "+ finalDates)

          socket.emit('gottenAllCalendarItems', neededCalendar); // emit an event to the socket

        });
    });

});


var kyc = io.of('/kyc');

kyc.on('connection', function(socket){
    socket.on('submitKYC', function(data){
          ClientModel.findOne({username:data.clientUsername}, function(err, user) {
            user.kyc["age"]=data.age;

            user.popAndAdd(user.signUpQueue,"Client","KYC");

            user.save();

            socket.emit('submittedKYC', "age="+user.kyc["age"]); // emit an event to the socket

          })
        });
      });


var toDos = io.of('/toDos');

toDos.on('connection', function(socket){
  socket.on('requestToDos', function(data){
    ClientModel.findOne({ username: data.clientUsername }, async function(err, user) {

      var newToDosArr=[];

      await user.initializeWithDate();

      var neededToDos=user.getCalendarAndToDos(data.entity)["neededToDos"];

      if(neededToDos!=undefined){
          for(var i=0; i<neededToDos.length;i++){
          var item= neededToDos[i];
          var calendarMessage= item["calendarMessage"];
          var screen=  item["screen"];
          newToDosArr.push({screen:screen,calendarMessage:calendarMessage});

          }
      }
      user.save();



  socket.emit('gottenToDos', newToDosArr); // emit an event to the socket


    });
      });
    });




    var call = io.of('/call');

    call.on('connection', function(socket){
      socket.on('doneCall', function(data){

        ClientModel.findOne({ username: data.clientUsername }, function(err, user) {
            user.popAndAdd(user.callQueue,data.entity,"Monthly Call");

          user.save();

            });
          });
        });


        var done = io.of('/done');

        done.on('connection', function(socket){
          socket.on('done', function(data){

            ClientModel.findOne({ username: data.clientUsername }, function(err, user) {

                user.popAndAdd(user.motherQueue,data.entity,data.msg);
                user.save();

                });
              });
            });


            var strategy = io.of('/strategy');

            strategy.on('connection', function(socket){
              socket.on('createStrategy', function(data){

                ClientModel.findOne({ username: data.clientUsername }, function(err, user) {


                    user.popAndAdd(user.motherQueue,data.entity,data.msg);

                    var strat={description:data.description,image:{contentType:'image/png',data:data.base64}}

                    user.strategy=strat;


                    user.save();

                    });
                  });

                  socket.on('getStrategy', function(data){

                    ClientModel.findOne({ username: data.clientUsername }, function(err, user) {
                      socket.emit('gottenStrategy', {image:user.strategy["image"], description:user.strategy["description"]}); // emit an event to the socket


                        });
                      });


                });


                var content = io.of('/content');

                content.on('connection', function(socket) {
                  let id = null;
                  let stream = null;
                  let writePromise = null;

                  socket.on('upload', (data) => {
                    //console.log('upload started');
                    stream = createStream();
                    const ext = data.uri.split('.').pop();
                    const type = data.type;

                    const options = {
                      filename: `${uuid.v4()}.${ext}`,
                      contentType: `${type}/${ext}`,
                    };

                    writePromise = new Promise((resolve, reject) => {
                      MediaModel.write(options, stream, (err, attachment) => {
                        id = attachment._id;
                        //console.log('wrote....')
                        //console.log('error', err);
                        //console.log('attachment', attachment);
                        resolve(id);
                      });
                    });
                  });

                  socket.on('chunk', (data) => {
                    const chunk = data.chunk;
                    //console.log('got chunk', data.index, chunk);
                    stream.push(Buffer.from(chunk, 'base64'));
                  });

                  socket.on('upload-end', (data, callback) => {
                    //console.log('upload-ended');
                    stream.push(null);
                    callback({ status: 'complete' });
                  });

                  socket.on('createPost', function(data) {
                    ClientModel.findOne({ username: data.clientUsername }, async function(err, user) {
                      //console.log('creating post...')

                //        user.popAndAdd(user.motherQueue,data.entity,data.msg);

                      var post = {
                        tags: data.tags,
                        caption: data.caption,
                        hashtags: data.hashtags,
                        location: data.location,
                        facebook: data.facebook,
                        instagram: data.instagram,
                        date: data.date,
                        time: data.time,
                        file: id,
                      };

                      await writePromise;

                      //console.log('id', id);
                      const readStream = MediaModel.readById(id);
                      //console.log(readStream);
                      MediaModel.findOne({ _id: id }, (err, file) => {
                        //console.log('err', err);
                        //console.log('file', file);
                      })

                      readStream.pipe(fs.createWriteStream(`read.jpg`));

                      if(user.contentCalendar==undefined){
                        var contentCalendar= {
                          posts: [post]
                        };
                        user.contentCalendar = contentCalendar;
                      }

                      user.contentCalendar["posts"].unshift(post);
                      user.save();
                    });
                  });

                  socket.on('getCalendar', function(data){
                    ClientModel.findOne({ username: data.clientUsername }, function(err, user) {
                      //console.log(user);
                      //console.log(user.contentCalendar);

                      socket.emit('gottenCalendar', user.contentCalendar["posts"]); // emit an event to the socket
                    });
                  });
                });

const createStream = () => {
  const readable = new Readable({
    read() {}
  });
  return readable;
}


                        var activity = io.of('/activity');

                        activity.on('connection', function(socket){
                            socket.on('requestAllActivity', function(data){

                              ClientModel.findOne({ username: data }, function(err, user) {
                                    socket.emit('gottenAllActivity', user.activityArray); // emit an event to the socket
                                  })
                                });
                              });


                              var rating = io.of('/rating');

                              rating.on('connection', function(socket){
                                  socket.on('giveRating', function(data){


                                    ClientModel.findOne({ username: data.clientUsername }, async function(err, user) {
                                      //get appropriate array based on data.ratingType
                                      //fill the array with the rating
                                      //make some calculations

                                  /*  if(user[data.ratingType]=="strategyRating"){
                                      var ratingArr=user.strategyRating;
                                    }*/

                                    await  user[data.ratingType].push(data.rating);

                                      console.log(user[data.ratingType]);

                                      console.log(user.strategyRating);

                                      user.save();


                                        })
                                      });
                                    });
                              //if creator
                              //if core ..



io.on('connection',function(socket){
  //console.log('there is a new connection');

});

http.listen('3000', function(){
  //console.log('listening on *:3000');
});
