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
var ffmpeg = require('fluent-ffmpeg');
var Grid = require('gridfs-stream');

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
var ThumbnailModel = atObjects.ThumbnailModel;
var ContentCalendarModel = atObjects.ContentCalendarModel;
var ShootPlanModel = atObjects.ShootPlanModel;
var PhotoShootModel = atObjects.PhotoShootModel;
var InfluencerPlanModel= atObjects.InfluencerPlanModel;
var InfluencerEventModel= atObjects.InfluencerEventModel;
var SurveillanceModel= atObjects.SurveillanceModel;
var AnalyticModel= atObjects.AnalyticModel;
var getMediaModel = atObjects.getMediaModel;

var InfluencerModel = atObjects.InfluencerModel;


//testcommentchange

var MediaModel = null;
var gfs = null;
mongoose.connect('mongodb://localhost/test');
mongoose.connection.once('open', () => {
  MediaModel = getMediaModel(mongoose.connection);
  gfs = Grid(mongoose.connection.db, mongoose.mongo);
  gfs.collection(MediaModel.collection.name.replace('.files', ''));
});

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

app.get('/video/:id', (req, res) => {
  const needsRedirection = req.params.id.split('.').length === 1;
  const id = req.params.id.split('.')[0];
  console.log(`sending video ${id}`)
  MediaModel.findById(id, (err, file) => {
    if (err) {
      console.log('error', err);
      res.writeHead(500);
      return res.end('Error occurred');
    }

    if (needsRedirection) {
      return res.redirect(`/video/${id}.${file.contentType.split('/').pop()}`);
    }

    console.log(file);
    const size = file.length;
    const range = req.headers.range


    if (range) {
      console.log('it is a range...')

      const parts = range.replace(/bytes=/, "").split("-")
      const start = parseInt(parts[0], 10)
      const end = parts[1]
        ? parseInt(parts[1], 10)
        : size - 1

      console.log(parts, start, end);
      const chunksize = (end-start) + 1;

      const gridFile = gfs.createReadStream({
        _id: mongoose.mongo.ObjectID(id),
        range: {
          startPos: start,
          endPos: end,

        }
      });

      const head = {
        'Content-Range': `bytes ${start}-${end}/${size}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunksize,
        'Content-Type': file.contentType,
      }

      res.writeHead(206, head);
      gridFile.pipe(res);
      gridFile.on('error', console.log)
    }
    else {
      const head = {
        'Content-Length': size,
        'Content-Type': file.contentType,
      }
      const readStream = file.read();
      res.writeHead(200, head);
      readStream.pipe(res);
    }
  });
});

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

authentication.on('connection', function(socket) {
  console.log('connection established...');

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
            var LoginStatus = { status:"success", businessName: user.businessName, firstName:user.firstName };
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
                console.log('users', users);

                var clients=[];
                for(var i=0; i<users.length;i++){
                    var clientObj={key:users[i]["username"], businessName:users[i]["businessName"], username:users[i]["username"]};
                    clients.push(clientObj);
                }
                console.log('clients', clients);
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
                socket.on('requestAllPhotographers', async function(data){

                  var photographers;
                  var selectedPhotographers;
                  var allWithSelectedPhotographersArray=[];

                      await PhotographerModel.find({}, async function(err, users) {
                         photographers= users;
                      });

                      await  ClientModel.findOne({username:data.clientUsername}, async function(err, user) {
                          selectedPhotographers=user.photographers;
                      });


                      for (var i = 0; i < photographers.length; i++) {
                        var selected=false;

                        for (var j = 0; j< selectedPhotographers.length; j++) {
                            if(selectedPhotographers[j]["username"]==photographers[i]["username"]) {
                              selected=true;
                              }
                            }
                           allWithSelectedPhotographersArray.push({key:photographers[i]["username"], firstName:photographers[i]["firstName"],firstName:photographers[i]["lastName"], username:photographers[i]["username"],selected:selected});
                         };

                        socket.emit('gottenAllPhotographers', allWithSelectedPhotographersArray); // emit an event to the socket
                      })

                socket.on('assignPhotographers', function(data){

                  ClientModel.findOne({username:data.clientUsername}, function(err, client) {

                  var photographers;
                  var selectedPhotographers=data.selectedPhotographers;
                  var assignedPhotographers=[];

                  if(selectedPhotographers.length==0){
                    ClientModel.findOne({username:data.clientUsername}, function(err, client) {

                    client.photographers=[];
                    client.save();
                    })
                  }

                  var photographerArr=[]


                    for(var i = 0; i < selectedPhotographers.length; i++) {
                      var photographerUsername=selectedPhotographers[i]["username"];
                        PhotographerModel.findOne({username:photographerUsername}, function(err, user) {

                          //if(client.photographers.indexOf(user)<0){
                          //  console.log("to Push");
                            photographerArr.push(user);
                        //  }
                          console.log("client.photographers "+client.photographers)
                          client.photographers=photographerArr;
                          client.save();

                      });
                      }
                    })
                  });

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


socket.on('getPhotographerCalendarItems', function(data){

  PhotographerModel.findOne({ username: data.username}, function(err, user) {

    var neededCalendar=user.photographerCalendar;

  //  finalDates =[ ...neededCalendar.keys() ];
    //console.log("From INDEX: "+ finalDates)

      socket.emit('gottenPhotographerCalendarItems', neededCalendar); // emit an event to the socket

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


            var planComments = io.of('/planComments');
            planComments.on('connection', function(socket){

              socket.on('postComment', function(data){

                ClientModel.findOne({ username: data.clientUsername }, function(err, user) {

                  if(data.plan=="ShootPlan"){
                  user.shootPlan["comments"].push(data.commentObj);

                  user.save();
                    }

                    });
                  });

                  socket.on('postSubComment', function(data){

                    ClientModel.findOne({ username: data.clientUsername }, function(err, user) {


                      if(data.plan=="ShootPlan"){


                      var commentArr= data.item["subComments"];
                      commentArr.push(data.commentObj);

                      var stateComments=user.shootPlan["comments"];
                      console.log("data.item:"+data.item);


                     var found = stateComments.find(function(element) {
                            if(element.key.valueOf()==data.commentKey.valueOf()){
                              return element;
                              }
                            });

                      var index = stateComments.indexOf(found);



                      console.log("stateComments:"+stateComments);

                      console.log("index:"+index);

                      stateComments[index]["subComments"]=commentArr;

                      user.shootPlan["comments"]=stateComments;

                      console.log("5")

                        }

                        user.save();


                        });
                      });



                      socket.on('resolvedComment', function(data){

                        ClientModel.findOne({ username: data.clientUsername }, function(err, user) {


                          if(data.plan=="ShootPlan"){

                          var commentArr= user.shootPlan["comments"];

                          var found = commentArr.find(function(element) {
                          if(element.key.valueOf()==data.commentKey.valueOf()){
                          return element;
                          }
                          });
                          var index = commentArr.indexOf(found);


                          commentArr[index]["resolved"]=data.setToBoolean;

                          user.shootPlan["comments"]=commentArr;

                            }

                            user.save();


                            });
                          });


              socket.on('getComments', function(data){
                ClientModel.findOne({ username: data.clientUsername }, function(err, user) {
                  if(data.plan=="ShootPlan"){
                    console.log("user.shootPlan "+user.shootPlan );
                  socket.emit('gottenComments', {comments:user.shootPlan["comments"]}); // emit an event to the socket
                }


                    });
                  });



                  socket.on('deleteComment', function(data){
                    console.log("deleteComment")

                    ClientModel.findOne({ username: data.clientUsername }, function(err, user) {
                      if(data.plan=="ShootPlan"){
                        console.log("commentArr:"+commentArr)
                        var commentArr= user.shootPlan["comments"];

                        var found = commentArr.find(function(element) {
                        if(element.key.valueOf()==data.commentKey.valueOf()){
                        return element;
                        }
                        });
                        var index = commentArr.indexOf(found);
                        commentArr.splice(index, 1);

                        user.shootPlan["comments"]=commentArr;
                        console.log("commentArr:"+commentArr)

                    }
                    user.save()



            });
          });

          socket.on('deleteSubComment', function(data){
            console.log("yallow")

            ClientModel.findOne({ username: data.clientUsername }, function(err, user) {
              if(data.plan=="ShootPlan"){

                var stateComments= user.shootPlan["comments"];

                var found = stateComments.find(function(element) {
                          var eleCommentArr=element["subComments"];
                          for(var i=0; i<eleCommentArr.length;i++){
                            if(eleCommentArr[i].key.valueOf()==data.subCommentKey.valueOf()){
                            return element;
                            }
                          }
                        });


                var subCommentArr= found.subComments;
                console.log("subCommentArr:"+subCommentArr);

                var commentIndex = stateComments.indexOf(found);


                var found = subCommentArr.find(function(element) {
                       if(element.key.valueOf()==data.subCommentKey.valueOf()){
                         return element;
                         }
                       });

                 var subCommentIndex = subCommentArr.indexOf(found);

          //      var subCommentIndex = subCommentArr.indexOf(data.item);

                console.log("commentIndex: "+commentIndex)
                console.log("subCommentIndex: "+subCommentIndex)
                if (subCommentArr.length==1){
                subCommentArr=[];
              }
              else{
                subCommentArr.splice(subCommentIndex, 1);

              }
              stateComments[commentIndex]["subComments"]=subCommentArr;

              user.shootPlan["comments"]=stateComments;



            }
            user.save()



    });
  });
        });


            var photography = io.of('/photography');
            photography.on('connection', function(socket){

              socket.on('requestAllShoots', function(data){

                ClientModel.findOne({ username: data.clientUsername }, function(err, user) {
                  socket.emit('gottenAllShoots', user.photoShoots); // emit an event to the socket

                    });
                  });

              socket.on('createShoot', function(data){

                ClientModel.findOne({ username: data.clientUsername }, async function(err, user) {
                  var newDate= new Date();
                  var IndiaDateToday=newDate.toLocaleDateString('en-US', {timeZone: "Asia/Kolkata"}); //1/27/2019

                  var name="initiated:"+IndiaDateToday;

                    var newShoot= {name:name,shortListedPhotographers:[],key:data.key, client:user.businessName, clientUsername:user.username};
                    var existingShoots=user.photoShoots;
                    if(existingShoots==undefined || existingShoots==null){
                      existingShoots=[];
                    }

                    existingShoots.unshift(newShoot);

                    user.photoShoots=existingShoots;

                  await user.save();
                    socket.emit('shootCreated',''); // emit an event to the socket


                      });
                    });

                    socket.on('deleteShoot', function(data){

                      ClientModel.findOne({ username: data.clientUsername }, async function(err, user) {

                        var photoShoots= user.photoShoots;

                        var found = photoShoots.find(function(element) {
                          console.log("element:"+element);
                          console.log("data.key"+data.key);
                        if(element.key.valueOf()==data.key.valueOf()){
                        return element;
                        }
                        });

                        var index = photoShoots.indexOf(found);

                        console.log("indo"+index)

                        photoShoots.splice(index, 1);
                        user.photoShoots=photoShoots;
                      await  user.save();
                        socket.emit('shootDeleted',''); // emit an event to the socket

                            });
                          });





              socket.on('sendToCore', function(data){

                ClientModel.findOne({ username: data.clientUsername }, function(err, user) {

                  //  user.popAndAdd(user.motherQueue,data.entity,data.msg);

                    var plan={description:data.description}

                    var foundShoot = user.photoShoots.find(function(element) {
                      if(element.key.valueOf()==data.key.valueOf()){
                      return element;
                      }
                    });

                    foundShoot.shootPlan=plan;
                    foundShoot.shootPlanCreated=true;

                    user.save();

                    });
                  });

                  socket.on('approveShootPlan', function(data){

                    ClientModel.findOne({ username: data.clientUsername }, function(err, user) {

                      //  user.popAndAdd(user.motherQueue,data.entity,data.msg);

                        var foundShoot = user.photoShoots.find(function(element) {
                          if(element.key.valueOf()==data.key.valueOf()){
                          return element;
                          }
                        });

                        foundShoot.shootPlanApproved=true;

                        user.save();

                        });
                      });



                  socket.on('getShootPlan', function(data){

                    ClientModel.findOne({ username: data.clientUsername }, function(err, user) {
                      socket.emit('gottenShootPlan', {description:user.shootPlan["description"]}); // emit an event to the socket


                        });
                      });

                      socket.on('requestAllClientPhotographers', async function(data){

                        var photographers;
                        var selectedPhotographers;
                        var allWithSelectedPhotographersArray=[];

                            await  ClientModel.findOne({username:data.clientUsername}, async function(err, user) {
                                var clientPhotographers=user.photographers;

                                var foundShoot = user.photoShoots.find(function(element) {
                                  if(element.key.valueOf()==data.key.valueOf()){
                                  return element;
                                  }
                                });
                            //    var index = clients.indexOf(foundClient);

                                var shortListedPhotographers=foundShoot.shortListedPhotographers;
                                var shortListedPhotographersWithClientDatesKnown=foundShoot.shortListedPhotographersWithClientDatesKnown;


                                for (var i = 0; i < clientPhotographers.length; i++) {
                                  var invited=false;

                                  for (var j = 0; j< shortListedPhotographers.length; j++) {
                                      if(shortListedPhotographers[j]["username"]==clientPhotographers[i]["username"]) {
                                        clientPhotographers[i]["invited"]=true;
                                        }
                                      }

                                      for (var k = 0; k< shortListedPhotographersWithClientDatesKnown.length; k++) {
                                          if(shortListedPhotographersWithClientDatesKnown[k]["username"]==clientPhotographers[i]["username"]) {
                                            clientPhotographers[k]["invitedWithDatesKnown"]=true;
                                            }
                                          }
                                   };

                                   var allWithShortlistedSelectedPhotographers=clientPhotographers;
                                   socket.emit('gottenAllClientPhotographers', {shoot:foundShoot,photographers:allWithShortlistedSelectedPhotographers}); // emit an event to the socket


                              });

                            })

                            socket.on('requestAllShootsFromAllClients', async function(data){

                              var allShoots=[];

                                  await  PhotographerModel.findOne({username:data.username}, async function(err, photog) {
                                    var keyObjs=photog.photoShootKeys;
                                    console.log("keyObjs:"+keyObjs);
                                    for(var i=0;i<keyObjs.length;i++){
                                      var currKey=keyObjs[i]["key"];
                                      var currClientUsername=keyObjs[i]["clientUsername"];
                                      var shootNeeded;
                                      await  ClientModel.findOne({username:currClientUsername}, async function(err, user) {

                                        var foundShoot = await user.photoShoots.find(function(element) {
                                          if(element.key.valueOf()==currKey.valueOf()){
                                          return element;
                                          }
                                        });
                                         shootNeeded=foundShoot;
                                    });
                                    console.log("foundShoot:"+shootNeeded);

                                    await allShoots.push(shootNeeded);
                                  }
                                  console.log("allShoots:"+allShoots);

                                         socket.emit('gottenAllShootsFromAllClients', allShoots); // emit an event to the socket

                                    });

                                  })

                                  socket.on('getMinMaxDates', async function(data){
                                    await  ClientModel.findOne({username:data.clientUsername}, async function(err, user) {
                                      var foundShoot = user.photoShoots.find(function(element) {
                                        if(element.key.valueOf()==data.key.valueOf()){
                                        return element;
                                        }
                                      });
                                      var minDate=foundShoot.minDate;
                                      var maxDate=foundShoot.maxDate;

                                      socket.emit('gottenMinMaxDates', {shoot:foundShoot,minDate:minDate,maxDate:maxDate,details:foundShoot.detailsForPhotographers});

                                        })
                                      })


                            socket.on('invitePhotographers', async function(data){


                                  await  ClientModel.findOne({username:data.clientUsername}, async function(err, user) {

                                        var clientPhotographers=user.photographers;

                                        var foundShoot = user.photoShoots.find(function(element) {
                                          if(element.key.valueOf()==data.key.valueOf()){
                                          return element;
                                          }
                                        });

                                        foundShoot.shortListedPhotographers=data.shortListedPhotographers;
                                        foundShoot.minDate=data.minDate;
                                        foundShoot.maxDate=data.maxDate;
                                        foundShoot.detailsForPhotographers=data.details;
                                        foundShoot.duration=data.duration;
                                        foundShoot.mediaLink=data.mediaLink;


                                        console.log("foundShoot.minDate:"+foundShoot.minDate);
                                        console.log("  foundShoot.maxDate:"+  foundShoot.maxDate);
                                        console.log("  foundShoot.detailsForPhotographers:"+ foundShoot.detailsForPhotographers);
                                        console.log("  foundShoot.duration:"+ foundShoot.duration);
                                        console.log("  foundShoot.mediaLink:"+ foundShoot.mediaLink);



                                        for(var i=0;i<foundShoot.shortListedPhotographers.length;i++){
                                          var photographer=foundShoot.shortListedPhotographers[i];
                                          await  PhotographerModel.findOne({username:photographer.username}, async function(err, photog) {


                                            var foundKey = photog["photoShootKeys"].find(function(element) {
                                              if(element.key.valueOf()==data.key.valueOf()){
                                              return element;
                                              }
                                              else{
                                                return false;
                                              }
                                            });

                                            console.log("foundKey:"+foundKey)


                                            if(foundKey==false || foundKey==undefined ){
                                              photog["photoShootKeys"].push({key:data.key,clientUsername:data.clientUsername});
                                              photog.save();
                                              }

                                              //also invite photographer with notif
                                              });
                                            }
                                        user.save();
                                    });

                                  });


                                  socket.on('invitePhotographersWithClientDates', async function(data){

                                    var photographers;
                                    var selectedPhotographers;
                                    var allWithSelectedPhotographersArray=[];

                                        await  ClientModel.findOne({username:data.clientUsername}, async function(err, user) {

                                              var clientPhotographers=user.photographers;

                                              var foundShoot = user.photoShoots.find(function(element) {
                                                if(element.key.valueOf()==data.key.valueOf()){
                                                return element;
                                                }
                                              });

                                              foundShoot.shortListedPhotographersWithClientDatesKnown=data.shortListedPhotographers;
                                              foundShoot.detailsForPhotographers=data.details;

                                              for(var i=0;i<foundShoot.shortListedPhotographers.length;i++){
                                                var photographer=foundShoot.shortListedPhotographers[i];
                                                await  PhotographerModel.findOne({username:photographer.username}, async function(err, photog) {

                                                  var foundKey = photog["photoShootKeys"].find(function(element) {
                                                    if(element.key.valueOf()==data.key.valueOf()){
                                                    return element;
                                                    }
                                                    else{
                                                      return false;
                                                    }
                                                  });


                                                  if(foundKey==false || foundKey==undefined){
                                                    photog["photoShootKeys"].push({key:data.key,clientUsername:data.clientUsername});
                                                    photog.save();
                                                  }
                                                    //also invite photographer with notif
                                                    });
                                                  }

                                              user.save();
                                            socket.emit('photographersInvited', ''); // emit an event to the socket

                                          });

                                        });

                                  socket.on('photographerAcceptScheduleShoot', async function(data){
                                        await  ClientModel.findOne({username:data.clientUsername}, async function(err, user) {

                                          var foundShoot = await user.photoShoots.find(function(element) {
                                            if(element.key.valueOf()==data.key.valueOf()){
                                            return element;
                                            }
                                          });


                                          await  PhotographerModel.findOne({username:data.photographerUsername}, async function(err, photog) {

                                            var foundPhotographer = await foundShoot.photographerOptions.find(function(element) {
                                              if(element.photographer.username.valueOf()==photog.username.valueOf()){
                                              return element;
                                              }
                                              else{
                                                return false;
                                              }
                                            });

                                            console.log("2");

                                            if(foundPhotographer==false || foundPhotographer==undefined){

                                              console.log("3")

                                              var dateOptions=[];
                                              if(data.option1!=''){
                                                var key1= Math.random().toString(36).substring(7);
                                                var obj1={key:key1,selected:false,date:data.option1}
                                                dateOptions.push(obj1);
                                              }

                                              console.log("4")


                                              if(data.option2!=''){
                                                var key2= Math.random().toString(36).substring(7);
                                                var obj2={key:key2,selected:false,date:data.option2}
                                                dateOptions.push(obj2);
                                              }

                                              console.log("5")

                                              if(data.option3!=''){
                                                var key3= Math.random().toString(36).substring(7);
                                                var obj3={key:key3,selected:false,date:data.option3}
                                                dateOptions.push(obj3);
                                              }

                                              console.log("6");


                                              foundShoot.photographerOptions.push({photographer:photog,dateOptions:dateOptions,acceptanceKey:data.acceptanceKey});








                                              console.log("foundShoot.photographerOptions:"+  foundShoot.photographerOptions)


                                            }

                                          });

                                          user.save();

                                        });


                                    });

                                    socket.on('photographerAcceptScheduleShootWithDates', async function(data){
                                          await  ClientModel.findOne({username:data.clientUsername}, async function(err, user) {

                                            var foundShoot = user.photoShoots.find(function(element) {
                                              if(element.key.valueOf()==data.key.valueOf()){
                                              return element;
                                              }
                                            });
                                            await  PhotographerModel.findOne({username:data.photographerUsername}, async function(err, photog) {
                                                foundShoot.chosenShootRequestByCoordination.confirmedPhotographer=photog;
                                                foundShoot.chosenShootRequestByCoordination.photographerConfirmed=true;
                                                foundShoot.chosenShootRequestByCoordination.confirmedDate=data.selectedDate;

                                                foundShoot.status="The shoot is confirmed!"


                                                    var stringedConfirmedDate=data.selectedDate.date;
                                                    var dateHelper=stringedConfirmedDate.split("@");
                                                    var date=dateHelper[0];
                                                    var time=dateHelper[1];


                                                    var subDateHelper= date.split(" ");
                                                    var year=subDateHelper[2];
                                                    var monthName=subDateHelper[1];
                                                    var day=subDateHelper[0];

                                                    var monthNames = ["January", "February", "March", "April", "May", "June",
                                                      "July", "August", "September", "October", "November", "December"
                                                    ];

                                                    var month=monthNames.indexOf(monthName)+1;

                                                    if(month<10){
                                                      month="0"+month;
                                                    }
                                                    if(day<10){
                                                      day="0"+day;
                                                    }

                                                    var dateNeeded= year+"-"+month+"-"+day;
                                                    var photographerDateMsg= "Shoot for "+user.businessName + " at "+foundShoot.chosenShootRequestByCoordination.confirmedLocation.location+ " at "+time;
                                                    var clientDateMsg= "Shoot with "+photog.firstName+" "+photog.lastName+ "at "+foundShoot.chosenShootRequestByCoordination.confirmedLocation.location+" at "+time;

                                                    foundShoot.chosenShootRequestByCoordination.photographerDateMsg=photographerDateMsg;
                                                    foundShoot.chosenShootRequestByCoordination.clientDateMsg=clientDateMsg;


                                                    if(photog.photographerCalendar==undefined){
                                                      photog.photographerCalendar={ 'def': ['defo']};
                                                    }
                                                    var photogDateArr=photog.photographerCalendar.get(dateNeeded);

                                                    if (photogDateArr===undefined){
                                                      photogDateArr=[photographerDateMsg];

                                                      photog.photographerCalendar.set(dateNeeded,photogDateArr);
                                                    }
                                                    else{
                                                      photogDateArr.push(photographerDateMsg);

                                                      photog.photographerCalendar.set(dateNeeded,photogDateArr);

                                                    }


                                                    var entities=['Core','Client','ContentCreator','Coordination'];

                                                    for(var o=0;o<entities.length;o++){

                                                      var neededCalendar=user.getCalendarAndToDos(entities[o])["neededCalendar"];


                                                      var entityDateArr=neededCalendar.get(dateNeeded);

                                                      if (entityDateArr===undefined){
                                                        entityDateArr=[clientDateMsg];

                                                        neededCalendar.set(dateNeeded,entityDateArr);
                                                      }
                                                      else{
                                                        entityDateArr.push(clientDateMsg);

                                                        neededCalendar.set(dateNeeded,entityDateArr);

                                                      }

                                                    }


                                                  photog.save();


                                              user.save();

                                            });

                                          });
                                      });

                                    socket.on('photographerRejectScheduleShoot', async function(data){
                                          await  ClientModel.findOne({username:data.clientUsername}, async function(err, user) {
                                            var foundShoot = user.photoShoots.find(function(element) {
                                              if(element.key.valueOf()==data.key.valueOf()){
                                              return element;
                                              }
                                            });

                                            await  PhotographerModel.findOne({username:data.photographerUsername}, async function(err, photog) {
                                              var keyObjs=photog.photoShootKeys;

                                              var foundShoot = keyObjs.find(function(element) {
                                                if(element.key.valueOf()==data.key.valueOf()){
                                                return element;
                                                }
                                              });

                                              var index = keyObjs.indexOf(foundShoot);
                                              keyObjs.splice(index, 1);
                                              photog.save()


                                              });


                                          });
                                      });

                                      socket.on('photographerCancelShoot', async function(data){
                                            await  ClientModel.findOne({username:data.clientUsername}, async function(err, user) {
                                              var foundShoot = user.photoShoots.find(function(element) {
                                                if(element.key.valueOf()==data.key.valueOf()){
                                                return element;
                                                }
                                              });

                                              foundShoot.chosenShootRequestByCoordination.confirmedPhotographer=undefined;
                                              foundShoot.chosenShootRequestByCoordination.photographerConfirmed=false;
                                              foundShoot.chosenShootRequestByCoordination.photographerReasonForCancellation=data.reason;


                                              await  PhotographerModel.findOne({username:data.photographerUsername}, async function(err, photog) {
                                                var keyObjs=photog.photoShootKeys;

                                                var foundKey = keyObjs.find(function(element) {
                                                  if(element.key.valueOf()==data.key.valueOf()){
                                                  return element;
                                                  }
                                                });

                                                var index = keyObjs.indexOf(foundKey);
                                                keyObjs.splice(index, 1);


                                                    var stringedConfirmedDate=foundShoot.chosenShootRequestByCoordination.confirmedDate["date"];
                                                    var dateHelper=stringedConfirmedDate.split("@");
                                                    var date=dateHelper[0];
                                                    var time=dateHelper[1];

                                                    var subDateHelper= date.split(" ");
                                                    var year=subDateHelper[2];
                                                    var monthName=subDateHelper[1];
                                                    var day=subDateHelper[0];

                                                    var monthNames = ["January", "February", "March", "April", "May", "June",
                                                      "July", "August", "September", "October", "November", "December"
                                                    ];

                                                    var month=monthNames.indexOf(monthName)+1;

                                                    if(month<10){
                                                      month="0"+month;
                                                    }
                                                    if(day<10){
                                                      day="0"+day;
                                                    }

                                                    var dateNeeded= year+"-"+month+"-"+day;

                                                    var photogDateArr=photog.photographerCalendar.get(dateNeeded);

                                                    var index = photogDateArr.indexOf(foundShoot.chosenShootRequestByCoordination.photographerDateMsg);

                                                    photogDateArr.splice(index, 1);

                                                      photog.photographerCalendar.set(dateNeeded,photogDateArr);



                                                      var entities=['Core','Client','ContentCreator','Coordination'];

                                                      for(var o=0;o<entities.length;o++){

                                                        var neededCalendar=user.getCalendarAndToDos(entities[o])["neededCalendar"];

                                                        var entityDateArr=neededCalendar.get(dateNeeded);

                                                        var index = entityDateArr.indexOf(foundShoot.chosenShootRequestByCoordination.clientDateMsg);

                                                        entityDateArr.splice(index, 1);

                                                          neededCalendar.set(dateNeeded,entityDateArr);

                                                      }



                                                photog.save();
                                                user.save();

                                                });




                                            });
                                        });

                                        socket.on('confirmUpload', async function(data){
                                              await  ClientModel.findOne({username:data.clientUsername}, async function(err, user) {
                                                var foundShoot = user.photoShoots.find(function(element) {
                                                  if(element.key.valueOf()==data.key.valueOf()){
                                                  return element;
                                                  }
                                                });

                                                foundShoot.confirmUpload=true;
                                                user.save();
                                                console.log("foundShoot.confirmUpload:"+foundShoot.confirmUpload);
                                              });
                                          });

                                      socket.on('requestAllAcceptances', async function(data){
                                            await  ClientModel.findOne({username:data.clientUsername}, async function(err, user) {
                                              var foundShoot = user.photoShoots.find(function(element) {
                                                if(element.key.valueOf()==data.key.valueOf()){
                                                return element;
                                                }
                                              });

                                              var acceptances=foundShoot.photographerOptions;
                                              socket.emit('gottenAllAcceptances', acceptances);

                                            });
                                        });

                                        socket.on('chooseAcceptedPhotographer', async function(data){
                                              await  ClientModel.findOne({username:data.clientUsername}, async function(err, user) {
                                                var foundShoot = user.photoShoots.find(function(element) {
                                                  if(element.key.valueOf()==data.key.valueOf()){
                                                  return element;
                                                  }
                                                });

                                                console.log("data.shoot:"+data.shoot);
                                                console.log("user.photoShoots[0]:"+user.photoShoots[0]);
                                                foundShoot.chosenShootRequestByCoordination=data.shoot;
                                              //  console.log("foundShoot.chosenShootRequestByCoordination:"+foundShoot.chosenShootRequestByCoordination);
                                                user.save();
                                              });
                                          });

                                          socket.on('requestAllPhotographerSchedulingInfo', async function(data){
                                                await  ClientModel.findOne({username:data.clientUsername}, async function(err, user) {
                                                  var foundShoot = user.photoShoots.find(function(element) {
                                                    if(element.key.valueOf()==data.key.valueOf()){
                                                    return element;
                                                    }
                                                  });
                                                  console.log("hello??")
                                                  console.log("foundShoot:"+foundShoot);
                                                  socket.emit('gottenAllPhotographerSchedulingInfo', foundShoot);

                                                });
                                            });

                                            socket.on('coordinationSendsClientRequest', async function(data){
                                              console.log("111:");

                                                  await  ClientModel.findOne({username:data.clientUsername}, async function(err, user) {

                                                    console.log("2:");

                                                    var foundShoot = user.photoShoots.find(function(element) {
                                                      if(element.key.valueOf()==data.key.valueOf()){
                                                      return element;
                                                      }
                                                    });

                                                    locationArr=[];

                                                    if(data.location1!=''){
                                                      var key1= Math.random().toString(36).substring(7);
                                                      var obj1={key:key1,selected:false,location:data.location1}
                                                      locationArr.push(obj1);
                                                    }

                                                    if(data.location2!=''){
                                                      var key2= Math.random().toString(36).substring(7);
                                                      var obj2={key:key2,selected:false,location:data.location2}
                                                      locationArr.push(obj2);
                                                    }

                                                    if(data.location3!=''){
                                                      var key3= Math.random().toString(36).substring(7);
                                                      var obj3={key:key3,selected:false,location:data.location3}
                                                      locationArr.push(obj3);
                                                    }


                                                    foundShoot.chosenShootRequestByCoordination.detailsForClient=data.details;
                                                    foundShoot.chosenShootRequestByCoordination.clientSentRequest=true;
                                                    foundShoot.chosenShootRequestByCoordination.clientSentRequest=true;
                                                    foundShoot.status="Waiting on client response";


                                                    foundShoot.chosenShootRequestByCoordination.locationOptions=locationArr;
                                                    console.log("locationArr:"+locationArr);
                                                    user.save();


                                                  });
                                              });


                                            socket.on('getClientRequestInfo', async function(data){
                                                  await  ClientModel.findOne({username:data.clientUsername}, async function(err, user) {
                                                    var foundShoot = user.photoShoots.find(function(element) {
                                                      if(element.key.valueOf()==data.key.valueOf()){
                                                      return element;
                                                      }
                                                    });
                                                    console.log("foundShoot:"+foundShoot);
                                                    socket.emit('gottenClientRequestInfo', foundShoot);

                                                  });
                                              });

                                              socket.on('coordinationCancelsDate', async function(data){
                                                console.log("1");
                                                await  ClientModel.findOne({username:data.clientUsername}, async function(err, user) {
                                                  var foundShoot = user.photoShoots.find(function(element) {
                                                    if(element.key.valueOf()==data.key.valueOf()){
                                                    return element;
                                                    }
                                                  });

                                                  console.log("2");

                                                  foundShoot.cancelDate=true;
                                                  foundShoot.chosenShootRequestByCoordination.isDateConfirmed=false;
                                                  foundShoot.chosenShootRequestByCoordination.photographerConfirmed=false;

                                                  for (var i=0;i<foundShoot.photographerOptions;i++){
                                                    var photographerUsername=foundShoot.photographerOptions[i].photographer.username;
                                                    await  PhotographerModel.findOne({username:photographerUsername}, async function(err, photog) {
                                                      var keyObjs=photog.photoShootKeys;
                                                      console.log("3");

                                                      var index = keyObjs.indexOf(data.key);
                                                      keyObjs.splice(index, 1);
                                                      photog.photoShootKeys=keyObjs;
                                                      photog.save();
                                                  });
                                                }
                                                console.log("4");


                                                foundShoot.shortListedPhotographers=[];


                                                  user.save();
                                                  console.log("5");

                                                });

                                              });


                                              socket.on('submitClientInfo', async function(data){
                                                console.log(1);
                                                    await  ClientModel.findOne({username:data.clientUsername}, async function(err, user) {
                                                      var foundShoot = user.photoShoots.find(function(element) {
                                                        if(element.key.valueOf()==data.key.valueOf()){
                                                        return element;
                                                        }
                                                      });
                                                      console.log(2);

                                                      foundShoot.cancelDate=false;

                                                      //handle case
                                                      if(data.state.changedLocation){
                                                        foundShoot.chosenShootRequestByCoordination.clientLocationChange=data.state.changedLocation;

                                                        foundShoot.chosenShootRequestByCoordination.confirmedLocation=data.state.locationDataSource[0];
                                                      }
                                                      else{
                                                        foundShoot.chosenShootRequestByCoordination.confirmedLocation=data.state.selectedLocation;
                                                      }

                                                      if(data.state.changedDetails){
                                                        foundShoot.chosenShootRequestByCoordination.clientDetailsChange=data.state.changedDetails;

                                                        foundShoot.chosenShootRequestByCoordination.confirmedDetails=data.state.changedDetailsString;
                                                      }
                                                      else{
                                                        foundShoot.chosenShootRequestByCoordination.confirmedDetails=data.state.details;
                                                      }
                                                      if(data.state.changedDates){
                                                        foundShoot.chosenShootRequestByCoordination.clientDateChange=data.state.changedDates;

                                                        foundShoot.chosenShootRequestByCoordination.changedDateOptions=data.state.dateDataSource;
                                                        foundShoot.status="The shoot is confirmed on the client end. Waiting on photographer confirmation"


                                                        for (var i=0;i<foundShoot.photographerOptions;i++){
                                                          var photographerUsername=foundShoot.photographerOptions[i].photographer.username;
                                                          await  PhotographerModel.findOne({username:photographerUsername}, async function(err, photog) {
                                                            var keyObjs=photog.photoShootKeys;

                                                            var index = keyObjs.indexOf(data.key);
                                                            keyObjs.splice(index, 1);
                                                            photog.photoShootKeys=keyObjs;
                                                            photog.save();
                                                        });
                                                      }

                                                      }
                                                      else{
                                                        foundShoot.chosenShootRequestByCoordination.confirmedDate=data.state.selectedDate;
                                                        foundShoot.chosenShootRequestByCoordination.isDateConfirmed=true;
                                                        foundShoot.chosenShootRequestByCoordination.photographerConfirmed=true;



                                                        await  PhotographerModel.findOne({username:data.state.photographer.username}, async function(err, photog) {

                                                            var stringedConfirmedDate=data.state.selectedDate.date;
                                                            var dateHelper=stringedConfirmedDate.split("@");
                                                            var date=dateHelper[0];
                                                            var time=dateHelper[1];

                                                            console.log("stringedConfirmedDate:"+stringedConfirmedDate);


                                                            var subDateHelper= date.split(" ");
                                                            var year=subDateHelper[2];
                                                            var monthName=subDateHelper[1];
                                                            var day=subDateHelper[0];

                                                            var monthNames = ["January", "February", "March", "April", "May", "June",
                                                              "July", "August", "September", "October", "November", "December"
                                                            ];

                                                            var month=monthNames.indexOf(monthName)+1;

                                                            if(month<10){
                                                              month="0"+month;
                                                            }
                                                            if(day<10){
                                                              day="0"+day;
                                                            }

                                                            var dateNeeded= year+"-"+month+"-"+day;
                                                            var photographerDateMsg= "Shoot for "+user.businessName + " at "+data.state.selectedLocation+ " at "+time;
                                                            var clientDateMsg= "Shoot with "+photog.firstName+" "+photog.lastName+ "at "+data.state.selectedLocation.location+" at "+time;

                                                            foundShoot.chosenShootRequestByCoordination.photographerDateMsg=photographerDateMsg;
                                                            foundShoot.chosenShootRequestByCoordination.clientDateMsg=clientDateMsg;

                                                            if(photog.photographerCalendar==undefined){
                                                              photog.photographerCalendar={ 'def': ['defo']};
                                                            }
                                                            var photogDateArr=photog.photographerCalendar.get(dateNeeded);

                                                            if (photogDateArr===undefined){
                                                              photogDateArr=[photographerDateMsg];

                                                              photog.photographerCalendar.set(dateNeeded,photogDateArr);
                                                            }
                                                            else{
                                                              photogDateArr.push(photographerDateMsg);

                                                              photog.photographerCalendar.set(dateNeeded,photogDateArr);

                                                            }

                                                            var entities=['Core','Client','ContentCreator','Coordination'];

                                                            for(var o=0;o<entities.length;o++){

                                                              var neededCalendar=user.getCalendarAndToDos(entities[o])["neededCalendar"];


                                                              var entityDateArr=neededCalendar.get(dateNeeded);

                                                              if (entityDateArr===undefined){
                                                                entityDateArr=[clientDateMsg];

                                                                neededCalendar.set(dateNeeded,entityDateArr);
                                                              }
                                                              else{
                                                                entityDateArr.push(clientDateMsg);

                                                                neededCalendar.set(dateNeeded,entityDateArr);

                                                              }

                                                            }



                                                            console.log("dateHelper:"+dateHelper)

                                                            console.log("stringedConfirmedDate:"+stringedConfirmedDate)

                                                            console.log("photographerDateMsg:"+photographerDateMsg)
                                                            console.log("clientDateMsg:"+clientDateMsg)


                                                            console.log("clientDateArr:"+clientDateArr)
                                                            console.log("photogDateArr:"+photogDateArr)

                                                            console.log("dateNeeded:"+dateNeeded)



                                                          photog.save();
                                                      });



                                                        foundShoot.chosenShootRequestByCoordination.confirmedPhotographer=data.state.photographer;


                                                        foundShoot.status="The shoot is confirmed!"
                                                          foundShoot.chosenShootRequestByCoordination.confirmedByClient=true;
                                                      }

                                                      foundShoot.chosenShootRequestByCoordination.clientResponded=true;

                                                      foundShoot.changedDates=data.state.changedDates;
                                                      foundShoot.changedLocation=data.state.changedLocation;
                                                      foundShoot.changedDetails=data.state.changedDetails;

                                                      console.log(3);

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
                        console.log('error', err);
                        id = attachment._id;
                        console.log('wrote....')
                        console.log('error', err);
                        console.log('attachment', attachment);
                        resolve({ id, type, ext});
                      });
                    });
                  });

                  socket.on('chunk', (data) => {
                    const chunk = data.chunk;
                    //console.log('got chunk', data.index, chunk);
                    stream.push(Buffer.from(chunk, 'base64'));
                  });

                  socket.on('upload-end', (data, callback) => {
                    console.log('upload-ended');
                    stream.push(null);
               //     callback({ status: 'complete' });
                //  });

                //  socket.on('createPost', function(data) {
                    console.log('creating post....', data);
                    ClientModel.findOne({ username: data.clientUsername }, async function(err, user) {
                      console.log('error', err);
		      console.log('creating post...')
                      console.log('id', id);
                //        user.popAndAdd(user.motherQueue,data.entity,data.msg);

                      const media = await writePromise;

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
                        height: data.height,
                        width: data.width,
                      };

                      console.log('media', media);
                      if (media.type === 'video' || media.type == 'video') {
                        console.log('creating thumbnail...');
                        // create a thumbnail and save
                        //
                        // save the video to fs
                        const readStream = MediaModel.readById(media.id);
                        const writeStream = await new Promise((resolve, reject) => {
                          const stream = fs.createWriteStream(`${uuid.v4()}.${media.ext}`);
                          readStream.pipe(stream);
                          readStream.on('end', () => resolve(stream));
                        });

                        // save the thumbnail to fs
                        let fname = null;
                        const thumbnailStream = await new Promise((resolve, reject) => {
                          ffmpeg(writeStream.path)
                            .on('filenames', (fns) => {
                              console.log(fns);
                              fname = fns[0];
                              console.log('fname after assign', fname);
                            })
                            .on('end', () => {
                              console.log('fname end', fname);
                              resolve(fs.createReadStream(fname))
                            })
                            .screenshots({
                              timestamps: [0],
                              filename: '%f-thumbnail-at-%s-seconds.png',
                            });
                        });

                        // copy the thumbnail from fs to mongodb
                        MediaModel.write({
                          contentType: 'image/png',
                          filename: `${uuid.v4()}.png`
                        },
                          thumbnailStream,
                          (err, file) => {
                            console.log('thumbnail created', file);
                            fs.unlink(thumbnailStream.path, console.log);

                            const thumbnail = new ThumbnailModel({
                              videoId: media.id,
                              thumbnailId: file._id,
                            });
                            thumbnail.save((err, thumbnail) => {
                              if (err)
                                console.log('error occured while saving the thumbnail', err);
                            });
                          }
                        );

                        // delete the video
                        fs.unlink(writeStream.path, console.log);
                      }

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
                    console.log('getCalendar', data);
                    ClientModel.findOne({ username: data.clientUsername }, function(err, user) {
                      console.log(user);
                      console.log(user.contentCalendar);
                      const posts = user.contentCalendar["posts"];
                      socket.emit('gottenCalendar', posts);

                      posts.forEach((post, index) => {
                        const id = post.file;

                        const res = {
                          id: post.file,
                          index: index,
                        };

                        MediaModel.findById(id, async (err, file) => {
                          console.log('error', err);
                          res.contentType = file.contentType;
                          let readStream = MediaModel.readById(id);

                          let data = '';

                          // send a thumbnail
                          if (res.contentType.startsWith('video')) {
                            res.videoId = id;

                            let fname = null;
                            readStream = await new Promise((resolve, reject) => {
                              console.log(id);
                              ThumbnailModel.findOne({ videoId: id }, (err, thumbnail) => {
                                const id = thumbnail.thumbnailId;
                                resolve(MediaModel.readById(id));
                              });
                            });
                          }
                          // send the image
                          readStream.on('data', (chunk) => {
                            console.log(chunk);
                            console.log(typeof chunk);
                            data += chunk.toString('base64');
                          });

                          readStream.on('end', () => {
                            res.base64 = data;
                            console.log('id', id)
                            console.log('res', res);
                            socket.emit('calendarItem', res);
                          });
                        });
                      });
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


                              var profile = io.of('/profile');

                              profile.on('connection', function(socket){
                                  socket.on('submitPhotographerProfile', function(data){
                                        PhotographerModel.findOne({username:data.photographerUsername}, function(err, user) {
                                          user.profile=data.state;
                                          console.log(user.profile)

                                    //    will need this for photographers=  user.popAndAdd(user.signUpQueue,"Client","KYC");

                                          user.save();

                                          socket.emit('submittedPhotographerProfile', "primaryLocation="+user.profile["primaryLocation"]); // emit an event to the socket

                                        })
                                      });

                                      socket.on('getPhotographerProfile', function(data){
                                        console.log("data.photographerUsername:"+data.photographerUsername);

                                            PhotographerModel.findOne({username:data.photographerUsername}, function(err, user) {

                                              console.log("user.profile:"+user.profile)
                                              socket.emit('gottenPhotographerProfile', user.profile); // emit an event to the socket

                                            })
                                          });
                                    });


                                    var ad = io.of('/ad');
                                    ad.on('connection', function(socket){

                                      socket.on('requestAllAdSets', function(data){

                                        ClientModel.findOne({ username: data.clientUsername }, function(err, user) {
                                          socket.emit('gottenAllAdSets', user.adSets); // emit an event to the socket

                                            });
                                          });


                                          socket.on('createAd', function(data){

                                            ClientModel.findOne({ username: data.clientUsername }, async function(err, user) {
                                              var newDate= new Date();
                                              var IndiaDateToday=newDate.toLocaleDateString('en-US', {timeZone: "Asia/Kolkata"}); //1/27/2019

                                              var name="initiated:"+IndiaDateToday;

                                                var newAdSet= {name:name,key:data.key, client:user.businessName, clientUsername:user.username};
                                                var existingAdSets=user.adSets;
                                                if(existingAdSets==undefined || existingAdSets==null){
                                                  existingAdSets=[];
                                                }

                                                existingAdSets.unshift(newAdSet);

                                                user.adSets=existingAdSets;

                                              await user.save();
                                                socket.emit('adSetCreated',''); // emit an event to the socket


                                                  });
                                                });


                                                socket.on('deleteAd', function(data){

                                                  ClientModel.findOne({ username: data.clientUsername }, async function(err, user) {

                                                    var adSets= user.adSets;

                                                    var found = adSets.find(function(element) {
                                                    if(element.key.valueOf()==data.key.valueOf()){
                                                    return element;
                                                    }
                                                    });

                                                    var index = adSets.indexOf(found);


                                                    adSets.splice(index, 1);
                                                    user.adSets=adSets;
                                                  await  user.save();
                                                    socket.emit('adDeleted',''); // emit an event to the socket

                                                        });
                                                      });


                                                      socket.on('requestAdSet', function(data){

                                                        ClientModel.findOne({ username: data.clientUsername }, async function(err, user) {

                                                          var adSets= user.adSets;

                                                          console.log("adSets:"+adSets);


                                                          var found = adSets.find(function(element) {
                                                            console.log("data.key:"+data.key);
                                                            console.log("element.key:"+element.key);
                                                          if(element.key.valueOf()==data.key.valueOf()){

                                                          return element;
                                                          }
                                                          });


                                                          socket.emit('gottenAdSet',{adSet:found}); // emit an event to the socket

                                                              });
                                                            });

                                                            socket.on('sendToAd', function(data){

                                                              ClientModel.findOne({ username: data.clientUsername }, async function(err, user) {

                                                                var adSets= user.adSets;

                                                                var adSet = adSets.find(function(element) {
                                                                if(element.key.valueOf()==data.key.valueOf()){
                                                                return element;
                                                                }
                                                                });

                                                                adSet.contentCreatorDone=true;

                                                                user.save();

                                                                    });
                                                                  });


                                                                  socket.on('sendToCore', function(data){

                                                                    ClientModel.findOne({ username: data.clientUsername }, async function(err, user) {

                                                                      var adSets= user.adSets;

                                                                      var adSet = adSets.find(function(element) {
                                                                      if(element.key.valueOf()==data.key.valueOf()){
                                                                      return element;
                                                                      }
                                                                      });

                                                                      adSet.adDone=true;
                                                                      adSet.budget=data.budget;


                                                                      user.save();

                                                                          });
                                                                        });


                                                                        socket.on('coreApproveAdSet', function(data){

                                                                          ClientModel.findOne({ username: data.clientUsername }, async function(err, user) {

                                                                            var adSets= user.adSets;

                                                                            var adSet = adSets.find(function(element) {
                                                                            if(element.key.valueOf()==data.key.valueOf()){
                                                                            return element;
                                                                            }
                                                                            });

                                                                            adSet.coreApproval=true;

                                                                            user.save();

                                                                                });
                                                                              });


                                                                              socket.on('clientApproveAdSet', function(data){

                                                                                ClientModel.findOne({ username: data.clientUsername }, async function(err, user) {

                                                                                  var adSets= user.adSets;

                                                                                  var adSet = adSets.find(function(element) {
                                                                                  if(element.key.valueOf()==data.key.valueOf()){
                                                                                  return element;
                                                                                  }
                                                                                  });

                                                                                  adSet.clientApproval=true;

                                                                                  user.save();

                                                                                      });
                                                                                    });


                                                                                    socket.on('sendDataToCore', function(data){

                                                                                      ClientModel.findOne({ username: data.clientUsername }, async function(err, user) {

                                                                                        var adSets= user.adSets;

                                                                                        var adSet = adSets.find(function(element) {
                                                                                        if(element.key.valueOf()==data.key.valueOf()){
                                                                                        return element;
                                                                                        }
                                                                                        });

                                                                                        adSet.adDataDone=true;

                                                                                        user.save();

                                                                                            });
                                                                                          });


                                                                                          socket.on('coreConclusion', function(data){

                                                                                            ClientModel.findOne({ username: data.clientUsername }, async function(err, user) {

                                                                                              var adSets= user.adSets;

                                                                                              var adSet = adSets.find(function(element) {
                                                                                              if(element.key.valueOf()==data.key.valueOf()){
                                                                                              return element;
                                                                                              }
                                                                                              });

                                                                                              adSet.coreConclusion=data.coreConclusion;
                                                                                              adSet.coreConclusionDone=true;

                                                                                              user.save();

                                                                                                  });
                                                                                                });


                                                                                                socket.on('clientConclusion', function(data){

                                                                                                  ClientModel.findOne({ username: data.clientUsername }, async function(err, user) {

                                                                                                    var adSets= user.adSets;

                                                                                                    var adSet = adSets.find(function(element) {
                                                                                                    if(element.key.valueOf()==data.key.valueOf()){
                                                                                                    return element;
                                                                                                    }
                                                                                                    });

                                                                                                    adSet.clientConclusion=data.clientConclusion;

                                                                                                    adSet.clientConclusionDone=true;

                                                                                                    user.save();

                                                                                                        });
                                                                                                      });


                                                    });



                                                    var influencer = io.of('/influencer');
                                                    influencer.on('connection', function(socket){

                                                      socket.on('requestAllInfluencerCampaigns', function(data){

                                                        ClientModel.findOne({ username: data.clientUsername }, function(err, user) {
                                                          socket.emit('gottenAllInfluencerCampaigns', user.influencerCampaigns); // emit an event to the socket

                                                            });
                                                          });


                                                          socket.on('createInfluencerCampaign', function(data){

                                                            ClientModel.findOne({ username: data.clientUsername }, async function(err, user) {
                                                              var newDate= new Date();
                                                              var IndiaDateToday=newDate.toLocaleDateString('en-US', {timeZone: "Asia/Kolkata"}); //1/27/2019

                                                              var name="initiated:"+IndiaDateToday;

                                                                var newAdSet= {name:name,key:data.key, client:user.businessName, clientUsername:user.username};
                                                                var existingInfluencerCampaigns=user.influencerCampaigns;
                                                                if(existingInfluencerCampaigns==undefined || existingInfluencerCampaigns==null){
                                                                  existingInfluencerCampaigns=[];
                                                                }

                                                                existingInfluencerCampaigns.unshift(newAdSet);

                                                                user.influencerCampaigns=existingInfluencerCampaigns;

                                                              await user.save();
                                                                socket.emit('influencerCampaignCreated',''); // emit an event to the socket


                                                                  });
                                                                });


                                                                socket.on('deleteInfluencerCampaign', function(data){

                                                                  ClientModel.findOne({ username: data.clientUsername }, async function(err, user) {

                                                                    var influencerCampaigns= user.influencerCampaigns;

                                                                    var found = influencerCampaigns.find(function(element) {
                                                                    if(element.key.valueOf()==data.key.valueOf()){
                                                                    return element;
                                                                    }
                                                                    });

                                                                    var index = influencerCampaigns.indexOf(found);


                                                                    influencerCampaigns.splice(index, 1);
                                                                    user.influencerCampaigns=influencerCampaigns;
                                                                  await  user.save();
                                                                    socket.emit('influencerCampaignDeleted',''); // emit an event to the socket

                                                                        });
                                                                      });


                                                                      socket.on('getInfluencerCampaign', function(data){

                                                                        ClientModel.findOne({ username: data.clientUsername }, async function(err, user) {

                                                                          var influencerCampaigns= user.influencerCampaigns;

                                                                          var campaign = influencerCampaigns.find(function(element) {
                                                                          if(element.key.valueOf()==data.key.valueOf()){
                                                                          return element;
                                                                          }
                                                                          });

                                                                          socket.emit('gottenInfluencerCampaign',campaign); // emit an event to the socket

                                                                              });
                                                                            });


                                                                            socket.on('editInfluencerCampaign', function(data){
                                                                              console.log("started editing");
                                                                              console.log(data.index);



                                                                              ClientModel.findOne({ username: data.clientUsername }, async function(err, user) {

                                                                                var influencerCampaigns= user.influencerCampaigns;

                                                                                var campaign = influencerCampaigns.find(function(element) {
                                                                                if(element.key.valueOf()==data.key.valueOf()){
                                                                                return element;
                                                                                }
                                                                                });


                                                                                var index = influencerCampaigns.indexOf(campaign);

                                                                                user.influencerCampaigns[index]=data.influencerCampaign;
                                                                                //console.log(Object.keys(user.influencerCampaigns[index]));


                                                                                if(data.justPicked==true){
                                                                                  var stringedConfirmedDate=data.event.dateSelected.date;
                                                                                  var dateHelper=stringedConfirmedDate.split("@");
                                                                                  var date=dateHelper[0];
                                                                                  var time=dateHelper[1];


                                                                                  var subDateHelper= date.split(" ");
                                                                                  var year=subDateHelper[2];
                                                                                  var monthName=subDateHelper[1];
                                                                                  var day=subDateHelper[0];

                                                                                  var monthNames = ["January", "February", "March", "April", "May", "June",
                                                                                    "July", "August", "September", "October", "November", "December"
                                                                                  ];

                                                                                  var month=monthNames.indexOf(monthName)+1;

                                                                                  if(month<10){
                                                                                    month="0"+month;
                                                                                  }
                                                                                  if(day<10){
                                                                                    day="0"+day;
                                                                                  }

                                                                                  var dateNeeded= year+"-"+month+"-"+day;

                                                                                  var msg= "Influencer Event: "+data.event.influencer.fullName+ "at "+data.event.location+" at "+time;

                                                                                  //foundShoot.chosenShootRequestByCoordination.clientDateMsg=clientDateMsg;
                                                                                  var event = campaign.influencerEvent.find(function(element) {
                                                                                  if(element.key.valueOf()==data.event.key.valueOf()){
                                                                                  return element;
                                                                                  }
                                                                                  });

                                                                                  event.dateMsg=msg;

                                                                                  var entities=['Core','Client','ContentCreator','Coordination'];

                                                                                  console.log(4)

                                                                                  for(var o=0;o<entities.length;o++){

                                                                                    var neededCalendar=user.getCalendarAndToDos(entities[o])["neededCalendar"];

                                                                                    var entityDateArr=neededCalendar.get(dateNeeded);

                                                                                    if (entityDateArr===undefined){
                                                                                      entityDateArr=[msg];

                                                                                      neededCalendar.set(dateNeeded,entityDateArr);
                                                                                    }
                                                                                    else{
                                                                                      entityDateArr.push(msg);

                                                                                      neededCalendar.set(dateNeeded,entityDateArr);
                                                                                    }

                                                                                  }
                                                                                }

                                                                                if(data.justDeleted==true){

                                                                                  var event = campaign.influencerEvent.find(function(element) {
                                                                                  if(element.key.valueOf()==data.event.key.valueOf()){
                                                                                  return element;
                                                                                  }
                                                                                  });

                                                                                  var stringedConfirmedDate=event.dateSelected.date;
                                                                                  var dateHelper=stringedConfirmedDate.split("@");
                                                                                  var date=dateHelper[0];
                                                                                  var time=dateHelper[1];


                                                                                  var subDateHelper= date.split(" ");
                                                                                  var year=subDateHelper[2];
                                                                                  var monthName=subDateHelper[1];
                                                                                  var day=subDateHelper[0];

                                                                                  var monthNames = ["January", "February", "March", "April", "May", "June",
                                                                                    "July", "August", "September", "October", "November", "December"
                                                                                  ];

                                                                                  var month=monthNames.indexOf(monthName)+1;

                                                                                  if(month<10){
                                                                                    month="0"+month;
                                                                                  }
                                                                                  if(day<10){
                                                                                    day="0"+day;
                                                                                  }

                                                                                  var dateNeeded= year+"-"+month+"-"+day;

                                                                                  var entities=['Core','Client','ContentCreator','Coordination'];

                                                                                  for(var o=0;o<entities.length;o++){


                                                                                    var neededCalendar=user.getCalendarAndToDos(entities[o])["neededCalendar"];

                                                                                    var entityDateArr=neededCalendar.get(dateNeeded);


                                                                                    var index = entityDateArr.indexOf(event.dateMsg);

                                                                                    entityDateArr.splice(index, 1);

                                                                                      neededCalendar.set(dateNeeded,entityDateArr);

                                                                                  }
                                                                                }


                                                                                console.log(5)


                                                                                user.save();



                                                                                console.log("saved")

                                                                                    });
                                                                                  });


                                                                                  socket.on('getAllInfluencers', function(data){



                                                                                    InfluencerModel.find({}, function(err, users) {
                                                                                      console.log("users:"+users);
                                                                                      socket.emit('gottenAllInfluencers',users); // emit an event to the socket
                                                                                        });
                                                                                      });



                                                                                      socket.on('createInfluencer', function(data){

                                                                                        console.log("ho")

                                                                                        var newInfluencer = new InfluencerModel();
                                                                                        newInfluencer.fullName=data.fullName;
                                                                                        console.log("newInfluencer:"+newInfluencer)
                                                                                        console.log("newInfluencer[fullName]:"+newInfluencer["fullName"]);


                                                                                        newInfluencer.save();

                                                                                            });




                                                                              socket.on('getInfluencer', function(data){
                                                                                console.log("data:"+data);

                                                                                InfluencerModel.findOne({_id:data}, function(err, user) {
                                                                                  console.log("user"+user);
                                                                                  socket.emit('gottenInfluencer',user); // emit an event to the socket
                                                                                    });
                                                                                  });
                                                                                });



const instanceLocator = 'v1:us1:4bd64738-e3fb-4c98-bda3-9dba974c665e';

//const chatkit = new Chatkit.default({
  //instanceLocator,
  //key: '4e75c82c-8881-4966-85fa-1c685dbe11ec:4woSofa6W9CxdqhVYOM73qBgwjg4goqIZDth5+4XJW0=',
//});

//app.post('/chat/auth', (req, res) => {
  //const authData = chatkit.authenticate({
    //userId: req.query.username,
  //});

  //res.status(authData.status)
     //.send(authData.body);
//});

//const chat = io.of('/chat');

//chat.on('connection', (socket) => {
  //socket.on('get-instance-locator', (data) => {
    //socket.emit('info', {
      //instanceLocator,
    //});
  //});
//});


io.on('connection',function(socket){
  //console.log('there is a new connection');

});

http.listen('3000', function(){
  //console.log('listening on *:3000');
});
