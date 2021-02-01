import React, { Component } from 'react';
import { render }           from 'react-dom';
import TimePicker           from 'rc-time-picker';
import moment               from 'moment';
import jQuery               from 'jquery';
import $                    from 'jquery';
import OneFieldForm         from '../OneFieldForm/OneFieldForm.js';
import 'rc-time-picker/assets/index.css';
import {connect}            from 'react-redux';
import { bindActionCreators } from 'redux';
import { getRoleWiseAccessToModule, getAccessToFacility } from '../../actions/index';

const format = "h:mm a";
class Module extends Component{
   constructor(props) {
    super(props);
    this.state = {
      "tableHeading": {
          moduleName   : "Module",
          actions  : 'Action',
      },
      "tableObjects": {
          deleteMethod    : 'delete',
          apiLink         : '/api/modulemaster/',
          paginationApply : false,
          searchApply     : false,
          editUrl         : '/module'
      },
      "startRange"    : 0,
      "limitRange"    : 10,
      "fields" : {
        placeholder   : "Add module name  & press 'Enter' Key.",
        title         : "Module",
        attributeName : "moduleName"
      }
    };
  }
  componentDidMount(){
    
 
  }
  async componentDidMount() {
      var editId = this.props.match.params.fieldID;
     
      this.setState({
          editId: editId
      })
      var editId = this.props.match.params.fieldID;

      await this.props.fetchRoleWiseAccess("Module Master")

      await this.props.fetchAccessToFacility("Module Master", "Create Module")

      if (!this.props.rolewiseAccessToModule.access) {
        //this.props.history.push("NotAuthorised")
      }
      console.log(this.props.accessToFacility);
  }
   componentWillReceiveProps(nextProps) {
      var editId = nextProps.match.params.fieldID;
      if (nextProps.match.params.fieldID) {
          this.setState({
              editId: editId
          })
      }
  }
 
  render(){
    return(
          <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopadding">
              <div>
               <OneFieldForm fields={this.state.fields}
                              tableHeading={this.state.tableHeading}
                              tableObjects={this.state.tableObjects}
                              editId ={this.props.match.params.fieldID}
                              history={this.props.history} />
              </div>
          </div>       
    );
  }
 }

 const mapStateToProps = (state)=>{
    return {
        rolewiseAccessToModule  : state.rolewiseAccessToModule,
        accessToFacility        : state.accessToFacility
    }
}
const mapDispachToProps = (dispatch) =>{
    return bindActionCreators({ fetchRoleWiseAccess: getRoleWiseAccessToModule, fetchAccessToFacility: getAccessToFacility }, dispatch);  
}  
export default connect(mapStateToProps, mapDispachToProps) (Module);