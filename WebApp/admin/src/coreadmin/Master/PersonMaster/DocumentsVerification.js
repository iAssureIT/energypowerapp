import React from 'react';
import OwlCarousel  from 'react-owl-carousel';
import swal from 'sweetalert';
import axios        from 'axios';
import 'owl.carousel/dist/assets/owl.carousel.css';
import 'owl.carousel/dist/assets/owl.theme.default.css';
import './PersonMaster.css';

export default class DocumentsVerification extends React.Component {

  constructor(props) {
  super(props);
    this.state = {
    personInfo  : "",
    remark : "",
    status : "",
    action : "",
         
        };
  }
  componentWillReceiveProps(nextProps){
    this.setState({
      personInfo : nextProps.personInfo
      });
  }
  componentDidMount(){

  }

  handleChange(event){
    event.preventDefault();
        this.setState({
           remark: this.refs.remark.value
          
        });
  }

  approve(event){
    var documentName = event.target.getAttribute("data-action");
    var ID = event.target.id;
    console.log("ID",ID);
      if (documentName == "aadhar") {
      var userDetails = {
      personID        : this.state.personInfo._id,
      aadhar     :{
      aadharProof : [
      {
      "_id" : ID,

      "status" : "Approve",
      "remarks" : "",
      "verifiedOn" : null,
      "verifiedBy" : this.state.personInfo._id
      }]
      }
    }
  }else if (documentName == "identityProof") {
    var userDetails = {
    personID        : this.state.personInfo._id,

    identityProof : [
    {
    "_id" : ID,

    "status" : "Approve",
    "remarks" : "",
    "verifiedOn" : null,
    "verifiedBy" : this.state.personInfo._id
    }]
    }
  }
  else{/*drivingLicense*/
    var userDetails = {
      personID        : this.state.personInfo._id,
      drivingLicense :{
        licenseProof : [{
        "_id" : ID,
        "status" : "Approve",
        "remarks" : "",
        "verifiedOn" : null,
        "verifiedBy" : this.state.personInfo._id
        }]
      }
    }
  }
  console.log("userDetails",userDetails);
  swal({
  text: "Document Verified",
    icon: 'success'
  });
  axios.patch('/api/personmaster/patch',userDetails)
  .then(function (response) {
      // handle success
      console.log("========",response.data);
      swal("Document Verified");
     
    })
    .catch(function (error) {
      // handle error
      console.log(error);
    });

  }
  RejectModal(event){
    var documentName = event.target.getAttribute("data-action");
    this.setState({
       action : documentName,
    });
  }
  Reject(event){
    console.log("remark",this.state.remark);
    var ID = event.target.id;
    console.log("ID",ID);
    if (this.state.action == "aadhar") {
    var userDetails = {
      personID        : this.state.personInfo._id,
      aadhar     :
      {
      status : "Reject",
      remark : this.state.remark,
      }
    }
  }else if (this.state.action == "identityProof") {
  // console.log("im in else of reject");
  var userDetails = {
  personID        : this.state.personInfo._id,
  identityProof :
  {
  status : "Reject",
  remark : this.state.remark,
  }
  }

  }
  else{/*drivingLicense*/
  var userDetails = {
  personID        : this.state.personInfo._id,
  drivingLicense :
  {
  status : "Reject",
  remark : this.state.remark,
  }
  }

  }
  console.log("userDetails",userDetails);
  /* axios.patch('/api/personmaster/patch', userDetails)
  .then(function (response) {
      // handle success
      console.log("========",response.data);
      // swal("Thank you. Your Block is Created.");
     
    })
    .catch(function (error) {
      // handle error
      console.log(error);
    });*/

  }
render() {
console.log("personInfo",this.state.personInfo);
return (
<div>

<OwlCarousel
    className="owl-theme docverifications"
    loop
    margin={10}
    nav
    items={1}
>

    {
this.state.personInfo.aadhar && this.state.personInfo.aadhar.aadharProof.length>0 ?
   
<div className="col-lg-12 noPadding">
        <button type="button" className="close closebtnOfmdl" data-dismiss="modal">&times;</button>

<label className="col-lg-12 marginTopModal text-center labHeader">Aadhar Proof</label>
{
this.state.personInfo.aadhar.aadharProof.map((image,index)=>{
return(
<div className="item">
<div className="col-lg-10 col-lg-offset-1 col-md-12 col-sm-12 col-sm-12" key={index}>
<img src = {image.imgUrl} className="imagewidheight"/>
<div className="col-lg-offset-4 col-lg-4">
<button type="button" className="btn btn-success col-lg-5 marg10" data-action="aadhar" id={image._id} onClick={this.approve.bind(this)}>Approve</button>
<button type="button" className="btn btn-danger col-lg-5 marg10" data-action="aadhar" id="newModalRemark"  data-toggle="modal" data-target="#RemarkMod" onClick={this.RejectModal.bind(this)}>Reject</button>
</div>
</div>
</div>
);
})

}
</div>
   
:
null
   }
    {
this.state.personInfo.identityProof && this.state.personInfo.identityProof.length>0  ?
    <div>
   
{
this.state.personInfo.identityProof.map((image,index)=>{
return(
<div className="col-lg-12 noPadding">
        <button type="button" className="close closebtnOfmdl" data-dismiss="modal">&times;</button>
<label className="col-lg-12 marginTopModal text-center labHeader">Identity Proof</label>
<div className="col-lg-10 col-lg-offset-1 col-md-12 col-sm-12 col-sm-12" key={index}>
<div className="item">
<img src = {image.imgUrl} className="imagewidheight"/>
<div className="col-lg-offset-4 col-lg-4">
<button type="button" className="btn btn-success col-lg-5 marg10" data-action="identityProof" onClick={this.approve.bind(this)} id={image._id}>Approve</button>
<button type="button" className="btn btn-danger col-lg-5 marg10" data-action="identityProof" id="newModalRemark"  data-toggle="modal" data-target="#RemarkMod">Reject</button>
</div>
</div>
</div>
</div>

);
})
}

</div>
  
:
null
    }


   {
this.state.personInfo.drivingLicense  && this.state.personInfo.drivingLicense.licenseProof.length>0  ?
   

this.state.personInfo.drivingLicense.licenseProof.map((image,index)=>{
return(
<div className="col-lg-12 noPadding">
        <button type="button" className="close closebtnOfmdl" data-dismiss="modal">&times;</button>

<label className="col-lg-12 marginTopModal text-center labHeader">License Proof</label>

<div className="item">
<div className="col-lg-10 col-lg-offset-1 col-md-12 col-sm-12 col-sm-12" key={index}>

<img src = {image.imgUrl} className="imagewidheight"/>

<div className="col-lg-offset-4 col-lg-4">
<button type="button" className="btn btn-success col-lg-5 marg10" data-action="identityProof" onClick={this.approve.bind(this)} id={image._id} >Approve</button>
<button type="button" className="btn btn-danger col-lg-5 marg10" data-action="identityProof" id="newModalRemark"  data-toggle="modal" data-target="#RemarkMod">Reject</button>
</div>
</div>
</div>
</div>
);
})


   
:
null
}
   
</OwlCarousel>



{/*<div className="modal-footer">
        <button type="button" className="btn btn-default" data-dismiss="modal">Close</button>
      </div>*/}

{/*<!-- Modal -->*/}
<div id="RemarkMod" className="modal" role="dialog">
  <div className="modal-dialog modalwidtop">

    {/*<!-- Modal content-->*/}
    <div className="modal-content">
      <div className="modal-header bgblue">
        <button type="button" className="close" data-dismiss="modal">&times;</button>
        <h4 className="modal-title text-center">Remark</h4>
      </div>
      <div className="modal-body">
   

<textarea id="w3mission" className="col-lg-10 col-lg-offset-1" rows="4" cols="50" ref="remark" id="remark" value={this.state.remark} name="remark"  onChange={this.handleChange.bind(this)}>

</textarea>
      </div>
      <div className="modal-footer">
        <button type="button" className="btn bgblue col-lg-2 col-lg-offset-5 mtop10" data-action={this.state.action} data-dismiss="modal" onClick={this.Reject.bind(this)}>Submit</button>
      </div>
    </div>

  </div>
</div>
</div>
);
}
}
