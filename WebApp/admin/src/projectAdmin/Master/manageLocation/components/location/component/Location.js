/*import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';
import $              from 'jquery';
export const Location = new Mongo.Collection('location');

if(Meteor.isServer){
  Meteor.publish('locationdata',function locationdata(){
      return Location.find({});
  });  
  
}
Meteor.methods({
  'addLocation' : function(locationValues) {   
  var locationVar = Location.findOne({'countryName' : locationValues.country, 'stateName' : locationValues.state, 'districtName' : locationValues.district,'cityloctn' :locationValues.cityloctn,'pincodeloctn' :locationValues.pincodeloctn});     
    if(locationVar){
      var result = 'exist';
    }else{    
      var result = Location.insert({

        countryName      :locationValues.country,     
        stateName        :locationValues.state,     
        cityloctn        :locationValues.city,
        arealoctn        :locationValues.arealoctn,
        pincodeloctn     :locationValues.pincodeloctn,
        updatedAt        : new Date(), 
        createdAt        : new Date(), 
                  
      }); 
    } 
    return result;                                                 
  },

  'delLocation':function(id){
     Location.remove({'_id': id});
  
  },

  'updateLocation' : function(id,locationValues) {      
       Location.update(
        { '_id': id },
       {
         $set:{   
          countryName      :locationValues.country,     
          stateName        :locationValues.state,     
          cityloctn        :locationValues.city,
          arealoctn        :locationValues.arealoctn,
          pincodeloctn     :locationValues.pincodeloctn,
          updatedAt        : new Date(), 
          createdAt        : new Date(), 
                    
       } });                                                    
  },

 'CSVUploadlocation': function(csvObject){
    var uploadSyncArr = [];
    var count         = 0;
    if(csvObject){

      for(i=0;i<csvObject.length-1;i++){
          count++;
          var locationData = Location.findOne({
                'countryName'   : csvObject[i].country,
                'stateName'     : csvObject[i].state,
                'cityloctn'     : csvObject[i].city,
                'arealoctn'     : csvObject[i].area,
                'pincodeloctn'  : csvObject[i].pincode, 
          });
          if(locationData){
            Location.update(
              {'_id' : locationData._id},
              {
                $set:{
                  'countryName'  : csvObject[i].country,
                  'stateName'    : csvObject[i].state,
                  'cityloctn'    : csvObject[i].city,
                  'arealoctn'    : csvObject[i].area,
                  'pincodeloctn' : csvObject[i].pincode, 
                  'updatedAt'    : new Date(),
                }
              }
            )
          }else{
              uploadSyncArr[i] = Location.insert({
                'countryName'                   : csvObject[i].country,
                'stateName'                     : csvObject[i].state,
                'cityloctn'                     : csvObject[i].city,
                'arealoctn'                     : csvObject[i].area,
                'pincodeloctn'                  : csvObject[i].pincode,
                'updatedAt'                     : new Date(), 
                'createdAt'                     : new Date(), 
              });
              if(uploadSyncArr[i]){
             }
          }
      }
    }
    return count;
  },
});
*/