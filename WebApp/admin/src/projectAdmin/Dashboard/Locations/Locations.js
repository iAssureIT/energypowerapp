import React,{Component} from 'react';
import { render } from 'react-dom';
import {Bar} from 'react-chartjs-2';
import { compose } from "recompose"
import {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker,
  InfoWindow
} from "react-google-maps";
import axios from 'axios';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'font-awesome/css/font-awesome.min.css';

import '../dashboard.css';
import LocationMap from '../../LocationMap/LocationMap.js';
const formValues = {
  locationType : 'All',
  client_id    : 'All',
  department   : 'All',
  project      : 'All'
}

const MapWithAMarker = compose(withGoogleMap)(props => {
   var bounds = new window.google.maps.LatLngBounds();
   var coords = props.markers.map(a=>{return({lat:a.address.latitude,lng:a.address.longitude})})
    for (var i = 0; i < coords.length; i++) {
        if(coords[i].lat!==null){
          bounds.extend(coords[i]);
        }
    }
 
    console.log("bounds",bounds);
    // console.log("fitBounds",fitBounds);
    if(i >= props.markers.length){
      return (
        <GoogleMap zoom={10} center={bounds.getCenter()}>
          { props.markers.map(marker => {
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
                    <React.Fragment>
                      <div>
                        <b>{marker.locationName}</b>
                      </div>
                      <div>
                        <b>Latitude : </b>{marker.address.latitude}
                      </div>
                      <div>
                        <b>Longitude : </b>{marker.address.longitude}
                      </div>
                    </React.Fragment>  
                  </InfoWindow>
                }
              </Marker>
            )
          })}
        </GoogleMap>
      )
    }  
})
export default class Location extends Component{
  
  constructor(props) {
   super(props);
    this.state = {
      locations: [],
      selectedMarker: false,
      show:false,
      department:[],
      title:props.title,
    }
  }
   
  componentDidMount(){
    if(this.props.display){
      this.getLocations()
    }
  }

  componentWillMount(){
    if(this.props.display){
      this.getLocations()
    }
  }

  componentWillReceiveProps(nextProps){
    if(nextProps.display){
      this.getLocations()
    }
  }

  getLocations(){
    axios.post("api/recordinglocation/get/list/address/",formValues)
    .then(loc => {
      console.log("loc",loc);
        var locations = loc.data;
        this.setState({locations})
    })  
    .catch(err=>{
      console.log("err",err);
    })
  } 

  handleClick = (marker, event) => {
    this.setState({ selectedMarker: marker })
  }
    
  render(){
    
    return(
      <div>
      {this.props.display ?
        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
          <div className={"box "+this.state.boxColor}>
            {/* <div className="box-header with-border">
              <h3 className="box-title">{this.state.title}</h3>
            </div>
            <div className="box-body no-padding">
              <MapWithAMarker
                selectedMarker={this.state.selectedMarker}
                markers={this.state.locations}
                onClick={this.handleClick}
                googleMapURL="https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places"
                loadingElement={<div style={{ height: `100%` }} />}
                containerElement={<div style={{ height: `600px` }} />}
                mapElement={<div style={{ height: `100%` }} />}
                show={this.state.show}
              />
            </div> */}
            <div className="box-body no-padding">
             <LocationMap />
            </div> 
          </div>
        </div> 
       :
        null
      }
      </div>
        );
     
  }
}
