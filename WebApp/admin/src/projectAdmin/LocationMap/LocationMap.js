import React, { Component } from "react"
import { compose } from "recompose"
import {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker,
  InfoWindow
} from "react-google-maps";
import axios from 'axios';
import $ from 'jquery';
import jQuery from 'jquery';
import ReactHTMLTableToExcel from 'react-html-table-to-excel';
import ReactToPdf             from 'react-to-pdf';
import jsPDF                 from 'jspdf';
import html2canvas from 'html2canvas';
import LocationMapView from './LocationMapView.js'
import './LocationMap.css';
var _ = require('lodash');

const formValues = {
  locationType : 'Recording',
  client_id    : 'All',
  department   : 'All',
  project      : 'All'
}
const MapWithAMarker = compose(withGoogleMap)(props => {

  return (
    <GoogleMap defaultZoom={12} defaultCenter={{ lat: 18.5204, lng: 73.8567 }}>
      {props.markers.map(marker => {
        const onClick = props.onClick.bind(this, marker);
        console.log("marker",marker);
        return (
          <Marker
            key={marker.id}
            onClick={onClick}
            position={{ lat: marker.address.latitude, lng: marker.address.longitude }}
            icon ={
              marker.address.locationType === "Recording" ?
                {url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png"}
                :
                {url: "http://maps.google.com/mapfiles/ms/icons/red-dot.png"}
              }
          >
            {(props.selectedMarker === marker || props.show) &&
               <InfoWindow>
                <div> 
                  <div>
                    <b>{marker.locationName}</b>
                  </div>
                  <div>
                    <b>Latitude : </b>{marker.address.latitude}
                  </div>
                  <div>
                    <b>Longitude : </b>{marker.address.longitude}
                  </div>
                </div>  
              </InfoWindow>
            }
          </Marker>
        )
      })}
    </GoogleMap>
  )
})

export default class ShelterMap extends Component {
  constructor(props) {
    super(props)
    this.state = {
      locations: [],
      selectedMarker: false,
      show:false,
      department:[],
      locationType:"Recording",
      clientName:"All",
      department:"All",
      project:"All",
      show_view:false,
      recordingCount:0,
      cameraCount:0,
      totalCount:0,
      departmentArray:[],
      projectArray:[],
      clientArray:[]
    }
  }
  componentDidMount(){
    this.getLocations();
    this.getRecLocClient();
    this.getRecordingLocCount();
    this.getCameraLocCount();
    this.getGoogleAPIKey();
  }


  getGoogleAPIKey(){
    axios.get("/api/projectSettings/get/GOOGLE",)
    .then((response) => {
      console.log("response.data.googleapikey",response.data.googleapikey);
        this.setState({
            googleAPIKey : response.data.googleapikey
        });
    })
    .catch((error) =>{
        console.log(error)
    })
  }

  getRecLocClient(){
      axios.get("/api/recordinglocation/get/list")
      .then(res => {
        console.log("res",res);
          var resArr = [];
          res.data.filter(function(item){
            var i = resArr.findIndex(x => x.clientName === item.clientName);
            if(i <= -1){
              resArr.push({client_id: item.client_id, clientName: item.clientName});
            }
            return null;
          });
          this.setState({
            clientArray:resArr,
            clientList:res.data
          })
      })  
      .catch(err=>{
        console.log("err",err);
      })
  }

  getDepartment(client_id){
    var departmentArray = this.state.clientList.filter(a=>a.client_id === client_id)
    var resArr = [];
    departmentArray.filter(function(item){
      var i = resArr.findIndex(x => x.department === item.department);
      if(i <= -1){
        resArr.push({department: item.department});
      }
      return null;
    });
    this.setState({departmentArray:resArr})
  }

  getProject(department){
    console.log("this.state.clientList",this.state.clientList);
    console.log("this.state.clientList",this.state.clientList);
    var projectArray = this.state.clientList.filter(a=>a.department === department)
    console.log("projectArray",projectArray)
    var resArr = [];
    projectArray.filter(function(item){
      var i = resArr.findIndex(x => x.project === item.project);
      if(i <= -1){
        resArr.push({project: item.project});
      }
      return null;
    });
    console.log("resArr",resArr);
    this.setState({projectArray:resArr})
  }

  getRecordingLocCount(){
     axios.get("api/recordinglocation/get/count")
      .then(res => {
          console.log("res1",res);
          this.setState({recordingLocCount:res.data.count})
      })  
      .catch(err=>{
        console.log("err",err);
      })
  }

  getCameraLocCount(){
     axios.get("api/cameralocation/get/count")
      .then(res => {
          console.log("res1",res);
          this.setState({cameraLocCount:res.data.count})
      })  
      .catch(err=>{
        console.log("err",err);
      })
  }


  getLocations(){
    axios.post("api/recordinglocation/get/list/address/",formValues)
      .then(loc => {
        console.log("loc",loc);
          var locations = loc.data;
          var recordingCount = locations.filter(a=>a.address.locationType === "Recording").length;
          var cameraCount = locations.filter(a=>a.address.locationType === "Camera").length;
          console.log("recordingCount",recordingCount,"cameraCount",cameraCount)
          this.setState({
            locations,
            recordingCount,
            cameraCount,
            totalCount:recordingCount+cameraCount
          })
      })  
      .catch(err=>{
        console.log("err",err);
      })
  }
  
  handleChange(event){
     const target = event.target;
     const name   = target.name;
     console.log("event.target.value",event.target.value);
     this.setState({
      [name]: event.target.value,
     });
     if(name === "locationType"){
      formValues.locationType = event.target.value;
     }else if(name==="client"){
       if(event.target.value!=="All"){
        this.setState({clientName:this.state.clientArray.find(a=>a.client_id === event.target.value).clientName})
      }
      formValues.client_id = event.target.value;
      this.getDepartment(event.target.value)
     }else if(name==="department"){
      formValues.department = event.target.value;
      this.getProject(event.target.value)
     }else if(name==="project"){
      formValues.project = event.target.value;
     }
     this.getLocations();
  }  


  handleClick = (marker, event) => {
    this.setState({ selectedMarker: marker })
  }

  printTable(event) {
		// event.preventDefault();
		$('#ActionContent').hide();
		$('.modal').hide();
		var DocumentContainer = document.getElementById('pdfdiv');
		var WindowObject = window.open('', 'PrintWindow', 'height=500,width=600');
		WindowObject.document.write(DocumentContainer.innerHTML);
		WindowObject.document.close();
		WindowObject.focus();
		WindowObject.print();
		WindowObject.close();
  }
  
  printDocument() {  
    this.setState({show_view:true});
    const input = document.getElementById('pdfdiv');  
    html2canvas(input,{
      useCORS: true,
      allowTaint: true,
      async:false,
    })  
      .then((canvas) => {  
        console.log("canvas",canvas);
        var imgWidth = 200;  
        var pageHeight = 290;  
        var imgHeight = canvas.height * imgWidth / canvas.width;  
        var heightLeft = imgHeight;  
        const imgData = canvas.toDataURL('image/jpg');  
        const pdf = new jsPDF('p', 'mm', 'a4')  
        var position = 0;  
        var heightLeft = imgHeight; 
        console.log("imgData",imgData); 
        pdf.addImage(imgData, 'jpg', 0, position, imgWidth, imgHeight);  
        pdf.save("Location Map.pdf");  
         this.setState({show_view:false});
      });  
  }


  render() {
    console.log("this.state",this.state);
    return (
      <React.Fragment>
      <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOPadding"   >
        <section className="content">
        <div className="pageContent col-lg-12 col-md-12 col-sm-12 col-xs-12">
          <div className="box-header with-border col-lg-12 col-md-12 col-xs-12 col-sm-12 marbtm30"  >
             <h4 className="weighttitle col-lg-3 col-md-2 col-xs-11 col-sm-11 noPadding">Location Map</h4>
              <h5 className="weighttitle col-lg-3 col-md-3 col-xs-11 col-sm-11 noPadding"><img src="http://maps.google.com/mapfiles/ms/icons/blue-dot.png" style={{"height":'20px'}}/>Total Recording Location :&nbsp;&nbsp;<b>{this.state.recordingLocCount}</b></h5>
              <h5 className="weighttitle  col-lg-3 col-md-3 col-xs-11 col-sm-11 noPadding"><img src="http://maps.google.com/mapfiles/ms/icons/red-dot.png" style={{"height":'20px'}}/>Total Camera Location :&nbsp;&nbsp;<b>{this.state.cameraLocCount}</b></h5>
              <div className={this.state.show === false ? "btn btn-primary col-lg-2 col-md-2 col-sm-12 col-xs-12":"btn btn-success col-lg-2 col-md-2 col-sm-12 col-xs-12"} onClick={()=>this.setState({show:!this.state.show})}>
                Show Info Window
              </div>
              <div className="col-lg-1 col-md-1 col-xs-12 col-sm-12 ">
								{/* <button type="button" className="btn mapPrintIcon pull-right" title="Print Table" onClick={this.printTable.bind(this)}><i className="fa fa-print" aria-hidden="true"></i></button> */}
								<button type="button" className="btn pull-right mapPrintIcon"  title="Download as a PDF" onClick={this.printDocument.bind(this)}><i className="fa fa-download" aria-hidden="true"/></button>
							</div>
              
          </div>
          <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 marbtm30 mt20 NOPadding" className="txt">
            <div className="col-lg-3 col-md-3 col-sm-12 col-xs-12">
              <label className="col-lg-12 col-md-12 col-sm-12 col-xs-12 labelform text-left">Locations Type</label>
              <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding">
                <select onChange={this.handleChange.bind(this)} value={this.state.locationType} id="locationType" ref="locationType" name="locationType" className="col-lg-12 col-md-12 col-sm-6 col-xs-12  noPadding form-control">
                  <option value="Not Selected" disabled>Select Location</option>
                  <option value='All'>All</option>
                  <option value='Recording' selected>Recording Location</option>
                  <option value='Camera'>Camera Location</option>
                </select>
              </div>
            </div>
            <div className="col-lg-3 col-md-3 col-sm-12 col-xs-12">
              <label className="col-lg-12 col-md-12 col-sm-12 col-xs-12 labelform text-left">Client</label>
              <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding">
                <select onChange={this.handleChange.bind(this)} value={this.state.status} id="client" ref="client" name="client" className="col-lg-12 col-md-12 col-sm-6 col-xs-12  noPadding form-control">
                  <option value="Not Selected" disabled>Select Client</option>
                  <option value='All'>All</option>
                  {
                        this.state.clientArray && this.state.clientArray.length > 0 ?
                        this.state.clientArray.map((name, index)=>{
                          return(      
                              <option key={index} id={name.client_id} value={name.client_id}>{name.clientName}</option>
                          );
                        }
                      ) : ''
                    }    
                </select>
              </div>
            </div>
             <div className="col-lg-3 col-md-3 col-sm-12 col-xs-12">
              <label className="col-lg-12 col-md-12 col-sm-12 col-xs-12 labelform text-left">Department</label>
              <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding">
                <select onChange={this.handleChange.bind(this)} value={this.state.status} id="department" ref="department" name="department" className="col-lg-12 col-md-12 col-sm-6 col-xs-12  noPadding form-control">
                  <option value="Not Selected" disabled>Select Department</option>
                  <option value='All'>All</option>
                  {
                        this.state.departmentArray && this.state.departmentArray.length > 0 ?
                        this.state.departmentArray.map((loc, index)=>{
                          return(      
                              <option key={index} id={loc.department} value={loc.department}>{loc.department}</option>
                          );
                        }
                      ) : ''
                    }    
                </select>
              </div>
            </div>
            <div className="col-lg-3 col-md-3 col-sm-12 col-xs-12">
              <label className="col-lg-12 col-md-12 col-sm-12 col-xs-12 labelform text-left">Project</label>
              <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding">
                <select onChange={this.handleChange.bind(this)} value={this.state.status} id="project" ref="project" name="project" className="col-lg-12 col-md-12 col-sm-6 col-xs-12  noPadding form-control">
                  <option value="Not Selected" disabled>Select Project</option>
                  <option value='All'>All</option>
                  {
                        this.state.projectArray && this.state.projectArray.length > 0 ?
                        this.state.projectArray.map((loc, index)=>{
                          return(      
                              <option key={index} id={loc.project} value={loc.project}>{loc.project}</option>
                          );
                        }
                      ) : ''
                    }    
                </select>
              </div>
            </div>
          </div>
          <div className="col-lg-12 col-md-8 col-xs-12 col-xs-12 noPadding" id="pdfdiv">
            <div className="col-lg-12 col-md-8 col-xs-12 col-xs-12 mt20 ">
              <div className="col-lg-6 col-md-12 col-xs-12 col-xs-12  tableBorder" >
                <h5 className="col-lg-12"><b>Location Type</b> : {this.state.locationType+" Locations ( "+(this.state.locationType === "Recording" ? this.state.recordingCount : this.state.locationType === "Camera" ? this.state.cameraCount : "Total : "+this.state.totalCount+", Recording : "+this.state.recordingCount+", Camera : "+this.state.cameraCount)+" ) "}</h5>
                <h5 className="col-lg-12"><b>Client</b> : {this.state.clientName+(this.state.clientName==="All" ? " ( "+this.state.clientArray.length+" ) ": "")}</h5>
              </div>
              <div className="col-lg-6 col-md-12 col-xs-12 col-xs-12 tableBorder">  
              <h5 className="col-lg-12"><b>Department</b> : {this.state.department}</h5>
              <h5 className="col-lg-12"><b>Project</b> : {this.state.project}</h5>
              </div>
          </div>
            <div className="col-lg-12 col-md-12 col-xs-12 col-xs-12 mt20">
            {this.state.googleAPIKey ?
              <MapWithAMarker
                selectedMarker={this.state.selectedMarker}
                markers={this.state.locations}
                onClick={this.handleClick}
                googleMapURL="https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places"
                loadingElement={<div style={{ height: `100%` }} />}
                containerElement={<div style={{ height: `650px` }} />}
                mapElement={<div style={{ height: `100%` }} />}
                show={this.state.show}
              />
              :null
            }
            </div>
          </div>

          </div>
          
         </section>
         </div>  
         
      </React.Fragment>  
    )
  }
}