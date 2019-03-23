var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    bcrypt = require('bcrypt'),
    SALT_WORK_FACTOR = 10;
var ContentCreator= require('./ContentCreator.js');
var ContentCreatorSchema= ContentCreator.ContentCreatorSchema;

var Core= require('./Core.js');
var CoreSchema= Core.CoreSchema;

var gridfs = require('mongoose-gridfs');

var Photographer= require('./Photographer.js');

var PhotographerSchema= Photographer.PhotographerSchema;


//mongoose.connect("mongodb://armand_at:#LORDarmand2019@atsocial-shard-00-00-exfpm.gcp.mongodb.net:27017,atsocial-shard-00-01-exfpm.gcp.mongodb.net:27017,atsocial-shard-00-02-exfpm.gcp.mongodb.net:27017/test?ssl=true&replicaSet=AtSocial-shard-0&authSource=admin&retryWrites=true/", { useNewUrlParser: true });


 var Schema = mongoose.Schema;

 var StrategySchema = new Schema({
    ObjectID:String,
    clientApprovalNeeded:Boolean,
    coreApprovalNeeded:Boolean,
    clientApprovalGiven:Boolean,
    coreApprovalGiven:Boolean,
    done:Boolean,
    clientApprovalDeadline: Date,
    coreApprovalDeadline: Date,
    contentDeadline: Date,
    description:String,
    image:{ data: String, contentType: String },
    texts: {
      text1:String,
      text2:String,
      text3:String,
    },
    images:{
       image1:{ data: Buffer, contentType: String },
       image2:{ data: Buffer, contentType: String },
       image3:{ data: Buffer, contentType: String }
     },
 });

var PostSchema = new Schema({
  ObjectID: String,
  tags: String,
  caption: String,
  hashtags: String,
  location: String,
  facebook: String,
  instagram: String,
  date: String,
  time: String,
  file: {
    type: Schema.Types.ObjectId,
    ref: "media.files",
  },
  height: {
    type: Number,
    default: 414,
  },
  width: {
    type: Number,
    default: 414,
  },
});

var ThumbnailSchema = new Schema({
  videoId: {
    type: Schema.Types.ObjectId,
    ref: "media.files",
  },
  thumbnailId: {
    type: Schema.Types.ObjectId,
    ref: "media.files",
  }
});

 var ContentCalendarSchema = new Schema({
   ObjectID: String,
   clientApprovalNeeded: Boolean,
   coreApprovalNeeded: Boolean,
   clientApprovalGiven: Boolean,
   coreApprovalGiven: Boolean,
   done: Boolean,
   clientApprovalDeadline: Date,
   coreApprovalDeadline: Date,
   contentDeadline: Date,
   posts: [PostSchema],
 });

