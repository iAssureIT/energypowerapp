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
import Geocode from "react-geocode";
import moment from 'moment';

const MapWithAMarker = compose(withGoogleMap)(props => {
  console.log("props",props);
  var bounds = new window.google.maps.LatLngBounds();
    for (var i = 0; i < props.multiPath.length; i++) {
      for (var j = 0; j < props.multiPath[i].path.length; j++) {
        bounds.extend(props.multiPath[i].path[j]);
      }
    }

    if(i >= props.multiPath.length){
      console.log("center",bounds);
        return (
         <GoogleMap
              zoom={props.zoom}
              center={props.multiPath && props.multiPath.length > 0 ?  bounds.getCenter() : { lat: 18.5204, lng: 73.8567 }}
              options={{
              streetViewControl: true,
            }}
            {...props}
                  // onLoad={map=>map.zoom}
                  // onZoomChanged={props.handleZoomChanged}
              >
              {/*for creating path with the updated coordinates*/}
              {
                props.multiPath.map((item,index)=>{
                const onClick = props.onClick.bind(this, item);
                  return(
                    <div>
                    <Polyline
                        key={index}
                        path={item}
                        geodesic={true}
                        options={{
                            strokeColor: index % 2 === 0 ? "#ff2527" : "#1261A0",
                            strokeOpacity: 0.75,
                            strokeWeight: 3,
                        }}
                    >
                    </Polyline>
                       <Marker 
                          position={item.path[item.path.length-1]} 
                          icon={{
                            url:
                              item.vehicle==="Car" ? "/images/car.png": "/images/bike_1.png",
                              scaledSize: new window.google.maps.Size(40, 40),
                              anchor: { x: 20, y: 20 }
                          }}
                          onClick={onClick}
                       >
                        {(props.selectedMarker === item) &&
                          <InfoWindow >
                            <div style={{"width":"200px"}}>
                              <a href={'/tracking/'+item.tracking_id} target='_blank'> 
                                <div>
                                  <span><b>Technician : {item.fullName}</b></span>
                                </div>
                                <div>
                                  <span><b>Location : {props.address}</b></span>
                                </div>  
                              </a>  
                             </div> 
                            </InfoWindow>
                        }  
                       </Marker>
                    </div>
                  )
                })
              }
              </GoogleMap>
        )
    }
})


export default class Tracking  extends Component {
  constructor(props) {
    super(props)
    this.state = {
      multiPath: [],
      selectedMarker: false,
      tracking_id : props.match.params ? props.match.params.tracking_id : '',
      zoom:8,
      velocity : 100,
      progress: [],
      initialDate : new Date(),
      address:""
    }
  }
  componentDidMount(){
    this.getAll();
    var that = this;
    setInterval(function(){
      that.getAll();
    }, 10000);
  }

  getAll(){
    axios.get('/api/attendance/get/daywise/'+moment().format('YYYY-MM-DD'))
    .then(response=>{
      console.log("response",response);
      var multiPath = [];
      for (var i = 0; i < response.data.length; i++) {
        var path = []
        for (var j = 0; j < response.data[i].routeCoordinates.length; j++) {
          path.push({
            lat:response.data[i].routeCoordinates[j].latitude,
            lng:response.data[i].routeCoordinates[j].longitude,
          })
        }
        path = path.map((coordinates, i, array) => {
          if (i === 0) {
            return { ...coordinates, distance: 0 } // it begins here! 
          }
          const { lat: lat1, lng: lng1 } = coordinates
          const latLong1 = new window.google.maps.LatLng(lat1, lng1)

          const { lat: lat2, lng: lng2 } = array[0]
          const latLong2 = new window.google.maps.LatLng(lat2, lng2)

          // in meters:
          const distance = window.google.maps.geometry.spherical.computeDistanceBetween(
            latLong1,
            latLong2
          )

          return { ...coordinates, distance }
        })
        multiPath.push({
            path,
            vehicle:response.data[i].personDetails.vehicle,
            fullName:response.data[i].personDetails.firstName+" "+response.data[i].personDetails.lastName,
            tracking_id:response.data[i]._id
        });
      }

      if(i >= response.data.length){
        const distance = this.getDistance()
        if (! distance) {
          return
        }
        console.log("multiPath",multiPath);
        let progress = multiPath[0].path.filter(coordinates => coordinates.distance < distance)

        const nextLine = multiPath[0].path.find(coordinates => coordinates.distance > distance)

        let point1, point2

        if (nextLine) {
          point1 = progress[progress.length - 1]
          point2 = nextLine
        } else {
          // it's the end, so use the latest 2
          point1 = progress[progress.length - 2]
          point2 = progress[progress.length - 1]
        }

        const point1LatLng = new window.google.maps.LatLng(point1.lat, point1.lng)
        const point2LatLng = new window.google.maps.LatLng(point2.lat, point2.lng)

        const angle = window.google.maps.geometry.spherical.computeHeading(point1LatLng, point2LatLng)
        const actualAngle = angle

        const markerUrl = "/images/bike_1.png";
        const marker = document.querySelector(`[src="${markerUrl}"]`)
        console.log("marker",marker)
        
        if (marker) { // when it hasn't loaded, it's null
          marker.style.transform = `rotate(${actualAngle}deg)`
        }
        this.setState({multiPath:multiPath})
      }
    })
    .catch(err=>{
      console.log("err",err);
    })
  }


   getAddress = async(lat,lng)=>{
    try {
      console.log("=======>",lat,lng);
      var address = "123";
      var response = await axios.get("/api/projectSettings/get/GOOGLE");
      await Geocode.setApiKey(response.data.googleapikey);
      var result = await Geocode.fromLatLng(lat,lng);
      console.log("address",result.results[0].formatted_address);
      this.setState({address:result.results[0].formatted_address})
    } catch (err) {
      console.log(err);
    }
  }


  getDistance(){
    // seconds between when the component loaded and now
    const differentInTime = (new Date() - this.state.initialDate) / 1000 // pass to seconds
    return differentInTime * this.state.velocity // d = v*t -- thanks Newton!
  }

  handleClick = (item, event) => {
    console.log("item",item);
    this.setState({ selectedMarker: item })
    this.getAddress(item.path[item.path.length-1].lat,item.path[item.path.length-1].lng )
  }

  render() {
    console.log("this.state.routeCoordinates",this.state.multiPath);
    return (
      <React.Fragment>
      <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOPadding">
        <section className="content">
        <div className="pageContent col-lg-12 col-md-12 col-sm-12 col-xs-12">
          <div className="box-header with-border col-lg-12 col-md-12 col-xs-12 col-sm-12 NOpadding-right">
             <h4 className="weighttitle col-lg-4 col-md-11 col-xs-11 col-sm-11">Daily Tracking</h4>
          </div>
           {this.state.multiPath ?
            <div className="col-lg-12 col-md-12 col-xs-12 col-xs-12 text-center">
              <MapWithAMarker
                googleMapURL="https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places"
                loadingElement={<div style={{ height: `100%` }} />}
                containerElement={<div style={{ height: `650px` }} />}
                mapElement={<div style={{ height: `100%` }} />}
                multiPath={this.state.multiPath}
                zoom={this.state.zoom}
                onClick={this.handleClick}
                selectedMarker={this.state.selectedMarker}
                getAddress={this.getAddress}
                address = {this.state.address}
              />
             {/*<h1>Coming Soon</h1>*/}
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