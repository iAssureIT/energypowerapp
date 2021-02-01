import React, { Component } from 'react';
import $ from 'jquery';
import jQuery from 'jquery';
import axios from 'axios';
import swal from 'sweetalert';
import _ from 'underscore';
import moment from 'moment';
import "@syncfusion/ej2-base/styles/material.css";
import "@syncfusion/ej2-buttons/styles/material.css";
import "@syncfusion/ej2-inputs/styles/material.css";
import "@syncfusion/ej2-react-dropdowns/styles/material.css";
import { CheckBoxSelection, Inject, MultiSelectComponent }  from '@syncfusion/ej2-react-dropdowns';
import "./AccessManagement.css";
import UMaddRoles from '../userManagement/Roles/UMaddRoles.jsx';

class AccessManagement extends Component {
    constructor(props) {
        super(props);
        this.state = {
           rolesArray : [],
           allModules : [],
           selectedRoles:[]
        };
    }
    componentDidMount() {
        this.getRoles();
        this.getFacilitiesWithModules();

        axios.get('/api/accessmaster/get')
        .then((response) => {
            this.setState({ accessArray: response.data })
           var selectedRoles = []; 
            for (var i = 0; i < response.data.length; i++) {
                
                if (response.data[i].role !== 'authuser' && response.data[i].role !== 'admin') {
                    selectedRoles.push(response.data[i].role)
                }
                
                for (var k = 0; k < response.data[i].module.length; k++) {
                   this.setState({
                    selectedRoles : selectedRoles,
                    [(response.data[i].module[k].module+response.data[i].role).split(' ').join('_')] : true,
                    [(response.data[i].module[k].facility+response.data[i].role).split(' ').join('_')] : true
                   })
                }
                
              //this.setState({[response.data[i].getAttribute("data-facilityroleref")] : true})
            }
            this.dropDownListObject.value = selectedRoles
        })
        .catch((error) => {
            console.log('error', error);
        })
    }
    getRoles(){
        axios.get('/api/roles/get/list')
        .then((response) => {

            var rolesArray = [];
            response.data.map((data, ind) => {
                if (data.role !== "admin") {
                    rolesArray.push({ id: data._id, role: data.role })    
                }
                $("#addRoleModal").hide();
                $(".modal-backdrop").remove();
            });

            this.setState({ rolesArray: rolesArray })

        })
        .catch((error) => {
            console.log('error', error);
        })
    }
    getFacilitiesWithModules(){
        
        axios.get('/api/modulemaster/get/groupbylist')
        .then((response) => {
            this.setState({ allModules: response.data })
        })
        .catch((error) => {
            console.log('error', error);
        })    
    }