SubCommentSchema=new Schema({
  ObjectID:String,
  key:String,
  comment:String,
  firstName:String,
  name:String,
});


 var CommentSchema = new Schema({
   ObjectID:String,
   key:String,
   comment:String,
   firstName:String,
   resolved:{
     type: Boolean,
     default:false,
   },
   name:String,
   subComments:[SubCommentSchema],
 });

 var ShootPlanSchema = new Schema({
   ObjectID:String,
   description:String,
   comments:[CommentSchema],
   clientApprovalNeeded:Boolean,
   coreApprovalNeeded:Boolean,
   clientApprovalGiven:Boolean,
   coreApprovalGiven:Boolean,
   done:Boolean,
   clientApprovalDeadline: Date,
   coreApprovalDeadline: Date,
   contentDeadline: Date,
 });

 var ShootDateSchema = new Schema({
   key:String,
   date:String,
   selected:{
     type: Boolean,
     default:false,
   },
  })

  var LocationSchema = new Schema({
    key:String,
    location:String,
    selected:{
      type: Boolean,
      default:false,
    },
   })


 var ShootRequestSchema = new Schema({
   ObjectID:String,
   dateOptions:[ShootDateSchema],
   photographer:PhotographerSchema,
   acceptanceKey:String,
   changedDateOptions:[ShootDateSchema],
   clientResponded:{
     type: Boolean,
     default:false,
   },
   photographerConfirmed:{
     type: Boolean,
     default:false,
   },
   photographerReasonForCancellation:String,
   detailsForClient:String,

   locationOptions:[LocationSchema],

   confirmedPhotographer:PhotographerSchema,

   confirmedDate:ShootDateSchema,

   confirmedLocation:LocationSchema,
   confirmedDetails:String,

   isDateConfirmed:{
     type: Boolean,
     default:false,
   },
   photographerDateMsg:String,
   clientDateMsg:String,

   clientDateChange:{
     type: Boolean,
     default:false,
   },
   clientLocationChange:{
     type: Boolean,
     default:false,
   },
   clientDetailsChange:{
     type: Boolean,
     default:false,
   },
   photographerChange:{
     type: Boolean,
     default:false,
   },
   clientSentRequest:{
     type: Boolean,
     default:false,
   },
   selected:{
     type: Boolean,
     default:false,
   },
 });



 var PhotoShootSchema = new Schema({
   ObjectID:String,
   name:String,
   detailsForPhotographers:String,
   shootPlan:ShootPlanSchema,
   mediaLink:String,
   shootPlanApproved:{
        type: Boolean,
        default:false,
      },
      cancelDate:{
           type: Boolean,
           default:false,
         },
  confirmUpload:{
       type: Boolean,
       default:false,
     },
  shootPlanCreated:{
     type: Boolean,
   default:false,
         },
   shortListedPhotographers:[PhotographerSchema],
   shortListedPhotographersWithClientDatesKnown:[PhotographerSchema],

   chosenShootRequestByCoordination:ShootRequestSchema,
   minDate:String,
   duration:String,
   maxDate:String,
   photographerOptions:[ShootRequestSchema],
   clientRescheduleOptions:ShootRequestSchema,
   props:[String],
   selected:{
     type: Boolean,
     default:false,
   },
   key:String,
   client:String,
   clientUsername:String,

   clientApprovalNeeded:Boolean,
   coreApprovalNeeded:Boolean,
   clientApprovalGiven:Boolean,
   coreApprovalGiven:Boolean,
   done:Boolean,
   clientApprovalDeadline: Date,
   coreApprovalDeadline: Date,
   contentDeadline: Date,
   schedulingDeadline:Date,
   status:String,
   confirmedByClient:{
        type: Boolean,
        default:false,
      },
      clientResponded:{
           type: Boolean,
           default:false,
         },
 });

 var AdCampaignSchema=new Schema({
   ObjectID:String,
   //Creative:String,
   caption1:String,
   caption2:String,
   caption3:String,
   caption4:String,
   caption5:String,
   targetting:String,
   additionalDetails:String,
   performanceDetails:String,
 });


 var AdSetSchema=new Schema({
   ObjectID:String,
   client:String,
   name:String,
   clientUsername:String,
   key:String,
   campaign1:AdCampaignSchema,
   campaign2:AdCampaignSchema,
   campaign3:AdCampaignSchema,
   campaign4:AdCampaignSchema,
   campaign5:AdCampaignSchema,
   budget:String,
   coreConclusion:String,
   clientConclusion:String,

   contentCreatorDone:{
     type: Boolean,
     default:false,
   },
   selected:{
     type: Boolean,
     default:false,
   },
   adDone:{
     type: Boolean,
     default:false,
   },
   coreApproval:{
     type: Boolean,
     default:false,
   },
   clientApproval:{
     type: Boolean,
     default:false,
   },
   adDataDone:{
     type: Boolean,
     default:false,
   },
   coreConclusionDone:{
     type: Boolean,
     default:false,
   },
   clientConclusionDone:{
     type: Boolean,
     default:false,
   },
 });


 var InfluencerDateSchema = new Schema({
   key:String,
   date:String,
   selected:{
     type: Boolean,
     default:false,
   },
  })

  var InfluencerSchema= new Schema({
    key:String,
    fullName:String,
    profileImage:String,
    primaryCity:String,
    shippingAddress:String,
    catagories:[String],
    igHandleLink:String,
    fbHandleLink:String,
    twiiterHandleLink:String,
    youtubeHandleLink:String,
    email:String,
    phoneNumber:String,
    mediaKitLink:String,
    engagementRate:String,
    dietaryRestrictions:String,

  })


 var InfluencerEventSchema = new Schema({
   ObjectID:String,
   key:String,
   dateOptions:[InfluencerDateSchema],
   dateSelected:InfluencerDateSchema,
   influencer:InfluencerSchema,
   influencerCost:String,
   location:String,
   additionalDetails:String,
   product: String,
   coordinationSentToClient:{
     type: Boolean,
     default:false,
   },
   clientApproved:{
     type: Boolean,
     default:false,
   },
   clientCancelled:{
     type: Boolean,
     default:false,
   },
   coordinationCancelled:{
     type: Boolean,
     default:false,
   },
   clientReasonForCancellation:String,
   coordinationReasonForCancellation:String,
   linkToPost:String,
   screenShots:[String],
   postUploaded:{
     type: Boolean,
     default:false,
   },
   dateMsg:String,

 });

 var InfluencerPlanSchema = new Schema({
   ObjectID:String,
   contentCreatorSendsToCoordination:{
     type: Boolean,
     default:false,
   },
   budget:String,
   logistics:String,
   coordiantionSendsToCore:{
     type: Boolean,
     default:false,
   },
   coreApproval:{
     type: Boolean,
     default:false,
   },
   clientApproved:{
     type: Boolean,
     default:false,
   },
 });

 var InfluencerCampaignSchema = new Schema({
   ObjectID:String,
   name:String,
   key:String,
   status:String,
   influencerEvent:[InfluencerEventSchema],
   influencerPlan:InfluencerPlanSchema,
 });

 var SurveillanceSchema = new Schema({
   ObjectID:String,
   clientInput:String,
   done:Boolean,
 });

 var AnalyticSchema = new Schema({
   ObjectID:String,
   clientInput:String,
   done:Boolean,
 });




