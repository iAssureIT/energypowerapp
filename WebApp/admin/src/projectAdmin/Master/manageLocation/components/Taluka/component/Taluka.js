import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';
export const Taluka = new Mongo.Collection('taluka');

if(Meteor.isServer){
  Meteor.publish('talukadata',function talukadata(){
      return Taluka.find({});
  });  
  
}
Meteor.methods({
  'addTaluka' : function(talukavalues) {  
    var talukaVar =  Taluka.findOne({countryName : talukavalues.country,stateName : talukavalues.state,
                      districtName : talukavalues.district,blockloctn :talukavalues.blockloctn}); 
    if(talukaVar){
      var result = 'exist' ; 
    }else{  
       var result = Taluka.insert({
        countryName     : talukavalues.country,           
        stateName       : talukavalues.state,   
        districtName    : talukavalues.district,   
        blockloctn      :talukavalues.blockloctn,
        updatedAt       : new Date(), 
        createdAt       : new Date(),   
                    
        });
    } 
    return result;                                                  
  },

'deleteTaluka':function(id){
     Taluka.remove({'_id': id});
  
  },
  'updateTaluka' : function(id,talukavalues) { 
   var talukaVar =  Taluka.findOne({countryName : talukavalues.country,stateName : talukavalues.state,
                      districtName : talukavalues.district,blockloctn :talukavalues.blockloctn}); 
    if(talukaVar){
      var result = 'exist' ; 
    }else{       
       var result = Taluka.update(
        { '_id': id },
       {
         $set:{    
          "countryName"     : talukavalues.country,           
          "stateName"       : talukavalues.state,   
          "districtName"    : talukavalues.district,   
          "blockloctn"      : talukavalues.blockloctn,
          "updatedAt"       : new Date(),
                    
       } }); 
    } 
    return result;                                                 
  },

'CSVUploadtaluka': function(csvObject){
    // check( csvObject, Array);
    var uploadSyncArr = [];
    var count         = 0;
    if(csvObject){
      UserSession.set("allProgressbarSession", csvObject.length-2, Meteor.userId());
      for(i=0;i<csvObject.length;i++){
          count++;
              uploadSyncArr[i] = Taluka.insert({
                'countryName'                   : csvObject[i].country,
                'stateName'                     : csvObject[i].state,
                'districtName'                  : csvObject[i].district,
                'blockloctn'                    : csvObject[i].taluka,
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
