import React, { Component } from 'react';
import { render }           from 'react-dom';
import $ from "jquery";
import axios from 'axios';
import swal from 'sweetalert';


class CompanyEmailGateway extends Component{
   constructor(props) {
    super(props);
    this.state = {
      user : '',
      password : '',
      port:'',
      emailHost:'',
      projectName:'',
      id:""
    };
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount(){
   
    $("#CompanyEmailGatewayForm").validate({
      rules: {
        user: {
          required: true,
        },
        password: {
          required: true,
        },
        port: {
          required: true,
        },
        emailHost: {
          required: true,
        },
        projectName: {
          required: true,
        }
      }
    });
    axios.get('/api/projectsettings/get/EMAIL')
    .then((response)=>{
      this.setState({
        id : response.data._id,
        user : response.data.user,
        password : response.data.password,
        port:response.data.port,
        emailHost:response.data.emailHost,
        projectName:response.data.projectName
      })
      $("#btnSubmit").html('Update');
    })
  }
  componentWillReceiveProps(nextProps) {
    axios.get('/api/projectsettings/get/EMAIL')
    .then((response)=>{
      this.setState({
        id : response.data._id,
        user : response.data.user,
        password : response.data.password,
        port:response.data.port,
        emailHost:response.data.emailHost,
        projectName:response.data.projectName
      })
      $("#btnSubmit").html('Update');
    })
  }

  handleChange(event){
    const {name,value} = event.target;
    this.setState({ 
      [name]:value
    });
  }

 
  submitData(event){
    event.preventDefault();
        var formvalue ={
          user : this.state.user,
        password : this.state.password,
        port : this.state.port,
        emailHost : this.state.emailHost,
        projectName : this.state.projectName,
          type      : 'EMAIL',
          createdBy : localStorage.getItem("user_ID")
        }
        if($("#CompanyEmailGatewayForm").valid()){
          axios.post('/api/projectsettings/post',formvalue)
          .then((response)=> {
            swal({                
                  text: "Email Gateway details added successfully!",
                });
           
          })
          .catch((error)=> {
            swal({                
                  text: "Failed to add Email Gateway details!",
                });
          })
        }
  }

  update(event){
    event.preventDefault();
      var formvalues ={
        user : this.state.user,
        password : this.state.password,
        port : this.state.port,
        emailHost : this.state.emailHost,
        projectName : this.state.projectName,
        type:'EMAIL',
        createdBy : localStorage.getItem("user_ID")
      }
      if($("#CompanyEmailGatewayForm").valid()){
        axios.patch('/api/projectsettings/patch/EMAIL',formvalues)
        .then((response)=> {
          swal({                
                text: "Email Gateway details Updated successfully!",
              });
         
        })
        .catch((error)=> {
          swal({                
                text: "Failed to Updated Email Gateway details!",
              });
        })
      }

}

  render(){
    return(
      <div className="">
        <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 companyDisplayForm">
            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                <h4 className="">Email Gateway</h4>
            </div>
               <hr className="compySettingHr" />
          <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
            <form id="CompanyEmailGatewayForm"  >
              <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 pdcls">
                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 compForm compinfotp">
                  <div className="col-lg-4 col-md-4 col-sm-12 col-xs-12 nopadding">
                    <div className="form-group formht pdcls">
                        <div className="form-group margin15">
                            <label className="labelform" >User</label><span className="astrick">*</span>
                            <input value={this.state.user} onChange={this.handleChange} data-text="user" type="text" id="user" title="Please enter valid user" name="user" className="form-control CLcompanyAddress inputValid " required/>
                        </div>
                    </div> 
                  </div>
                  <div className="col-lg-4 col-md-4 col-sm-12 col-xs-12 nopadding">
                    <div className="form-group formht pdcls">
                        <div className="form-group margin15">
                            <label className="labelform" >Password</label><span className="astrick">*</span>
                            <input value={this.state.password} onChange={this.handleChange} data-text="blockName" type="text" id="password" title="Please enter valid password" name="password" className="form-control CLcompanyAddress inputValid " required/>
                        </div>
                    </div> 
                  </div>
                  <div className="col-lg-4 col-md-4 col-sm-12 col-xs-12 nopadding">
                    <div className="form-group formht pdcls">
                        <div className="form-group margin15">
                            <label className="labelform" >Project</label><span className="astrick">*</span>
                            <input value={this.state.projectName} onChange={this.handleChange} data-text="blockName" type="text" id="projectName" title="Please enter valid projectName" name="projectName" className="form-control CLcompanyAddress inputValid " required/>
                        </div>
                    </div> 
                  </div>
                </div>
                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 compForm">
                  <div className="col-lg-4 col-md-4 col-sm-12 col-xs-12 nopadding">
                    <div className="form-group formht pdcls">
                        <div className="form-group margin15">
                            <label className="labelform" >Port</label><span className="astrick">*</span>
                            <input value={this.state.port} onChange={this.handleChange} data-text="blockName" type="number" id="port" title="Please enter valid port" name="port" className="form-control CLcompanyAddress inputValid " required/>
                        </div>
                    </div> 
                  </div>
                  
                  <div className="col-lg-4 col-md-4 col-sm-12 col-xs-12 nopadding">
                    <div className="form-group formht pdcls">
                        <div className="form-group margin15">
                            <label className="labelform" >Host</label><span className="astrick">*</span>
                            <input value={this.state.emailHost} onChange={this.handleChange} data-text="blockName" type="text" id="emailHost" title="Please enter valid emailHost" name="emailHost" className="form-control CLcompanyAddress inputValid " required/>
                        </div>
                    </div> 
                  </div>
                </div>
                
              </div>
              <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12  ">
              {
                    this.state.id === "" || this.state.id == undefined ?
                        <button className="col-lg-3 col-md-2 col-xs-12 col-sm-12 col-xs-12 pull-right btn button3 topMargin outlinebox" type="submit" onClick={this.submitData.bind(this)} >Submit</button>
                    :
                        <button className="col-lg-3 col-md-2 col-xs-12 col-sm-12 col-xs-12 pull-right btn button3 topMargin outlinebox" type="update" onClick={this.update.bind(this)} >Update</button>
                }
                 
              </div>
            </form>
          </div>
        </div>
      </div>

      );
  }

 }

 export default CompanyEmailGateway;