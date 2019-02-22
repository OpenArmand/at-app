var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    bcrypt = require('bcrypt'),
    SALT_WORK_FACTOR = 10;
var ContentCreator= require('./ContentCreator.js');
const fs = require('fs');
//const gridfs = require('mongoose-gridfs');
//const multer = require('multer')
//const bodyParser = require('body-parser')

var ContentCreatorSchema= ContentCreator.ContentCreatorSchema;

var Core= require('./Core.js');
var CoreSchema= Core.CoreSchema;

var atObjects= require('./atObjects.js');

var StrategySchema = atObjects.StrategySchema;
var PostSchema = atObjects.PostSchema;
var ContentCalendarSchema = atObjects.ContentCalendarSchema;
var ShootPlanSchema = atObjects.ShootPlanSchema;
var PhotoShootSchema = atObjects.PhotoShootSchema;
var InfluencerPlanSchema= atObjects.InfluencerPlanSchema;
var InfluencerEventSchema= atObjects.InfluencerEventSchema;
var SurveillanceSchema= atObjects.SurveillanceSchema;
var AnalyticSchema= atObjects.AnalyticSchema;


/*
_connect=async()=>{

   await mongoose.connect('mongodb://localhost/test');
  //mongoose.connect("mongodb://armand_at:#LORDarmand2019@atsocial-shard-00-00-exfpm.gcp.mongodb.net:27017,atsocial-shard-00-01-exfpm.gcp.mongodb.net:27017,atsocial-shard-00-02-exfpm.gcp.mongodb.net:27017/test?ssl=true&replicaSet=AtSocial-shard-0&authSource=admin&retryWrites=true/", { useNewUrlParser: true });

  // instantiate mongoose-gridfs
  const { model: Attachment } = gridfs({
    collection: 'attachments',
    model: 'Attachment',
    mongooseConnection: mongoose.connection
  });

    }
_connect();
*/
mongoose.connect('mongodb://localhost/test',{ useNewUrlParser: true });


 var Schema = mongoose.Schema;


 var activitySchema= new Schema({
   key:String,
   msg:String,
 });

