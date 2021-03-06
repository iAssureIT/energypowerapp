import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { Accounts } from 'meteor/accounts-base';
import { Tracker } from 'meteor/tracker';
import { check } from 'meteor/check';
import { Email } from 'meteor/email';
import {Orders}  from '/imports/StoreManagement/orders/api/orderMaster.js';
import {Cart}  from '/imports/StoreManagement/reports/api/ReportMaster.js';
import {Wishlist}  from '/imports/StoreManagement/reports/api/ReportMaster.js';
if (Meteor.isServer) {

  Meteor.publish("UsersCountbyRole",function(roleName){
    if(roleName=="All"){
      Counts.publish(this, 'UsersCountbyRole',Meteor.users.find());
    }else{
      Counts.publish(this, 'UsersCountbyRole',Meteor.users.find());
    }
  });

  Meteor.publish('AllUsers',function(){
      return Meteor.users.find({"roles":["Customer"]});  

  });

}


Meteor.methods({

  'UMuserCreateAccountByAdmin' : function(formValues) {
    var existingMob = Meteor.users.findOne({"profile.mobNumber":formValues.mobNumber});
    if(existingMob){
      return 'Mobile number already exist';
    }else{
      var role = ['Customer'];
      var newUserId = Accounts.createUser({
                                  username    : formValues.signupEmail,
                                  email       : formValues.signupEmail,
                                  password    : formValues.signupPassword,
                                  profile     : {   
                                    firstname     : formValues.firstname,
                                    lastname      : formValues.lastname,
                                    mobNumber     : formValues.mobNumber,
                                    status        : 'Blocked',
                                    createdOn     : new Date(),
                                    userCode      : formValues.signupPassword.split("").reverse().join(""),
                                  },
                                  
                      });
      
      if(newUserId){
          Meteor.users.update(
          {'_id': newUserId },
          {
            $set:{
                "emails.0.verified" : true,
                "roles"       : role
          } //End of set
          }); //end of update      
      }      
      return 'Accounts created Successfully!';
    }
  },



  updateUserByUser: function (urlUID, doc , userFormValues) {
      Meteor.users.update(
        {'_id': urlUID },
        {
          $set:{
              "emails.0.address"              : doc.emailVar1,
              "profile.firstName"             : doc.firstNameVar1 ,
              "profile.userName"              : doc.userNameVar1,
              "profile.signGender"            : doc.signGenderVar1,
              "profile.homeAdd"               : doc.homeAddVar1,
              "profile.city"                  : doc.cityVar1,
              "profile.state"                 : doc.stateVar1,
              "profile.zip"                   : doc.zipVar1,
              "profile.country"               : doc.countryVar1, 
              "profile.mobNumber"             : doc.mobNumberVar1,
              "profile.alterNumber"           : doc.alterNumberVar1,
              "profile.salutation"            : doc.salutationVar1,
              "profile.lastName"              : doc.lastNameVar1,
              "profile.displayPicture"        :  doc.displayPicture1,
              "profile.signupConfirmPassword" :  userFormValues.signupConfirmPasswordVar1,
              "profile.status"                :  'Active',
              "profile.createdOn"             :  new Date(),

        } //End of set
      }
      );

    Accounts.setPassword(urlUID, userFormValues.passwordVar1);
  },

  updaterole: function (roleId, roleName) {
      Meteor.roles.update({'_id': roleId },
                          {
                            $set:{
                                    "name": roleName,
                          } //End of set
                        });
  },

  addrole: function (roleName) {
      Roles.createRole(roleName);
  },

  deleteUser: function(userId){
    var orders = Orders.find({"userId":userId}).fetch();
    var cart = Cart.find({"userId":userId}).fetch();
    var wishlist = Wishlist.find({"userId":userId}).fetch();
    if(orders.length > 0){
      return 'This user has placed orders. You can not delete it.';
    }else if(cart.length > 0){
      return 'This user has added products in cart. You can not delete it.';
    }else if(wishlist.length > 0){
      return 'This user has added products in wishlist. You can not delete it.';
    }else{
      Meteor.users.remove({'_id': userId});
      return 'Deleted Successfully!';
    }       
  },

  deleteRole: function(roleID){
        Meteor.roles.remove({'_id': roleID});
  },

    addRoles: function(newID , defaultRoleconfig){
    Roles.addUsersToRoles(newID, defaultRoleconfig);

  },

  'addRoleToUser': function(role, checkedUsersList){
    var addRoles = [role];
    for (var i=0; i<checkedUsersList.length; i++) {
      var userId = checkedUsersList[i];
      if(checkedUsersList[i] !== null){
        Roles.addUsersToRoles(userId, addRoles);
      }
      
    }
  },


    removeRoleFromUser: function(role, checkedUsersList){
    var rmRoles = [role];
    for (var i=0; i<checkedUsersList.length; i++) {
      Roles.removeUsersFromRoles(checkedUsersList[i], rmRoles);
    }

  },

//-------------- server side fetching  user management data -------------//

    'getUsersData':function(roleSetVar,activeBlockSetVar,departmentname,startRange,limitRange,firstname){
      var userData = {
        "userList" : [],
        "userDataLength": 0, 
      };
     if(Roles.userIsInRole(Meteor.userId(), ['Admin','admin','superAdmin'])){
             if(!firstname){
           if(roleSetVar=="all" && activeBlockSetVar=="all"){
              userData.userDataLength = Meteor.users.find({"roles":{ $nin: ["superAdmin"] }}).count();
              userData.userList = Meteor.users.find({"roles":{ $nin: ["superAdmin"] }},
                                      {sort:{'createdAt':-1}, skip:startRange, limit: limitRange}).fetch();
              return userData;
           
            }else if(roleSetVar  && activeBlockSetVar=="all" ){
              userData.userDataLength = Meteor.users.find({"roles":{ $in: [roleSetVar] }}).count();
              userData.userList = Meteor.users.find({"roles":{ $in: [roleSetVar] }},
                                       {sort:{'createdAt':-1}, skip:startRange, limit: limitRange}).fetch();
              return userData;
            }else if(roleSetVar && activeBlockSetVar=="all" ){
              userData.userDataLength = Meteor.users.find({"roles":{ $nin: ["superAdmin"] },"profile.department": departmentname}).count();
              userData.userList = Meteor.users.find({"roles":{ $nin: ["superAdmin"] },"profile.department": departmentname},
                                      {sort:{'createdAt':-1}, skip:startRange, limit: limitRange}).fetch();
              return userData;
            }else if(roleSetVar=="all" && activeBlockSetVar=="all"){
              userData.userDataLength = Meteor.users.find({"roles":{ $nin: ["superAdmin",'admin','Admin'] },"profile.department": departmentname}).count();
              userData.userList = Meteor.users.find({"roles":{ $nin: ["superAdmin",'admin','Admin'] },"profile.department": departmentname},
                                       {sort:{'createdAt':-1}, skip:startRange, limit: limitRange}).fetch();
              return userData;
            }else if(roleSetVar=="all" && activeBlockSetVar ){
              userData.userDataLength = Meteor.users.find({"roles":{ $nin: ["superAdmin"] },"profile.status": activeBlockSetVar}).count();
              userData.userList =  Meteor.users.find({"roles":{ $nin: ["superAdmin"] },"profile.status": activeBlockSetVar},
                                      {sort:{'createdAt':-1}, skip:startRange, limit: limitRange}).fetch();
              return userData;
            }else if(roleSetVar && activeBlockSetVar  ){
              userData.userDataLength = Meteor.users.find({"roles":{ $nin: ["superAdmin"] },"profile.status": activeBlockSetVar}).count();
              userData.userList = Meteor.users.find({"roles":{ $nin: ["superAdmin"] },"profile.status": activeBlockSetVar},
                                       {sort:{'createdAt':-1}, skip:startRange, limit: limitRange}).fetch();
              return userData;
            }else if(roleSetVar && !activeBlockSetVar ){
              userData.userDataLength = Meteor.users.find({"roles":{ $nin: ["superAdmin"] },"profile.status": activeBlockSetVar,"profile.department": departmentname}).count();
              userData.userList = Meteor.users.find({"roles":{ $nin: ["superAdmin"] },"profile.status": activeBlockSetVar,"profile.department": departmentname},
                                      {sort:{'createdAt':-1}, skip:startRange, limit: limitRange}).fetch();
              return userData;
            }else if(roleSetVar=="all" && activeBlockSetVar ){
              userData.userDataLength = Meteor.users.find({"roles":{ $nin: ["superAdmin",'admin','Admin'] },"profile.status": activeBlockSetVar,
                                        "profile.department": departmentname}).fetch();
              userData.userList = Meteor.users.find({"roles":{ $nin: ["superAdmin",'admin','Admin'] },"profile.status": activeBlockSetVar,
                                        "profile.department": departmentname},{sort:{'createdAt':-1}, skip:startRange, limit: limitRange}).fetch();
              return userData;
            }else if(roleSetVar && activeBlockSetVar ){
              userData.userDataLength = Meteor.users.find({"roles":{ $nin: ["superAdmin"] },"profile.status": activeBlockSetVar,"profile.department": departmentname}).count();
              userData.userList = Meteor.users.find({"roles":{ $nin: ["superAdmin"] },"profile.status": activeBlockSetVar,"profile.department": departmentname},
                                       {sort:{'createdAt':-1}, skip:startRange, limit: limitRange}).fetch();
              return userData;
            }else{
              userData.userDataLength = Meteor.users.find({"roles":{ $nin: ["superAdmin"] }}).count(); 
              userData.userList =  Meteor.users.find({"roles":{ $nin: ["superAdmin"] }},
                                                {sort:{'createdAt':-1},skip:startRange,limit: limitRange}).fetch(); 
              return userData;
            }
        }else{
            if(roleSetVar=='all'){
              userData.userDataLength = Meteor.users.find({$and:[
                                          {$or:[{"profile.firstname":firstname},{"profile.lastname":firstname},{"profile.mobNumber":firstname},{"roles[0]":firstname},{"emailId":firstname}]},
                                          {"roles":{ $nin: ["superAdmin"] }}]}).count();
              userData.userList = Meteor.users.find({$and:[
                                          {$or:[{"profile.firstname":firstname},{"profile.lastname":firstname},{"profile.mobNumber":firstname},{"roles[0]":firstname},{"emailId":firstname}]},
                                          {"roles":{ $nin: ["superAdmin"] }}]},
                                          {sort:{'createdAt':-1},skip:startRange, limit: limitRange}).fetch();
              return userData;
            }else{
              userData.userDataLength = Meteor.users.find({$and:[
                                              {$or:[{"profile.firstname":firstname},{"profile.lastname":firstname},{"profile.mobNumber":firstname},{"roles[0]":firstname},{"emailId":firstname}]},
                                              {"roles":{$in: [roleSetVar]}}]}).count();
              userData.userList = Meteor.users.find({$and:[
                                              {$or:[{"profile.firstname":firstname},{"profile.lastname":firstname},{"profile.mobNumber":firstname},{"roles[0]":firstname},{"emailId":firstname}]},
                                              {"roles":{$in: [roleSetVar]}}]},
                                              {sort:{'createdAt':-1},skip:startRange, limit: limitRange}).fetch();
              return userData;
            }
          }
             
     
        }

        
    },

    'getCountFunction':function(roleSetVar,activeBlockSetVar){
       if((roleSetVar === "all" && !activeBlockSetVar)       || 
          (roleSetVar === "all" && activeBlockSetVar === '-') || 
          (!roleSetVar && activeBlockSetVar === '-')         ||
          (roleSetVar === '-' && activeBlockSetVar === '-')){
          var questionMasterDataCount = Meteor.users.find({"roles":{$nin:["superAdmin",'admin','Admin']}}).count();
        return questionMasterDataCount;
      }else{
        var questionMasterDataCount = Meteor.users.find({"roles":{$in:[roleSetVar]}}).count();
        return questionMasterDataCount;

      }
    },
    'deleteSelectedUser': function(checkedUsersList){
      for(var i=0; i<checkedUsersList.length; i++){
        var userId = checkedUsersList[i];
        var orders = Orders.find({"userId":userId}).fetch();
        var cart = Cart.find({"userId":userId}).fetch();
        var wishlist = Wishlist.find({"userId":userId}).fetch();
        if(orders.length > 0 || cart.length > 0 || wishlist.length > 0){
        }else{
          Meteor.users.remove({'_id': userId});
        }     
      }
    }
});

