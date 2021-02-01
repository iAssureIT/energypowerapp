import React, { Component }     from 'react';
import OneFieldForm             from '../OneFieldForm/OneFieldForm.js';

import 'bootstrap/js/tab.js';
import './LocationType.css'
import axios from 'axios';

class LocationType extends Component {
    constructor(props) {
        super(props);
        this.state = {
            companyInfo              : [],
            profileCreated            : false,
            "locationType": "",
            "fields" : {
                placeholder     : "Add location type & press 'Enter' Key.",
                title           : "Location Type",
                attributeName   : "locationType"
            },
            "tableHeading": {
                locationType: "Location Type",
                actions: 'Action',
            },
            "tableObjects": {
                deleteMethod: 'delete',
                apiLink: '/api/locationtypemaster/',
                paginationApply: false,
                searchApply: false,
                editUrl: this.props.editUrl,
            },
            "startRange": 0,
            "limitRange": 10,
            "editId": '',

        };
    }
    componentDidMount() {
        // console.log("locationtype this.props.editId = ",this.props);
        // var editId = this.props.match 
        //              ? this.props.match.params.editId
        //              : this.props.editId 
        //                   ? this.props.editId 
        //                   : "" ;

        // if(editId && editId !== 'undefined'){
        //   this.setState({
        //       editId: editId
        //   }, ()=>{
        //       // console.log("this.state.editId = ",this.state.editId);
        //   });
        // }
        // window.scrollTo(0, 0);
        // axios.get('/api/companysettings/')
        // .then( (res)=>{   
        //   this.setState({profileCreated:true, companyInfo: res.data}) 
        // })
        // .catch((error)=>{
        // });
    }

    // handler(){
    //   axios.get('/api/companysettings/')
    //   .then( (res)=>{   
    //     this.setState({profileCreated:true, companyInfo: res.data}) 
    //   })
    //   .catch((error)=>{
    //   });
    // }

    //  componentWillReceiveProps(nextProps) {
    //     var editId = nextProps.match.params.fieldID;
    //     if (nextProps.match.params.fieldID) {
    //         this.setState({
    //             editId: editId
    //         })
    //     }
    // }

  // componentDidUpdate(prevProps) {
  //   if(this.props.editId !== this.state.editId){
  //     this.setState({editId : this.props.editId},
  //                   ()=>{
  //                     //console.log("global componentDidUpdate editId = ",this.state.editId);
  //                   });
  //   }
  // }


  render() {
    return (
      <div className="container-fluid">
        <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 companyDisplayForm">
              <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12">
                  <OneFieldForm 
                      fields={this.state.fields}
                      tableHeading={this.state.tableHeading}
                      tableObjects={this.state.tableObjects}
                      editId = {this.props.editId}
                      masterFieldForm = {true}
                      history={this.props.history} 
                  /> 
              </div>
        </div>
      </div>
    );
  }
}
export default LocationType;