var itemSchema= new Schema({
  entity:String,
  calendarMessage:String,
  screen:String,
  startDate:String,
  endDate:String,
  OGstartDate:String,
  OGendDate:String,
  activityMessage:activitySchema,
  service:String,

});


 var ClientSchema = new Schema({
   username:String,
   firstName: String,
   lastName:String,
   businessName:{
     type:String,
     required: true},
   strategy: StrategySchema,
   contentCalendar:ContentCalendarSchema,

   currentPhotography: PhotoShootSchema,
   upcomingPhotography: PhotoShootSchema,
   currentPhotography: PhotoShootSchema,
   upcomingPhotography: PhotoShootSchema,
   currentContentCalendar:ContentCalendarSchema,
   upcomingContentCalendar:ContentCalendarSchema,
   contentCreatorUsername: String,
   core:CoreSchema,
   selectedPackage:String,
   services:[String],
    motherQueue:[itemSchema],
    signUpQueue:[itemSchema],
    adQueue:[itemSchema],
    influencerQueue:[itemSchema],
    engagementCampaignQueue:[itemSchema],
    callQueue:[itemSchema],

    motherCalendar: {
     type: Map,
     of: [String],
     default:{ 'def': ['defo']},
   },
   godCalendar: {
    type: Map,
    of: [String],
    default:{ 'def': ['defo']},
  },
   clientCalendar: {
    type: Map,
    of: [String],
    default:{ 'def': ['defo']},
  },
  contentCreatorCalendar:{
    type: Map,
    of: [String],
    default:{ 'def': ['defo']},
  },
  coreCalendar:{
    type: Map,
    of: [String],
    default:{ 'def': ['defo']},
  },
  coordinationCalendar:{
    type: Map,
    of: [String],
    default:{ 'def': ['defo']},
  },
  adCalendar:{
    type: Map,
    of: [String],
    default:{ 'def': ['defo']},
  },
  kyc:{
    age:String,
  },
  clientToDos:[itemSchema],
  contentCreatorToDos:[itemSchema],
  coreToDos:[itemSchema],
  coordinationToDos:[itemSchema],
  godToDos:[itemSchema],
  adToDos:[itemSchema],
  intitializerCalendar:{
    type: Map,
    of: [itemSchema],
    default:{ 'def': [{entity:'defo'}]},
  },
  thisMonthIntitializerCalendar:{
    type: Map,
    of: [itemSchema],
    default:{ 'def': [{entity:'defo'}]},
  },
  activityArray:[activitySchema],
  coreUsername:String,
  contentCreatorUsername:String,
  cycleStart: Number,

  strategyRating:[Number],
  photographyRating:[Number],
  contentRating:[Number],
  adRating:[Number],
  influencerRating:[Number],
  engagementCampaignRating:[Number],
  overallRating:[Number],






 });

 ClientSchema.methods.getCalendarAndToDos =function(entity) {
   if(entity==="Client"){
     var calendar=this.clientCalendar;
     var todos=this.clientToDos;
   }

   else if(entity==="ContentCreator"){
     var calendar=this.contentCreatorCalendar;

     var todos=this.contentCreatorToDos;

   }
   else if(entity==="Core"){
     var calendar=this.coreCalendar;
     var todos=this.coreToDos;


   }
   else if(entity==="Coordination"){
     var calendar=this.coordinationCalendar;

     var todos=this.cooridnationToDos;

   }
   else if(entity==="Ad"){
     var calendar=this.adCalendar;
     var todos=this.adToDos;


   }
   else if(entity==="God"){
     var calendar=this.godCalendar;
     var todos=this.godToDos;
   }
   return({neededCalendar:calendar, neededToDos:todos});

  };


  ClientSchema.methods.addService=function(service){

    this.services.push(service);

    var today = new Date();
    var IndiaDateToday=today.toLocaleDateString('en-US', {timeZone: "Asia/Kolkata"}); //1/27/2019
    var arrayDayHelper=IndiaDateToday.split("/");
    var thisMonth=parseInt(arrayDayHelper[0]);
    var thisDay=parseInt(arrayDayHelper[1]);
    var thisYear=parseInt(arrayDayHelper[2]);


    async function neededAsyncFunc() {
    await this.removeComingMonthOnwards(this.cycleStart);
    await this.removeQueueItemsComingMonthOnwards(this.cycleStart);

    //  console.log(this.clientCalendar);

      }

      var boundNeededAsyncFunc= neededAsyncFunc.bind(this);

      boundNeededAsyncFunc().then(() => {
       this.startMonthlyCycle(this.services,this.cycleStart,thisMonth,thisYear);
     });


  }

  ClientSchema.methods.removeService=function(service){
    var services=this.services;
    console.log("services: "+services+" service: "+service);

    var found = services.find(function(element) {
      if(element.valueOf()==service.valueOf()){
      return element;
      }
    });

    var index = this.services.indexOf(found);
    this.services.splice(index, 1);

    var today = new Date();
    var IndiaDateToday=today.toLocaleDateString('en-US', {timeZone: "Asia/Kolkata"}); //1/27/2019
    var arrayDayHelper=IndiaDateToday.split("/");
    var thisMonth=parseInt(arrayDayHelper[0]);
    var thisDay=parseInt(arrayDayHelper[1]);
    var thisYear=parseInt(arrayDayHelper[2]);

    async function neededAsyncFunc() {
    await this.removeComingMonthOnwards(this.cycleStart);
    await this.removeQueueItemsComingMonthOnwards(this.cycleStart);
    //  console.log(this.clientCalendar);

      }

      var boundNeededAsyncFunc= neededAsyncFunc.bind(this);

      boundNeededAsyncFunc().then(() => {
       this.startMonthlyCycle(this.services,this.cycleStart,thisMonth,thisYear);
     });


  }


  ClientSchema.methods.removeComingMonthOnwards=function(cycleStart){

    var calendarArr=[this.adCalendar,
    this.contentCreatorCalendar,
    this.coreCalendar,
    this.godCalendar,
    this.coordinationCalendar,
    this.clientCalendar,
    this.intitializerCalendar];

    var today = new Date();
    var IndiaDateToday=today.toLocaleDateString('en-US', {timeZone: "Asia/Kolkata"}); //1/27/2019
    var arrayDayHelper=IndiaDateToday.split("/");
    var thisMonth=parseInt(arrayDayHelper[0]);
    var thisDay=parseInt(arrayDayHelper[1]);
    var thisYear=parseInt(arrayDayHelper[2]);

    if (thisDay>cycleStart){
      var cycleStartMonth=thisMonth+1;
    }
    if (thisDay<cycleStart||thisDay==cycleStart){
      var cycleStartMonth=thisMonth;
    }

    var StartDate = new Date(thisYear, cycleStartMonth-1, cycleStart);

    for(var o=0;o<calendarArr.length;o++){
      var calendar=calendarArr[o];
      let dates =[ ...calendar.keys() ];


      for (var i=0;i<dates.length;i++){
        var date=dates[i];
        var dateHelper=date.split("-");
        var year=parseInt(dateHelper[0]);
        var month=parseInt(dateHelper[1]);
        var day=parseInt(dateHelper[2]);

        var GottenDate = new Date(year, month-1, day);


        if(GottenDate>StartDate){

          var elementArr=calendar.get(date);


          var Delete=true;

          for (var l=0;l<elementArr.length;l++){
            if(elementArr[l]=="Fill the KYC(Start)" || elementArr[l]=="Assign A Core(Start)" || elementArr[l]=="Assign A Content Creator(Start)"||elementArr[l]=="Fill the KYC(Deadline)" || elementArr[l]=="Assign A Core(Deadline)" || elementArr[l]=="Assign A Content Creator(Deadline)" ){
              Delete=false;
            }
          }

          if(Delete==true){

            calendar.delete(date);

          }

          }

        }




      }
    }



      ClientSchema.methods.removeQueueItemsComingMonthOnwards=function(cycleStart){

        var queueArr=[this.motherQueue,
        this.callQueue,
        this.influencerQueue,
        this.adQueue,
        this.influencerQueue,
        this.engagementCampaignQueue];

        var today = new Date();
        var IndiaDateToday=today.toLocaleDateString('en-US', {timeZone: "Asia/Kolkata"}); //1/27/2019
        var arrayDayHelper=IndiaDateToday.split("/");
        var thisMonth=parseInt(arrayDayHelper[0]);
        var thisDay=parseInt(arrayDayHelper[1]);
        var thisYear=parseInt(arrayDayHelper[2]);

        if (thisDay>cycleStart){
          var cycleStartMonth=thisMonth+1;
        }
        if (thisDay<cycleStart||thisDay==cycleStart){
          var cycleStartMonth=thisMonth;
        }

        var StartDate = new Date(thisYear, cycleStartMonth-1, cycleStart);


        for(var o=0;o<queueArr.length;o++){
          var queue=queueArr[o];
          var removalArr=[];


          for (var i=0;i<queue.length;i++){
            var queueItem=queue[i];
            var ItemStartDate=queueItem["startDate"];
            var dateHelper=ItemStartDate.split("-");
            var year=parseInt(dateHelper[0]);
            var month=parseInt(dateHelper[1]);
            var day=parseInt(dateHelper[2]);



            var GottenDate = new Date(year, month-1, day);
            console.log("StartDate "+StartDate);

            if(GottenDate>StartDate){
               removalArr.push(i);

            }

        }

        for(var y=0;y<removalArr.length;y++){
          queue.splice(removalArr[y]-y, 1);


        }
      }
    }







  ClientSchema.methods.addQueueCalendarValue=function(entity,queue,cycleStart,month,startDay,endDay,year,calendarMessage,screen,initializer,activityMsg,service){

      var neededCalendar=this.getCalendarAndToDos(entity)["neededCalendar"];
      var calendar=this.getCalendarAndToDos(entity)["neededCalendar"];

      var InitCal=this.intitializerCalendar;
      var today = new Date();
      var IndiaDateToday=today.toLocaleDateString('en-US', {timeZone: "Asia/Kolkata"}); //1/27/2019
      var arrayDayHelper=IndiaDateToday.split("/");
      var thisMonth=parseInt(arrayDayHelper[0]);
//      var thisIsAddOrRemove=false;



      if (thisMonth!=month){
      //  thisIsAddOrRemove=true;
      }

      if(cycleStart==1 && calendarMessage=="KYC"){

      var startMonth=month;
      var endMonth=month+1;

      }

      else if(cycleStart==1){
      var startMonth=month+1;
      var endMonth=month+1;

      }

      else{


        if(calendarMessage!="Fill the KYC"){
          var startDay=startDay+16;
        }
        else{
          console.log(startDay);
        }
        var endDay=endDay+16;

        var startMonth=month;
        var endMonth=month;

        if(startDay>30){
          var startDay=startDay-30;
          var startMonth=month+1;

        }

        if(endDay>30){

          var endMonth=month+1;
          var endDay=endDay-30;
        }
      }

      if(endDay<10){
        endDay="0"+endDay;
      }
      if(startDay<10){
        startDay="0"+startDay;
      }

      if(startMonth<10){
        var OGstartMonth="0"+startMonth;
      }
      if(endMonth<10){
          var OGendMonth="0"+endMonth;
      }

      var OGstartDate=year+"-"+OGstartMonth+"-"+startDay;
      var OGendDate=year+"-"+OGendMonth+"-"+endDay;


      for(var i=0;i<24;i++){


      /*  if(i==0 && thisIsAddOrRemove==false){
          var calendar=thisMonthCalendar
          var InitCal=this.thisMonthIntitializerCalendar;

        }
        else{
          var calendar=neededCalendar;
          var InitCal=this.intitializerCalendar;
        }*/

        var endYear=year;
        var startYear=year;

        var stringedStartMonth=startMonth+i;
        var stringedEndMonth=endMonth+i;

        if(stringedStartMonth>12 && stringedStartMonth<25){
          var startYear=year+1;
          var stringedStartMonth=stringedStartMonth-12;

        }
        if(stringedStartMonth>24){
          var startYear=year+2;
          var stringedStartMonth=stringedStartMonth-24;

        }
        if(stringedEndMonth>12 && stringedEndMonth<25){
          var endYear=year+1;
          var stringedEndMonth=stringedEndMonth-12;

        }
        if(stringedEndMonth>24){
          var endYear=year+2;
          var stringedEndMonth=stringedEndMonth-24;

        }

        if(stringedEndMonth<10){
          stringedEndMonth="0"+stringedEndMonth;
        }
        if(stringedStartMonth<10){
          stringedStartMonth="0"+stringedStartMonth;
        }

        var startDate=startYear+"-"+stringedStartMonth+"-"+startDay;
        var endDate=endYear+"-"+stringedEndMonth+"-"+endDay;

        var startValueArr=calendar.get(startDate);
        if (startValueArr===undefined){
          startValueArr=[calendarMessage+"(Start)"];
      //    console.log("calendar: "+calendar+"startDate: "+startDate+" startValueArr: "+startValueArr);

          calendar.set(startDate,startValueArr);

        }
        else{
          startValueArr.push(calendarMessage+"(Start)");

          calendar.set(startDate,startValueArr);

        }


        var endValueArr=calendar.get(endDate);
        if (endValueArr===undefined){

          endValueArr=[calendarMessage+"(Deadline)"];
          calendar.set(endDate,endValueArr);

        }
        else if(endValueArr!=undefined && endValueArr !=null ){

          endValueArr.push(calendarMessage+"(Deadline)");

          calendar.set(endDate,endValueArr);
        }

        queueItem={entity:entity,calendarMessage:calendarMessage,screen:screen,startDate:startDate,endDate:endDate,activityMessage:{key:calendarMessage+entity,msg:activityMsg,service:service}};
        if(initializer==true){
          var initializerValue=InitCal.get(startDate);
          if (initializerValue===undefined){
            var initializerArr=[queueItem];

            InitCal.set(startDate,initializerArr);
          }

          else{
            initializerValue.push(queueItem);

            InitCal.set(startDate,initializerValue);

          }

        }



        if(queue==this.signUpQueue){
          i=25;
        }

      }

      var OGqueueItem={entity:entity,calendarMessage:calendarMessage,screen:screen,startDate:OGstartDate,endDate:OGendDate, OGstartDate:OGstartDate,OGendDate:OGendDate,activityMessage:{key:calendarMessage+entity,msg:activityMsg},service:service};

      queue.push(OGqueueItem);

      if(screen=="KYC"){
        this.clientToDos.push(OGqueueItem);
      }

    };



 ClientSchema.methods.startMonthlyCycle=function(services,thisCycleStart,thisMonth,thisYear){
   //cycle starts


 this.addQueueCalendarValue("Client",this.callQueue,thisCycleStart,thisMonth,1,2,thisYear,"Monthly Call","MonthlyCall",true,"The client just scheduled a monthly call","Default"); //needs adding
 this.addQueueCalendarValue("ContentCreator",this.callQueue,thisCycleStart,thisMonth,1,2,thisYear,"Monthly Call", "MonthlyCall",false,"The content creator just finished the monthly call with client","Default");
 this.addQueueCalendarValue("ContentCreator",this.motherQueue,thisCycleStart,thisMonth,2,5,thisYear,"Brainstorm","Brainstorm",false,"The content creator just scheduled a brainstorm session with core","Default");//needs adding
 this.addQueueCalendarValue("Core",this.motherQueue,thisCycleStart,thisMonth,2,5,thisYear,"Brainstorm","Brainstorm",false,"The core just finished a brainstorm session with the content creator","Default");
//checking services to include or not
     for (var i=0;i<services.length;i++){

       if (services[i]==="Ads"){

         this.addQueueCalendarValue("ContentCreator",this.adQueue,thisCycleStart,thisMonth,5,5,thisYear,"Create Ad Plan","AdPlan", true,"The content creator just finished the content part for the ad plan",services[i]);

         this.addQueueCalendarValue("Ad",this.adQueue,thisCycleStart,thisMonth,5,5,thisYear,"Create Ad Plan","AdPlan",false,"The ads expert just finished adding all necessary ad details for the ad",services[i]);

         //leaving this incomplete

       }

       if (services[i]==="Strategy"){

         this.addQueueCalendarValue("ContentCreator",this.motherQueue,thisCycleStart,thisMonth,5,7,thisYear,"Create Strategy Plan","Strategy",false,"The content creator just created the strategy plan and sent it to core for approval",services[i]);

         this.addQueueCalendarValue("Core",this.motherQueue,thisCycleStart,thisMonth,7,8,thisYear,"Approve Strategy Plan","Strategy",false,"The core just approved the strategy plan and sent it to client for approval",services[i]);

         this.addQueueCalendarValue("Client",this.motherQueue,thisCycleStart,thisMonth,8,10,thisYear,"Approve Strategy Plan","Strategy",false,"The client just approved the strategy plan",services[i]);

       }

       if (services[i]==="2HourPhotography" || services[i]==="4HourPhotography"){

         this.addQueueCalendarValue("ContentCreator",this.motherQueue,thisCycleStart,thisMonth,10,12,thisYear,"Create Shoot Plan","ShootPlan",false,"The content creator just created the shoot plan and sent it to core for approval",services[i]);

         this.addQueueCalendarValue("Core",this.motherQueue,thisCycleStart,thisMonth,12,13,thisYear,"Approve Shoot Plan","ShootPlan",false,"The core just approved the shoot plan",services[i]);

         this.addQueueCalendarValue("Coordination",this.motherQueue,thisCycleStart,thisMonth,13,14,thisYear,"Schedule Shoot","SchedulingShoot",false,"The coordination team just sent a request to the client to schedule the shoot",services[i]);

         this.addQueueCalendarValue("Client",this.motherQueue,thisCycleStart,thisMonth,14,15,thisYear,"Approve Shoot Plan","ShootPlan",false,"The client just approved the shoot plan and the shoot is scheduled",services[i]);

       }

       if (services[i]==="15Posts" || services[i]==="30Posts"){

         this.addQueueCalendarValue("ContentCreator",this.motherQueue,thisCycleStart,thisMonth,21,26,thisYear,"Create Content Calendar","IGcalendar",false,"The content creator just created the content calendar and sent it to core for approval",services[i]);

         this.addQueueCalendarValue("Core",this.motherQueue,thisCycleStart,thisMonth,26,28,thisYear,"Approve Content Calendar","IGcalendar",false, "The core just approved the content calendar",services[i]);

         this.addQueueCalendarValue("Client",this.motherQueue,thisCycleStart,thisMonth,28,30,thisYear,"Approve Content Calendar","IGcalendar",false,"The client just approved the content calendar",services[i]);

       }


       if (services[i]==="Influencers"){


         this.addQueueCalendarValue("ContentCreator",this.influencerQueue,thisCycleStart,thisMonth,10,20,thisYear,"Create Influencer Plan","InfluencerPlan",true,"The content creator just created the influencer plan and sent it to core for approval",services[i]);

         this.addQueueCalendarValue("Core",this.influencerQueue,thisCycleStart,thisMonth,20,21,thisYear,"Approve Influencer Plan","InfluencerPlan",false,"The core just approved the influencer plan",services[i]);

         this.addQueueCalendarValue("Client",this.influencerQueue,thisCycleStart,thisMonth,21,22,thisYear,"Approve Influencer Plan","InfluencerPlan",false,"The client just approved the influencer plan",services[i]);

         this.addQueueCalendarValue("Coordination",this.influencerQueue,thisCycleStart,thisMonth,23,28,thisYear,"Schedule Influencers","SchedulingInfluencer",false,"The coordination team just began scheduling the influencer/s",services[i]);

         this.addQueueCalendarValue("Client",this.influencerQueue,thisCycleStart,thisMonth,28,30,thisYear,"Approve Influencer Scheduling","SchedulingInfluencer",false,"The client just approved the scheduled influencer/s",services[i]);

       }

     }



     console.log("CYCLE IS DONE");



 }




  ClientSchema.methods.startFreeTrial =function(selectedPackage) {

    console.log("selectedPackage:"+selectedPackage);

    this.selectedPackage=selectedPackage;
    if(selectedPackage==500){
      this.services=["Strategy","2HourPhotography","15Posts","Ads","Surveillance","Analytics"]
    }
    else if(selectedPackage==750){
      this.services=["Strategy","4HourPhotography","30Posts","Ads","Surveillance","Analytics"]
    }
    else if(selectedPackage==1000){
      this.services=["Strategy","4HourPhotography","30Posts","Ads","Surveillance","Analytics","Engagement Campaign"]
    }
    else{
      this.services=selectedPackage;
      console.log("selectedPackage:"+selectedPackage);

    }

    var today = new Date();
    var IndiaDateToday=today.toLocaleDateString('en-US', {timeZone: "Asia/Kolkata"}); //1/27/2019
    var arrayDayHelper=IndiaDateToday.split("/");
    var thisMonth=parseInt(arrayDayHelper[0]);
    var thisDay=parseInt(arrayDayHelper[1]);
    var thisYear=parseInt(arrayDayHelper[2]);

    /*var options = { timezone:"Asia/Kolkata",year: 'numeric', month: '2-digit', day: '2-digit' };
    var today = new Date();
    var IndiaDateToday=today.toLocaleDateString('zh-Hans-CN', options);*/

    var thisCycleStart;
    if(thisDay>15 && thisDay<32){
      thisCycleStart=1;
      this.cycleStart=1;
    }
    else{
      thisCycleStart=16;
      this.cycleStart=16;

    }


//    var boundQueueCalendarValue= addQueueCalendarValue.bind(this);
// ref-  boundQueueCalendarValue("Client",this.signUpQueue,thisCycleStart,thisMonth,thisDay,1,thisYear,"Fill the KYC","KYC",false,"The client just filled the KYC");

  //first time

  this.addQueueCalendarValue("Client",this.signUpQueue,thisCycleStart,thisMonth,thisDay,1,thisYear,"Fill the KYC","KYC",false,"The client just filled the KYC","SignUp");

  this.addQueueCalendarValue("God",this.signUpQueue,thisCycleStart,thisMonth,1,1,thisYear,"Assign A Core","CoreAssign",false,"At just assigned a core","SignUp" );

  this.addQueueCalendarValue("Core",this.signUpQueue,thisCycleStart,thisMonth,1,1,thisYear,"Assign A Content Creator", "ContentCreatorAssign",false,"Our core just assigned a content creator","SignUp");


  this.startMonthlyCycle(this.services,thisCycleStart, thisMonth, thisYear);
    //cycle starts

     }



    ClientSchema.methods.popAndAdd =function(queue,entity,calendarMessage) {

      //first removing item from queue and calendar because it's done

      var neededToDos=this.getCalendarAndToDos(entity)["neededToDos"];
      var neededCalendar=this.getCalendarAndToDos(entity)["neededCalendar"];

        var foundToDo = neededToDos.find(function(element) {
          if(element.calendarMessage==calendarMessage){
          return element;
          }
        });

        var index = neededToDos.indexOf(foundToDo);
        neededToDos.splice(index, 1);

        neededQueueItem=queue[0];

  /*      var neededActivity=neededQueueItem["activityMessage"];
        console.log(neededActivity )

        console.log("neededActivity:"+neededActivity);

        newKey=neededActivity.key;
        newMsg=neededActivity.msg;
        console.log("newMsg:"+newMsg);
        console.log("newKey:"+newKey);


        var newActivityObj={key:newKey,msg:newMsg};

        console.log("newActivityObj:"+newActivityObj);
*/
        this.activityArray.unshift(neededQueueItem["activityMessage"]);
        if(this.activityArray.length>20){
          this.activityArray.pop();
        }

        var getCalendarIndex= function(arr,thisElement){

          function isEquals(element) {

            return element.valueOf()==thisElement.valueOf();

          }

          console.log("arr: "+arr);


          var index=arr.findIndex(isEquals);

          return index;
        }

        neededStartDate=neededQueueItem["startDate"];
        neededEndDate=neededQueueItem["endDate"];
        neededCalendarMessage=neededQueueItem["calendarMessage"];



        var neededStartArray=neededCalendar.get(neededStartDate);


        var foundStartElementIndex = getCalendarIndex(neededStartArray,neededCalendarMessage+"(Start)");

        neededStartArray.splice(foundStartElementIndex, 1);


        if(neededStartArray==""){
          neededCalendar.delete(neededStartDate);
        }
        else{
        neededCalendar.set(neededStartDate,neededStartArray);
        }


        var neededEndArray=neededCalendar.get(neededEndDate);


        var foundEndElementIndex = getCalendarIndex(neededEndArray,neededCalendarMessage+"(Deadline)")
        neededEndArray.splice(foundEndElementIndex, 1);


        if(neededEndArray==""){
          neededCalendar.delete(neededEndDate);
        }
        else{
          neededCalendar.set(neededEndDate,neededEndArray);
        }


        if(queue!=this.signUpQueue){

              var thisItem=queue[0];
              var addToEnd=false;

              for(var p=0;p<this.service.length;p++){
                if(thisItem["service"].valueOf()==this.service[p].valueOf()){
                  addToEnd=true;
                }
              }
              if(thisItem["service"]=="Default"){
                addToEnd=true;
              }

              if(addToEnd==true){

              var thisItemStartDate=thisItem["OGstartDate"];
              var thisItemEndDate=thisItem["OGendDate"];

                var getNextDate=function (StringDate){
                    var thisItemHelper=StringDate.split("-");
                    var thisMonth=parseInt(thisItemHelper[1]);
                    var thisDay=thisItemHelper[2];
                    var thisYear=parseInt(thisItemHelper[0]);

                    if(thisMonth<12){
                      var nextMonth=thisMonth+1;
                      if(nextMonth<10){
                        var nextMonth="0"+nextMonth;
                      }
                    }
                    else{
                      var nextMonth="01";
                      var thisYear=thisYear+1;
                    }

                    return thisYear+"-"+nextMonth+"-"+thisDay;
                    }

                lastItem=thisItem;
                lastStartDate=getNextDate(thisItemStartDate);
                lastEndDate= getNextDate(thisItemEndDate);

                lastItem["startDate"]=lastStartDate;
                lastItem["endDate"]=lastEndDate;

                queue.push(lastItem);

                  }
              }

      queue.shift();



      var nextItem=queue[0];

      if(nextItem!=undefined){

      var nextEntity=nextItem["entity"];

      neededNextCalendarMessage=nextItem["calendarMessage"];
      var neededNextItemStartDate=nextItem["startDate"];
      var nextCalendar=this.getCalendarAndToDos(nextEntity)["neededCalendar"];
      var neededNextStartArray=nextCalendar.get(neededNextItemStartDate);

      console.log("nextItem: "+nextItem);

      console.log("neededNextItemStartDate: "+neededNextItemStartDate);
      console.log("nextCalendar: "+nextCalendar);
      console.log("neededNextStartArray: "+neededNextStartArray);

      var nextDates =[ ...nextCalendar.keys() ];
      console.log("nextDates: "+ nextDates)


      var foundNextStartElementIndex = getCalendarIndex(neededNextStartArray,neededNextCalendarMessage+"(Start)");
      neededNextStartArray.splice(foundNextStartElementIndex, 1);


      if(neededNextStartArray==""){
        nextCalendar.delete(neededNextItemStartDate);

      }
      else{
      nextCalendar.set(neededNextItemStartDate,neededNextStartArray);
    }

      var today = new Date();
      var IndiaDateToday=today.toLocaleDateString('en-US', {timeZone: "Asia/Kolkata"}); //1/27/2019
      var arrayDayHelper=IndiaDateToday.split("/");
      var thisMonth=parseInt(arrayDayHelper[0]);
      var thisDay=parseInt(arrayDayHelper[1]);
      var thisYear=parseInt(arrayDayHelper[2]);
      if(thisDay<10){
        thisDay="0"+thisDay;
      }
      if(thisMonth<10){
        thisMonth="0"+thisMonth;
      }

      var replaceStartDate=thisYear+"-"+thisMonth+"-"+thisDay;

      var nextNeededStartArr=nextCalendar.get(replaceStartDate);

      if(nextNeededStartArr==undefined){
        nextCalendar.set(replaceStartDate,[neededNextCalendarMessage+"(Start)"]);
      }
      else{
        nextNeededStartArr.push(neededNextCalendarMessage+"(Start)");
        nextCalendar.set(replaceStartDate,nextNeededStartArr);
      }


      nextItem["startDate"]=replaceStartDate;

      var nextNeededToDos=this.getCalendarAndToDos(nextEntity)["neededToDos"];

      nextNeededToDos.push({entity:nextItem.entity,startDate:nextItem.startDate, screen:nextItem.screen, endDate:nextItem.endDate,calendarMessage:nextItem.calendarMessage});

      }
      else{
        if(queue==this.signUpQueue){
          this.contentCreatorToDos.push(this.motherQueue[0]);
        }
      }

    };


    ClientSchema.methods.initializeWithDate =function() {

      //if item non-mother queue, then use ifs to catch this.

      var generateDay=function(minus){

        var today = new Date();
        today.setDate(today.getDate() - minus);
        var IndiaDateToday=today.toLocaleDateString('en-US', {timeZone: "Asia/Kolkata"}); //1/27/2019
        var arrayDayHelper=IndiaDateToday.split("/");

        var thisMonth=parseInt(arrayDayHelper[0]);

        var thisDay=parseInt(arrayDayHelper[1]);
        var thisYear=parseInt(arrayDayHelper[2]);

        if(thisDay<10){
          thisDay="0"+thisDay;
        }
        if(thisMonth<10){
          thisMonth="0"+thisMonth;
        }

        var todayRightFormat=thisYear+"-"+thisMonth+"-"+thisDay;

        return todayRightFormat;

      }

      var today = generateDay(0);
      var yesterday = generateDay(1);
      var TwoBefore = generateDay(2);
      var ThreeBefore = generateDay(3);
      var FourBefore = generateDay(4);
      var FiveBefore = generateDay(5);

      var daysArr=[today,yesterday,TwoBefore,ThreeBefore,FourBefore,FiveBefore]


      for(var q=0;q<daysArr.length;q++){

      var thisDay=daysArr[q];
      var initializerValue=this.intitializerCalendar.get(thisDay);

      if(initializerValue!=undefined && initializerValue[0]!=null){
        for(var i=0; i<initializerValue.length;i++){
          var item=initializerValue[i];
          var entity=item["entity"];
          var neededToDos=this.getCalendarAndToDos(entity)["neededToDos"];
            neededToDos.push(item);

        }

          this.intitializerCalendar.set(thisDay,undefined);

      }

    }



    };


/*
    ClientSchema.methods.writeGrid =function(options,readStream) {

//    const readStream = fs.createReadStream('/some/path/sample.txt');
//    const options = ({ filename: 'sample.txt', contentType: 'text/plain' });
    Attachment.write(options, readStream, (error, file) => {});

}

ClientSchema.methods.readGrid =function(size,objectID) {

// for larger file size, read a file and receive a readable stream
return readStream = Attachment.readById(objectid);

// for smaller file size, read a file and receive a buffer
//Attachment.readById(objectid, (error, buffer) => { ... });

}
*/

 var ClientModel = mongoose.model('Client', ClientSchema);


 module.exports = {
     ClientModel: ClientModel, // or whatever you want to assign it to
     ClientSchema: ClientSchema, // again, set it to what you like
 };
