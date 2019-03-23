influencerCampaignssocket.on('requestAllInfluencerCampaigns', function(data){

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