var StrategyModel = mongoose.model('Strategy', StrategySchema);
var PostModel = mongoose.model('Post', PostSchema);
var ThumbnailModel = mongoose.model('Thumbnail', ThumbnailSchema);
var ContentCalendarModel = mongoose.model('ContentCalendar', ContentCalendarSchema);
var ShootPlanModel = mongoose.model('ShootPlan', ShootPlanSchema);
var PhotoShootModel = mongoose.model('PhotoShoot', PhotoShootSchema);
var InfluencerPlanModel = mongoose.model('InfluencerPlan', InfluencerPlanSchema);
var InfluencerEventModel = mongoose.model('InfluencerEvent', InfluencerEventSchema);
var SurveillanceModel = mongoose.model('Surveillance', SurveillanceSchema);
var AnalyticModel = mongoose.model('Analytic', AnalyticSchema);

var InfluencerModel=mongoose.model('Influencer', InfluencerSchema);
//




const getMediaModel = (mongoose) => {
  const media = require('mongoose-gridfs')({
    collection: 'media',
    model: 'Media',
    mongooseConnection: mongoose,
  });

  return mongoose.model('Media', media.schema);
};

module.exports = {
  StrategySchema: StrategySchema,
  PostSchema: PostSchema,
  ThumbnailSchema: ThumbnailSchema,
  ContentCalendarSchema: ContentCalendarSchema,
  ShootPlanSchema: ShootPlanSchema,
  PhotoShootSchema: PhotoShootSchema,
  InfluencerPlanSchema: InfluencerPlanSchema,
  InfluencerEventSchema: InfluencerEventSchema,
  SurveillanceSchema: SurveillanceSchema,
  AnalyticSchema: AnalyticSchema,
  AdSetSchema:AdSetSchema,
  InfluencerCampaignSchema:InfluencerCampaignSchema,
  StrategyModel: StrategyModel,
  PostModel: PostModel,
  ThumbnailModel: ThumbnailModel,
  ContentCalendarModel: ContentCalendarModel,
  ShootPlanModel: ShootPlanModel,
  PhotoShootModel: PhotoShootModel,
  InfluencerPlanModel: InfluencerPlanModel,
  InfluencerEventModel: InfluencerEventModel,
  SurveillanceModel: SurveillanceModel,
  AnalyticModel: AnalyticModel,
  InfluencerModel:InfluencerModel,


  getMediaModel: getMediaModel,
};
