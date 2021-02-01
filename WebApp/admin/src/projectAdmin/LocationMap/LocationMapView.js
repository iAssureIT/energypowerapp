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
var _ = require('lodash');

const MapWithAMarker = compose(withGoogleMap)(props => {

  return (
    <GoogleMap defaultZoom={12} defaultCenter={{ lat: 18.5204, lng: 73.8567 }}>
      {props.markers.map(marker => {
        console.log("marker",marker);
        return (
          <Marker
            key={marker.id}
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

export default class LocationMapView extends Component {
  render() {
    console.log("this.state",this.state);
    return (
      <React.Fragment>
        <div className="col-lg-8 col-md-8 col-xs-12 col-xs-12 mt20 noPadding">
            <div className="col-lg-12 col-md-12 col-xs-12 col-xs-12 noPadding">
            <h5 className="col-lg-6"><b>Client Name</b> : {this.props.clientName}</h5>
            <h5 className="col-lg-6"><b>Location Type</b> : {this.props.locationType}</h5>
            </div>
            <div className="col-lg-12 col-md-12 col-xs-12 col-xs-12 noPadding">  
            <h5 className="col-lg-6"><b>Department</b> : {this.props.department}</h5>
            <h5 className="col-lg-6"><b>Project</b> : {this.props.project}</h5>
            </div>
        </div>
        <div className="col-lg-12 col-md-12 col-xs-12 col-xs-12 mt20">
            {this.props.googleAPIKey ?
                <MapWithAMarker
                selectedMarker={this.props.selectedMarker}
                markers={this.props.locations}
                googleMapURL="https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places"
                loadingElement={<div style={{ height: `100%` }} />}
                containerElement={<div style={{ height: `650px` }} />}
                mapElement={<div style={{ height: `100%` }} />}
                show={this.props.show}
                />
                :null
            }
        </div>  
      </React.Fragment>  
    )
  }
}