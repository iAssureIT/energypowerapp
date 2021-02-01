import React, { Component } from "react"
import { compose } from "recompose"
import {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker,
  InfoWindow,
  Polyline
} from "react-google-maps";
import axios from 'axios';
import MapContainer from './Map.js'

export default class Tracking  extends Component {
  constructor(props) {
    super(props)
    this.state = {
      locations: [],
      selectedMarker: false,
      tracking_id : props.match.params ? props.match.params.tracking_id : '',
    }
  }
  componentDidMount(){
    axios.get('/api/attendance/get/all')
    .then(response=>{
      console.log("response",response);
      var routeCoordinates =response.data[0].routeCoordinates.map(a=>{return{lat:a.latitude,lng:a.longitude}})
      this.setState({routeCoordinates:routeCoordinates})
    })
    .catch(err=>{
      console.log("err",err);
    })
  }


  render() {
    return (
      <React.Fragment>
      <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOPadding">
        <section className="content">
        <div className="pageContent col-lg-12 col-md-12 col-sm-12 col-xs-12">
          <div className="box-header with-border col-lg-12 col-md-12 col-xs-12 col-sm-12 NOpadding-right">
             <h4 className="weighttitle col-lg-4 col-md-11 col-xs-11 col-sm-11">Tracking Map</h4>
          </div>
           {this.state.routeCoordinates ?
            <div className="col-lg-12 col-md-12 col-xs-12 col-xs-12 text-center">
                <MapContainer path={this.state.routeCoordinates} />
            </div> 
            :
            null
          }
          </div>
         </section>
         </div>  
      </React.Fragment>  
    )
  }
}