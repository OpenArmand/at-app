var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var atObjects= require('./atObjects.js');

var PhotoShootSchema = atObjects.PhotoShootSchema;


mongoose.connect('mongodb://localhost/test');
//mongoose.connect("mongodb://armand_at:#LORDarmand2019@atsocial-shard-00-00-exfpm.gcp.mongodb.net:27017,atsocial-shard-00-01-exfpm.gcp.mongodb.net:27017,atsocial-shard-00-02-exfpm.gcp.mongodb.net:27017/test?ssl=true&replicaSet=AtSocial-shard-0&authSource=admin&retryWrites=true/", { useNewUrlParser: true });


var ShootStorageSchema = new Schema({
  key:String,
  clientUsername:String,
});


 var ClientStorageSchema = new Schema({
   key:String,
   businessName:String,
   username:String,

 });

 var PhotographerProfileSchema=new Schema({
   primaryLocation:String,
   //needs to be filled for entire profile
 });

 var PhotographerSchema = new Schema({
   selected:{
     type: Boolean,
     default:false,
   },
   __v:Number,
   photographerCalendar: {
    type: Map,
    of: [String],
  },
   profile:PhotographerProfileSchema,
   invited:{
     type: Boolean,
     default:false,
   },
   invitedWithDatesKnown:{
     type: Boolean,
     default:false,
   },
   photoShootKeys:[ShootStorageSchema],

   key:String,
   username:String,
   firstName: String,
   lastName:String,
   businessName:{
     type:String,
     required: true},

  // clients: [ClientSchema],
  // contentCreator:[ContentCreatorSchema],
  // core:CoreSchema,
 });


 var PhotographerModel = mongoose.model('Photographer', PhotographerSchema);

 module.exports = {
     PhotographerModel: PhotographerModel, // or whatever you want to assign it to
     PhotographerSchema: PhotographerSchema // again, set it to what you like
 };
