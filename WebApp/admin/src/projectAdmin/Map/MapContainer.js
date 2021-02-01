import React, { Component,useState,useEffect } from 'react';
import { render } from 'react-dom';
import { compose } from "recompose";
import $                    from "jquery";
import {
  withGoogleMap,
  GoogleMap,
  withScriptjs,
  Marker,
  InfoWindow
} from "react-google-maps";
import './style.css';
import axios from 'axios';
import { geolocated } from "react-geolocated";

const MapContainer = compose(withGoogleMap)(props =>  {
  const {latLng}=props;
  const [places,setPlaces] = useState({...props.latLng});
  useEffect(() => {
      setPlaces(props.latLng);
  }, [props.latLng])
  const addMarker=(e)=> {
    const newPlace = {
      id: places.length,
      lat: e.latLng.lat(),
      lng: e.latLng.lng()
    };
    props.addMarker(e)
    setPlaces(newPlace);
  }
  return (
      <GoogleMap
        onClick={addMarker}
        zoom={props.zoom} center={props.center}
      >
        <Marker
          key={places.id}
          position={{ lat: places.lat, lng: places.lng }}
          draggable={true}
          onDragEnd={addMarker}
        >
        {props.address && <InfoWindow  style={{display: "none"}} >
            <div style={{"width":"200px"}}>
              <b>{props.address}</b>
            </div> 
        </InfoWindow>
        }
       </Marker>    
      </GoogleMap>
  )
})



class Map extends Component {
  constructor() {
    super();
    this.state = {
      name: 'React',
      places: []
    };
  }

  componentDidMount(){
    this.getGoogleAPIKey();
    $(".gm-style-iw").next("div").hide();
  }


  getGoogleAPIKey(){
    axios.get("/api/projectSettings/get/GOOGLE",)
    .then((response) => {
        this.setState({
            googleAPIKey : response.data.googleapikey
        });
    })
    .catch((error) =>{
        console.log(error)
    })
  }

  render() {
    return (
      <React.Fragment>
      {this.props.latLng.lat ?
          <MapContainer
            containerElement={<div style={{ height: `400px` }} />}
            loadingElement={<div style={{ height: `100%` }} />}
            mapElement={<div style={{ height: `100%` }} />}
            center={this.props.latLng}
            zoom={18}
            addMarker={this.props.addMarker}
            latLng={this.props.latLng}
            address={this.props.address}
          />
          :
          <MapContainer
            containerElement={<div style={{ height: `400px` }} />}
            loadingElement={<div style={{ height: `100%` }} />}
            mapElement={<div style={{ height: `100%` }} />}
            center={this.props.coords && this.props.coords.longitude ? {lat:this.props.coords.latitude,lng:this.props.coords.longitude} : { lat: 20.5937, lng: 78.9629 }}
            zoom={this.props.coords && this.props.coords.longitude ? 5 : 18}
            addMarker={this.props.addMarker}
            latLng={this.props.latLng}
            address={this.props.address}
          />
       }   
      </React.Fragment> 
    );
  }
}
export default geolocated({
    positionOptions: {
        enableHighAccuracy: false,
    },
    userDecisionTimeout: 5000,
})(Map);
