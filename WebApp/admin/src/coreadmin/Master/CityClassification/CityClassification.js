import React, { Component }     from 'react';
import $                        from 'jquery';
import jQuery                   from 'jquery';
import axios                    from 'axios';
import swal                     from 'sweetalert';
import TwoFieldForm             from '../TwoFieldForm/TwoFieldForm.js';

import _ from 'underscore';
import 'bootstrap/js/tab.js';
import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng
} from "react-places-autocomplete";
class CityClassification extends Component {
    constructor(props) {
        super(props);
        this.state = {
            oneFields : {
                placeholder : "Add Your City Type & press 'Enter' Key",
                title       : "City Type",
                attributeName : "cityType"
            },
            "oneTableHeading": {
                cityType: "City Type",
                actions: 'Action',
            },
            "oneTableObjects": {
                deleteMethod: 'delete',
                apiLink: '/api/citytypemaster/',
                paginationApply: false,
                searchApply: false,
                editUrl       : '/project-master-data/oneField',
                editUrl1      : '/project-master-data'

            },

            "fields" : {
                placeholder          : "Enter city name..",
                title                : "City Name",
                secondtitle          : "City Type",
                attributeName        : "cityName",
                secondAttributeId    : "cityTypeId",
                secondAttributeName  : "cityType"
            },
            "tableHeading": {
                cityType    : "City Type",
                cityName    : "City Name",
                actions     : 'Action',
            },
            "tableObjects": {
                deleteMethod: 'delete',
                apiLink  :'/api/citynamemaster/',
                apiLink2 :'/api/citytypemaster/',
                paginationApply: false,
                searchApply: false,
                editUrl         : '/project-master-data'
            },
            "startRange": 0,
            "limitRange": 10,
            "editId"            : '',
            "oneeditId"         : '',

        };
    }
    getOneFieldFileDetails(fileName){
         axios
          .get(this.state.oneFieldfileDetailUrl+fileName)
          .then((response)=> {
          $('.fullpageloader').hide();  
          if (response) {
            this.setState({
                oneFieldfileDetails         : response.data,
                oneFieldfailedRecordsCount  : response.data.failedRecords.length,
                oneFieldgoodDataCount       : response.data.goodrecords.length
            });

              var tableData = response.data.goodrecords.map((a, i)=>{
                return{
                    
                    "brand"   : a.brand          ? a.brand         : '-',
                }
              })

              var oneFieldfailedRecordsTable = response.data.failedRecords.map((a, i)=>{
              return{
                    
                    "brand"         : a.brand          ? a.brand         : '-',
                    "failedRemark"  : a.failedRemark     ? a.failedRemark : '-' 
              }
              })
              
            this.setState({
                oneFieldgoodRecordsTable    : tableData,
                oneFieldfailedRecordsTable  : oneFieldfailedRecordsTable
            })
          }
          })
          .catch((error)=> { 
            console.log('error', error);
          }) 
    }
    getTwoFieldFileDetails(fileName){
        axios
        .get(this.state.fileDetailUrl+fileName)
        .then((response)=> {
            console.log('response====',response);
            $('.fullpageloader').hide();  
            if (response) {
                this.setState({
                    fileDetails         : response.data,
                    failedRecordsCount  : response.data.failedRecords.length,
                    goodDataCount       : response.data.goodrecords.length
                });
                var tableData = response.data.goodrecords.map((a, i)=>{
                    console.log('a',a);
                    return{
                        "brandName"    : a.brandName          ? a.brandName         : '-',
                        "model"        : a.model            ? a.model           : '-',
                    }
                })
                var failedRecordsTable = response.data.failedRecords.map((a, i)=>{
                    console.log('a failedRecordsTable',a);
                    return{
                        "brand"         : a.brand          ? a.brand         : '-',
                        "model"         : a.model            ? a.model           : '-',
                        "failedRemark"  : a.failedRemark     ? a.failedRemark    : '-' 
                    }
                })
                this.setState({
                    goodRecordsTable    : tableData,
                    failedRecordsTable  : failedRecordsTable
                },()=>{
                    console.log('goodRecordsTable',this.state.goodRecordsTable);
                    console.log('failedRecordsTable',this.state.failedRecordsTable);
                })
            }
        })
        .catch((error)=> { 
            console.log('error', error);
        }) 
    }

    render() {
        return (
            <div className="container-fluid">
                <section className="col-lg-12 col-md-12 col-xs-12 col-sm-12 companyDisplayForm">
                    <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 pageContent ">
                       <TwoFieldForm   fields={this.state.fields}
                                        tableHeading={this.state.tableHeading}
                                        tableObjects={this.state.tableObjects}
                                        editId ={this.props.editId}                                                       
                                        oneFields={this.state.oneFields}
                                        oneTableHeading={this.state.oneTableHeading}
                                        oneTableObjects={this.state.oneTableObjects}
                                        oneeditId ={this.props.oneFieldEditId}
                                        history={this.props.history}   
                                        
                                        bulkRequired={true}
                                        onefieldurl="/api/brandmaster/bulkUploadbrand" 
                                        onefieldfileurl="https://fivebees.s3.ap-south-1.amazonaws.com/prod/master/VehicleBrand.xlsx"
                                        getOneFieldFileDetails={this.getOneFieldFileDetails.bind(this)}
                                        oneFieldgoodRecordsHeading ={this.state.oneFieldgoodRecordsHeading}
                                        oneFieldfailedtableHeading={this.state.oneFieldfailedtableHeading}
                                        oneFieldfileDetails={this.state.oneFieldfileDetails}

                                        oneFielduploadedData={this.oneFielduploadedData} 
                                        oneFieldfailedRecordsTable ={this.state.oneFieldfailedRecordsTable}
                                        oneFieldfailedRecordsCount={this.state.oneFieldfailedRecordsCount}
                                        oneFieldgoodRecordsTable={this.state.oneFieldgoodRecordsTable}
                                        oneFieldgoodDataCount={this.state.oneFieldgoodDataCount}

                                        twofieldBulkRequired={true}
                                        url="/api/modelmaster/bulkUploadModel" 
                                        twofieldfileurl="https://fivebees.s3.ap-south-1.amazonaws.com/prod/master/VehicleModel.xlsx"
                                        getTwoFieldFileDetails={this.getTwoFieldFileDetails.bind(this)}
                                        goodRecordsHeading ={this.state.goodRecordsHeading}
                                        failedtableHeading={this.state.failedtableHeading}
                                        fileDetails={this.state.fileDetails}
                                        
                                        data={{"createdBy" : localStorage.getItem("user_ID") }} 
                                        uploadedData={this.uploadedData} 

                                        failedRecordsTable ={this.state.failedRecordsTable}
                                        failedRecordsCount={this.state.failedRecordsCount}
                                        goodRecordsTable={this.state.goodRecordsTable}
                                        goodDataCount={this.state.goodDataCount}
                                        masterFieldForm = {true}
                        />
                    </div>
                </section>
            </div>

            /*<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                <TwoFieldForm fields={this.state.fields}
                          tableHeading={this.state.tableHeading}
                          tableObjects={this.state.tableObjects}
                          editId ={this.props.match.params.fieldID}
                          history={this.props.history} />

            </div>*/
        );
    }
}
export default CityClassification;