    handleChangeRoles(event){
        this.setState({
            selectedRoles : event.value
        })
    }
    selectFacility(event){
        
        var moduleroleref = event.target.getAttribute("data-moduleroleref");
        var facilityroleref = event.target.getAttribute("data-facilityroleref");
        
        if (event.target.getAttribute("data-role") === "authuser") {
            event.target.checked ? this.setState({[(event.target.value+"admin").split(' ').join('_')]:true}) 
            : this.setState({[(event.target.value+"admin").split(' ').join('_')]:false})
            for(var key in this.state.selectedRoles){
                event.target.checked ? this.setState({[(event.target.value+this.state.selectedRoles[key]).split(' ').join('_')]:true}) 
                : this.setState({[(event.target.value+this.state.selectedRoles[key]).split(' ').join('_')]:false})
            }
        }    
        event.target.checked ? this.setState({[facilityroleref]:true,[moduleroleref]:true }) : this.setState({[facilityroleref]:false,[moduleroleref]:true})
    }
    onModuleChange(event){
        if (event.target.getAttribute("data-role") === "authuser") {
            event.target.checked ? this.setState({[(event.target.value+"admin").split(' ').join('_')]:true}) 
            : this.setState({[(event.target.value+"admin").split(' ').join('_')]:false})
        
            for(var key in this.state.selectedRoles){
                event.target.checked ? this.setState({[(event.target.value+this.state.selectedRoles[key]).split(' ').join('_')]:true}) 
                : this.setState({[(event.target.value+this.state.selectedRoles[key]).split(' ').join('_')]:false})
            }
        }
        var moduleroleref = event.target.getAttribute("data-moduleroleref");
        
        event.target.checked ? this.setState({[moduleroleref]:true}) : this.setState({[moduleroleref]:false})
        
        var FacilityObject = document.querySelectorAll("#"+moduleroleref)
        if (event.target.checked) {
            for (var i = 0; i < FacilityObject.length; i++) {
              this.setState({[FacilityObject[i].getAttribute("data-facilityroleref")] : true})
            }
        }else{
            for (var i = 0; i < FacilityObject.length; i++) {
              this.setState({[FacilityObject[i].getAttribute("data-facilityroleref")] : false})
            }
        }
        
    }
    submitData(event){
        event.preventDefault();
        // access : {
        //     role:
        //     modules: [{m1,sm1},{m1,sm2}]
        // }
        var checkedElem = $("input[type='checkbox']:checked");

        var selectedRoles = [];
        var access = [];

        for (var i = 0; i < checkedElem.length; i++) {
            selectedRoles.push(checkedElem[i].getAttribute('data-role'));
        }

        selectedRoles = _.uniq(selectedRoles)
        //console.log('selectedRoles',selectedRoles)

        for (var i = 0; i < selectedRoles.length; i++) {
            var modulesArray = [];
            var roleWiseModule = $('[data-role="' + selectedRoles[i] + '"]:checked') ;
            
            for (var j = 0; j < roleWiseModule.length; j++) {
               console.log('roleWiseModule',roleWiseModule[j] )
               //console.log('roleWiseModule',roleWiseModule[j].getAttribute('name') )
               
               if (roleWiseModule[j].getAttribute('name') === 'facility' ) {
                    modulesArray.push({module : roleWiseModule[j].getAttribute('data-module'), facility : roleWiseModule[j].value})
               }else if(roleWiseModule[j].getAttribute('name') === 'module'){
                    modulesArray.push({module : roleWiseModule[j].value })
               }
            }
            access.push({role:selectedRoles[i], module:modulesArray})
            //console.log('modulesArray',modulesArray)
        }

        access["createdBy"] = localStorage.getItem("user_ID");

        console.log('access',access)


        axios.post('/api/accessmaster/post', access)
            .then((response)=>{
                swal("Access for roles are defined");
            })
            .catch((error)=>{

            })
    }
    render() {
        console.log(this.state)
        const rolesfields: object = { text: 'role', value: 'role' };
        return (
            <div className="">
                <div className="row">
                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                    <section className="content">
                        <div className="pageContent col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding">
                            <div className="box-header with-border col-lg-12 col-md-12 col-xs-12 col-sm-12 NOpadding-right">
                                <h4 className="weighttitle col-lg-11 col-md-11 col-xs-11 col-sm-11 NOpadding-right">Access Management</h4>
                            </div>
                            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                            <br/>
                            <form id="ContractManagement">
                                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopadding">
                                    <div className="col-lg-2 col-md-12 col-xs-12 col-sm-12">
                                        <a className="col-lg-12 col-md-2 col-sm-12 col-xs-12 btn button3" id="addRole" data-toggle="modal"  data-target="#addRoleModal" >
                                           Create Role
                                        </a>
                                    </div>
                                    <div className="col-lg-2 col-md-12 col-xs-12 col-sm-12 ">    
                                        <a className="col-lg-12 col-md-2 col-sm-12 col-xs-12 btn button3" id="addRole" href="/umlistofusers" >
                                           Create User
                                        </a>
                                    </div>
                                </div>
                                <div className="col-lg-3 col-md-12 col-xs-12 col-sm-12">
                                    <label className="col-lg-12 col-md-12 col-xs-12 col-sm-12 NOpadding-left">Roles</label>
                                    <MultiSelectComponent id="categoryChange" ref={(scope) => { this.dropDownListObject = scope; }} 
                                        dataSource={this.state.rolesArray} 
                                        change={this.handleChangeRoles.bind(this)} mode='box' 
                                        fields={rolesfields} placeholder="Select Roles" mode="CheckBox" 
                                        selectAllText="Select All" unSelectAllText="Unselect All" 
                                        showSelectAll={true}   hideSelectedItem={false} >
                                        <Inject services={[CheckBoxSelection]} />
                                    </MultiSelectComponent>
                                </div>
                                
                                <br/>
                                <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12">
                                <br/>
                                <table className="table textAlignLeft AccessManagementTable">
                                <col width="60" />
                                    <thead>
                                        <tr>
                                            <th>Sr.No.</th>
                                            <th>List of Modules & Facilities</th>
                                            <th>Authenticated User</th>
                                            <th>Admin</th>
                                            {
                                                this.state.selectedRoles && this.state.selectedRoles.map((selRole,ind)=>{
                                                    return(<th key={ind}>{selRole}</th>);
                                                })
                                            }
                                        </tr>
                                    </thead>
                                    <tbody>
                                    {
                                        this.state.allModules.map((data,index)=>{
                                            return(
                                                <tr key={index}>
                                                    <td><b>{index+1}</b></td>
                                                    <td>{data.modules[0].moduleName}
                                                    {   data.modules[0].facility.map((fc, ind)=>{
                                                            return(
                                                                <ul key={ind}>
                                                                    <li>{fc.facility}</li>
                                                                </ul>
                                                                );
                                                        })
                                                    }
                                                        
                                                    </td>
                                                    <td>
                                                    <label className="checkboxLabel">
                                                    <input  type="checkbox" 
                                                        value={data.modules[0].moduleName} checked={this.state[(data.modules[0].moduleName+"authuser").split(' ').join('_')]}
                                                        name= "module" data-role="authuser" data-moduleroleref={(data.modules[0].moduleName+"authuser").split(' ').join('_')}
                                                        onChange={this.onModuleChange.bind(this)} />
                                                        <span className="checkmark"></span>
                                                    </label>

                                                    {   data.modules[0].facility.map((fc, ind)=>{
                                                            return(
                                                            <tr key={ind}>
                                                               <label className="checkboxLabel" >
                                                               <input  type="checkbox" id={(data.modules[0].moduleName+"authuser").split(' ').join('_')}
                                                                onChange={this.selectFacility.bind(this)} data-role="authuser" data-module = {data.modules[0].moduleName}
                                                                    value={fc.facility} data-facilityroleref={(fc.facility+"authuser").split(' ').join('_')}
                                                                    data-moduleroleref={(data.modules[0].moduleName+"authuser").split(' ').join('_')}
                                                                    name= "facility" checked={this.state[(fc.facility+"authuser").split(' ').join('_')]}
                                                                    />
                                                                    <span className="checkmark"></span>
                                                                </label>
                                                            </tr>    
                                                                );
                                                        })
                                                    }
                                                    </td>

                                                    <td>
                                                    <label className="checkboxLabel">
                                                    <input  type="checkbox" 
                                                        value={data.modules[0].moduleName} checked={this.state[(data.modules[0].moduleName+"admin").split(' ').join('_')]}
                                                        name= "module" data-role="admin" data-moduleroleref={(data.modules[0].moduleName+"admin").split(' ').join('_')}
                                                        onChange={this.onModuleChange.bind(this)} />
                                                        <span className="checkmark"></span>
                                                    </label>

                                                    {   data.modules[0].facility.map((fc, ind)=>{
                                                            return(
                                                            <tr key={ind}>
                                                               <label className="checkboxLabel">
                                                               <input  type="checkbox" id={(data.modules[0].moduleName+"admin").split(' ').join('_')}
                                                                onChange={this.selectFacility.bind(this)}  data-role="admin" data-module = {data.modules[0].moduleName}
                                                                    value={fc.facility} data-facilityroleref={(fc.facility+"admin").split(' ').join('_')}
                                                                    data-moduleroleref={(data.modules[0].moduleName+"admin").split(' ').join('_')}
                                                                    name= "facility" checked={this.state[(fc.facility+"admin").split(' ').join('_')]}
                                                                    />
                                                                    <span className="checkmark"></span>
                                                                </label>
                                                            </tr>    
                                                                );
                                                        })
                                                    }
                                                    </td>
                                                    {
                                                        this.state.selectedRoles && this.state.selectedRoles.map((selRole,ind)=>{
                                                            return (
                                                            <td key={ind}>
                                                            <label className="checkboxLabel">
                                                            <input  type="checkbox" 
                                                                value={data.modules[0].moduleName} data-role={selRole} checked={this.state[(data.modules[0].moduleName+selRole).split(' ').join('_')]}
                                                                name= "module" data-moduleroleref={(data.modules[0].moduleName+selRole).split(' ').join('_')}
                                                                onChange={this.onModuleChange.bind(this)} />
                                                                <span className="checkmark"></span>
                                                            </label>

                                                            {   data.modules[0].facility.map((fc, ind)=>{
                                                                    return(
                                                                    <tr key={ind}>
                                                                       <label className="checkboxLabel">
                                                                       <input  type="checkbox" id={(data.modules[0].moduleName+selRole).split(' ').join('_')}
                                                                        onChange={this.selectFacility.bind(this)} data-role={selRole} data-module = {data.modules[0].moduleName}
                                                                            value={fc.facility} data-facilityroleref={(fc.facility+selRole).split(' ').join('_')}
                                                                            data-moduleroleref={(data.modules[0].moduleName+selRole).split(' ').join('_')}
                                                                            name= "facility" checked={this.state[(fc.facility+selRole).split(' ').join('_')]}
                                                                             />
                                                                            <span className="checkmark"></span>
                                                                        </label>
                                                                    </tr>    
                                                                        );
                                                                })
                                                            }
                                                            </td>
                                                            )
                                                        })
                                                    }
                                                    
                                                </tr>

                                                );
                                        }) 
                                    }

                                        
                                    </tbody>
                                </table>

                                <div className="col-lg-3 col-md-12 col-xs-12 col-sm-12 pull-right">
                                    <button className="col-lg-8 col-md-2 col-sm-12 col-xs-12 btn button3 pull-right" id="submitbtn" onClick={this.submitData.bind(this)} >
                                        Save
                                    </button>
                                </div>            
                                </div>
                            </form>
                            </div>
                            </div> 

                            <div className="modal" id="addRoleModal" role="dialog">
                              <div className="adminModal adminModal-dialog col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                <div className="modal-content adminModal-content col-lg-4 col-lg-offset-4 col-md-6 col-md-offset-3 col-sm-10 col-sm-offset-1 col-xs-12 noPadding">
                                  <div className="modal-header adminModal-header col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                    <div className="adminCloseCircleDiv pull-right  col-lg-1 col-lg-offset-11 col-md-1 col-md-offset-11 col-sm-1 col-sm-offset-11 col-xs-12 NOpadding-left NOpadding-right">
                                        <button type="button" className="adminCloseButton" data-dismiss="modal" >&times;</button>
                                    </div>
                                  </div>
                                <div className="modal-body adminModal-body col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                    <UMaddRoles getRoles= {this.getRoles.bind(this)}/>
                                </div>
                                <div className="modal-footer adminModal-footer col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                    <div className="col-lg-6 col-md-6 col-sm-6 col-xs-12">
                                        <button type="button" className="btn adminCancel-btn col-lg-7 col-lg-offset-1 col-md-4 col-md-offset-1 col-sm-8 col-sm-offset-1 col-xs-10 col-xs-offset-1" data-dismiss="modal" >CANCEL</button>
                                    </div>
                                </div>
                                </div>
                              </div>
                            </div>
                    </section> 
                    </div>   
                </div>   
             </div>   
            )         
    }
}
export default AccessManagement;    