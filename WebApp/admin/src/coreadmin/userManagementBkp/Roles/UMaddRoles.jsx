import React, { Component } from 'react';
import { render } from 'react-dom';
import swal                       from 'sweetalert';
import axios from 'axios';
import $                    from 'jquery';
import jQuery               from 'jquery';
export default class UMaddRoles extends Component {

    createRole(event){
      event.preventDefault();
      const formValues = {
        "fieldValue"     : this.refs.role.value,
        }
       if ($('#addroles').valid()) {
      axios.post('/api/roles/post', formValues)
        .then( (res)=>{
          console.log('res',res);
            swal("success", "Role added successfully" );
            this.refs.role.value = '';    
            this.props.getRoles()    
        })
        .catch((error)=>{
        });
       } 
    }
    componentDidMount(){
       jQuery.validator.setDefaults({
          debug: true,
          success: "valid"
        });
        $("#addroles").validate({
          rules: {
            roleName: {
              required: true
            },
          },
          errorPlacement: function (error, element) {
            if (element.attr("name") == "roleName") {
              error.insertAfter("#roleName");
            }
          }
        });
    }

	render(){
       return(
       	<div>
					<form id="addroles" className="paddingLeftz noLRPad " onSubmit={this.createRole.bind(this)} >
						<div className="form-group col-lg-6 col-lg-offset-3 col-md-6 col-lg-offset-3 col-xs-12 col-sm-8">
							<label className="labelform">Enter Role </label><span className="astrick">*</span>
							<span className="blocking-span leftmar">
								<input type="text" id= "" className="rolesField form-control UMname inputText tmsUserAccForm" ref="role"  name="roleName" id="roleName" required />
							</span>
						</div>
					
					</form>
				</div>
	   );
	} 
}