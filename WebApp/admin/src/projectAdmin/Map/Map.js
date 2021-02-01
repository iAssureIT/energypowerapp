import React, { Component,useState } from 'react';
import { render } from 'react-dom';
import { compose } from "recompose";
import MapContainer from './MapContainer.js';

export default class Map extends Component {
  constructor() {
    super();
    this.state = {
      latLng: ''
    };
  }

  addMarker(e){
    this.setState({
      latLng : {
            lat: e.latLng.lat(),
            lng: e.latLng.lng()
        }        
    })
  }

  render() {
    return (
      <MapContainer addMarker={this.addMarker.bind(this)}/>
    );
  }
}

