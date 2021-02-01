import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';
export const District = new Mongo.Collection('district');

if(Meteor.isServer){
  Meteor.publish('districtdata',function districtdata(){
      return District.find({});
  });  
  
}
Meteor.methods({
  'addDistrict' : function(districtValues) { 
    var districtVar = District.findOne({countryName : districtValues.country, stateName : districtValues.state, districtName : districtValues.district});     
    if(districtVar){
      var result = 'exist';
    }else{   
       var result = District.insert({
        countryName     : districtValues.country,           
        stateName       : districtValues.state,   
        districtName    : districtValues.district,     
        updatedAt       : new Date(), 
        createdAt       : new Date(),             
                    
        });
    } 
    return result;                                                      
  },

'deleteDistrict':function(id){
     District.remove({'_id': id});
  
  },

 /* 'updateDistrict' : function(id,districtValues) {      
       District.update(
        { '_id': id },
       {
         $set:{             
          "countryName "    : districtValues.countryName ,
          "stateName "      : districtValues.stateName , 
          "districtName "    :districtValues.districtName ,     
                      
                    
       } });                                                   
  },*/

  'updateDistrict' : function(id,districtValues) {      
      District.update(
        { '_id': id },
       {
         $set:{ 
          countryName     : districtValues.country,           
          stateName       : districtValues.state,   
          districtName    : districtValues.district,   
          updatedAt       : new Date(), 
                    
       } });                                                   
  },


'CSVUploaddistrict': function(csvObject){
    var uploadSyncArr = [];
    var count         = 0;
    if(csvObject){
      // console.log("csvObject.length: ",csvObject.length);
      UserSession.set("allProgressbarSession", csvObject.length-2, Meteor.userId());
      for(i=0;i<csvObject.length-1;i++){
          count++;
              uploadSyncArr[i] = District.insert({
                'countryName'                   : csvObject[i].country,
                'stateName'                     : csvObject[i].state,
                'districtName'                  : csvObject[i].district,
                'updatedAt'                     : new Date(), 
                'createdAt'                     : new Date(), 
              });
              if(uploadSyncArr[i]){
                UserSession.set("progressbarSession", i, Meteor.userId());
              }
      }// EOF i
    }

    return count;
  },
});
