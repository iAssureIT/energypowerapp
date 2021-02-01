/*
import $              from 'jquery';
export const Area = new Mongo.Collection('area');

if(Meteor.isServer){
  Meteor.publish('areadata',function areadata(){
      return Area.find({});
  });  
  
}
Meteor.methods({
  'addArea' : function(areavalues) {  
    var areaVar =  Area.findOne({countryName : areavalues.country,stateName : areavalues.state,
                      cityName : areavalues.city, area : areavalues.area}); 
    if(areaVar){
      var result = 'exist' ; 
    }else{  
       var result = Area.insert({
        countryName     : areavalues.country,           
        stateName       : areavalues.state,   
        cityName        : areavalues.city,   
        area            : areavalues.area,
        updatedAt       : new Date(), 
        createdAt       : new Date(),   
                    
        });
    } 
    return result;                                                  
  },

  'deleteArea':function(id){
     Area.remove({'_id': id});
  },
  'updateArea' : function(id,areavalues) { 
   var talukaVar =  Area.findOne({countryName : areavalues.country, stateName : areavalues.state,
                      cityName : areavalues.city, area : areavalues.area}); 
    if(talukaVar){
      var result = 'exist' ; 
    }else{       
       var result = Area.update(
        { '_id': id },
       {
         $set:{    
          "countryName"     : areavalues.country,           
          "stateName"       : areavalues.state,   
          "cityName"        : areavalues.city,   
          "area"            : areavalues.area,
          "updatedAt"       : new Date(),
                    
       } }); 
    } 
    return result;                                                 
  },*/

/*'CSVUploadarea': function(csvObject){
   
    var uploadSyncArr = [];
    var count         = 0;
    if(csvObject){
      for(i=0;i<csvObject.length-1;i++){
          count++;
          var areaData = Area.findOne({
                'countryName': csvObject[i].country,
                'stateName'  : csvObject[i].state,
                'cityName'   : csvObject[i].city,
                'area'       : csvObject[i].area,
          });
          if(areaData){
            Area.update(
              {'_id': areaData._id},
              {
                $set:{
                  'countryName': csvObject[i].country,
                  'stateName'  : csvObject[i].state,
                  'cityName'   : csvObject[i].city,
                  'area'       : csvObject[i].area,
                  'updatedAt'  : new Date()
                }
              }
            )
          }else{
            uploadSyncArr[i] = Area.insert({
                'countryName'                   : csvObject[i].country,
                'stateName'                     : csvObject[i].state,
                'cityName'                      : csvObject[i].city,
                'area'                          : csvObject[i].area,
                'updatedAt'                     : new Date(), 
                'createdAt'                     : new Date(), 
              });
              if(uploadSyncArr[i]){

              }
          }
      }
    }

    return count;
  },*/
/*});*/
