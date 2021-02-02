import React, {Component} from 'react';
import {render}           from 'react-dom';
import $                  from "jquery";
import axios              from 'axios';

import ManageLocations        from './manageLocation/ManageLocations.js';
import Brands                from './Brands/Brands.js';
import RecorderType           from './RecorderType/RecorderType.js';
import MaxChannels            from './MaxChannels/MaxChannels.js';
import CameraType             from './CameraType/CameraType.js';
import CameraResolution       from './CameraResolution/CameraResolution.js';
import CameraModel           from './CameraModel/CameraModel.js';
import TaskTypes              from './TaskTypes/TaskTypes.js';
import DocumentRequiredfor    from  './DocumentRequiredfor/DocumentListMaster.js';
import Reimbursement           from  './Reimbursement/ReimbursementList.js';
import '../../coreadmin/companysetting/css/CompanySetting.css';

 class MasterData extends Component{
    constructor(props) {
		super(props)

		this.state = {
			companyinformation				: "Company Information",
      // profileCreated            : false,
      editType                  : "",
      editId                    : "",
      oneFieldEditId            : ""
		}
	
	}
    componentDidMount() {
    if(this.props.match){
      if(this.props.match.params.editId && this.props.match.params.editId !== 'undefined'){
        this.setState({editId : this.props.match.params.editId},
                      ()=>{
                        console.log("project componentDidMount editId = ",this.state.editId);
                      });
      }

      if(this.props.match.params.oneFieldEditId && typeof this.props.match.params.oneFieldEditId !== 'undefined'){
        this.setState({oneFieldEditId : this.props.match.params.oneFieldEditId},
                      ()=>{
                        console.log("project componentDidMount oneFieldEditId = ",this.state.oneFieldEditId);
                      });

      }
    }


  }
 
   componentDidUpdate(prevProps) {
    if(this.props.match.params.editId !== this.state.editId){
      this.setState({editId : this.props.match.params.editId},
                    ()=>{
                      //console.log("global componentDidUpdate editId = ",this.state.editId);
                    });
    }
    if(this.props.match.params.oneFieldEditId !== this.state.oneFieldEditId){
      this.setState({oneFieldEditId : this.props.match.params.oneFieldEditId},
                    ()=>{
                      // console.log("project componentDidUpdate oneFieldEditId = ",this.state.oneFieldEditId);
                    });
    }
  }

  tab(event){
     $("html,body").scrollTop(0);
      this.setState({
        editId:"",
        oneFieldEditId:""
      })
    this.props.history.push('/project-master-data');
  } 

  render() {
    console.log("editId",this.state.editId);
    console.log("oneFieldEditId",this.state.oneFieldEditId);
    return (
      <div className="container-fluid">
        <div className="row">
          <div className="formWrapper">
            <section className="content">
              <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 pageContent ">
                <div className="row">
                  <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 titleaddcontact NOpadding">
                    <div className="box-header with-border col-lg-12 col-md-12 col-xs-12 col-sm-12 NOpadding-right ">
                        <h4 className="weighttitle col-lg-11 col-md-11 col-xs-11 col-sm-11 NOpadding-right">Master Data</h4>
                    </div>
                  </div>     
                  <div className="boxMinHeight boxMinHeighttab addMarginTop">
                      <div className="col-lg-3 col-md-3 col-xs-12 col-sm-12 noPadding"> 
                          <ul className="nav nav-tabs tabs-left sideways">
                            <li className=" col-lg-12 col-md-12 col-xs-12 col-sm-12 active "><a className="tabLeft lettersp tablefthr" href="#Brands" data-toggle="tab" onClick={this.tab.bind(this)}>  Industry </a></li>
                            <li className=" col-lg-12 col-md-12 col-xs-12 col-sm-12"><a className="tabLeft lettersp tablefthr" href="#RecorderType" data-toggle="tab" onClick={this.tab.bind(this)}>  Division </a></li>
                            <li className=" col-lg-12 col-md-12 col-xs-12 col-sm-12"><a className="tabLeft lettersp tablefthr" href="#MaxChannels" data-toggle="tab" onClick={this.tab.bind(this)}>  Process </a></li>
                            <li className=" col-lg-12 col-md-12 col-xs-12 col-sm-12"><a className="tabLeft lettersp tablefthr" href="#CameraType" data-toggle="tab" onClick={this.tab.bind(this)}>  Equipment Specifications </a></li>
                            <li className=" col-lg-12 col-md-12 col-xs-12 col-sm-12"><a className="tabLeft lettersp tablefthr" href="#CameraModel" data-toggle="tab" onClick={this.tab.bind(this)}>  Equipment Model </a></li>
                            <li className=" col-lg-12 col-md-12 col-xs-12 col-sm-12"><a className="tabLeft lettersp tablefthr" href="#CameraResolution" data-toggle="tab" onClick={this.tab.bind(this)}>  Actual Performance </a></li>
                            <li className=" col-lg-12 col-md-12 col-xs-12 col-sm-12"><a className="tabLeft lettersp tablefthr" href="#TaskTypes" data-toggle="tab" onClick={this.tab.bind(this)}>  Type of Issue </a></li>
                            {/*<li className="col-lg-12 col-md-12 col-xs-12 col-sm-12"><a className="tabLeft lettersp tablefthr" href="#DocumentList" data-toggle="tab" onClick={this.tab.bind(this)}> Document List Master  </a></li>*/}
                            {/* <li className="col-lg-12 col-md-12 col-xs-12 col-sm-12"><a className="tabLeft lettersp tablefthr" href="#Reimbursement" data-toggle="tab" onClick={this.tab.bind(this)}> Fuel Reimbursement  </a></li> */}
                          </ul>   
                      </div>
                      <div className="tab-content col-lg-9 col-md-9 col-xs-12 col-sm-12">   
                        <div className="tab-pane active " id="Brands">    <Brands               editId={this.state.editId} editUrl='/project-master-data'/>  </div>                              
                        <div className="tab-pane " id="RecorderType">     <RecorderType         editId={this.state.editId} editUrl='/project-master-data'/>  </div>                              
                        <div className="tab-pane " id="MaxChannels">      <MaxChannels          editId={this.state.editId} editUrl='/project-master-data'/>  </div>                              
                        <div className="tab-pane " id="CameraType">       <CameraType           editId={this.state.editId} editUrl='/project-master-data'/>  </div>                              
                        <div className="tab-pane " id="CameraModel">       <CameraModel           editId={this.state.editId} editUrl='/project-master-data'/>  </div>                              
                        <div className="tab-pane " id="CameraResolution"> <CameraResolution     editId={this.state.editId} editUrl='/project-master-data'/>  </div>                              
                        <div className="tab-pane " id="TaskTypes">        <TaskTypes            editId={this.state.editId} editUrl='/project-master-data'/>  </div>                              
                        <div className="tab-pane" id="DocumentList">      
                          <DocumentRequiredfor  
                            editId={this.state.editId} 
                            oneFieldEditId={this.state.oneFieldEditId}
                            history={this.props.history}
                          />  
                        </div> 
                       {/*  <div className="tab-pane " id="Reimbursement">   
                          <Reimbursement
                            editId={this.state.editId} 
                            editUrl='/project-master-data'
                            oneFieldEditId={this.state.oneFieldEditId}
                            history={this.props.history}
                          /> 
                        </div> */}                              
                      </div> 
                    </div>
                  </div>
                </div>
            </section>
          </div>
        </div>
      </div>
    );
  }
}
export default MasterData;