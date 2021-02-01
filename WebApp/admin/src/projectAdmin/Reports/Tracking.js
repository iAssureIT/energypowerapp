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

const MapWithAMarker = compose(withGoogleMap)(props => {
  const icon = {
    url:
    props.vehicle==="Car" ? "/images/car.png": "/images/bike_1.png",
      scaledSize: new window.google.maps.Size(40, 30),
      anchor: { x: 20, y: 20 }
  };
  const onClick = props.onClick.bind(this, props.pathCoordinates);
  return (
   <GoogleMap
         defaultZoom={18} defaultCenter={props.pathCoordinates[props.pathCoordinates.length-1]}
        >
        <div>
            {/*for creating path with the updated coordinates*/}
            <Polyline
                path={props.pathCoordinates}
                geodesic={true}
                options={{ strokeColor: "#FF0000 " }}
            />
             <Marker
              icon={icon}
              position={props.pathCoordinates[props.pathCoordinates.length - 1]}
              onClick={onClick}
            >
            {/* {(props.selectedMarker === props.pathCoordinates) && */}
                <InfoWindow >
                  <div style={{"width":"200px"}}>
                      <div>
                        <span><b>Location : {props.address}</b></span>
                      </div>
                      {/* <div>
                        <span><b>Location : {props.address}</b></span>
                      </div> */}  
                    </div> 
                  </InfoWindow>
            {/* }     */}
            </Marker>
         </div>   
        </GoogleMap>
  )
})


export default class Tracking  extends Component {
  constructor(props) {
    super(props)
    this.state = {
      locations: [],
      selectedMarker: false,
      tracking_id : props.match.params ? props.match.params.tracking_id : '',
      bookingNum:"",
      velocity : 400,
      progress: [],
      initialDate : new Date(),
      routeCoordinates:[],
      address:"",
    }
    console.log("props.match.params",props.match.params);
  }

  componentDidMount(){
    this.getData();
    this.getPersonDetails(this.state.tracking_id);
    var that = this;
      setInterval(function(){
        that.getData();
      }, 3000);
  }

  getDistance(){
    // seconds between when the component loaded and now
    const differentInTime = (new Date() - this.state.initialDate) / 1000 // pass to seconds
    return differentInTime * this.state.velocity // d = v*t -- thanks Newton!
  }

  getPersonDetails(){
    axios.get('/api/attendance/get/person_details/'+this.state.tracking_id)
    .then(personDetails=>{
        console.log("personDetails",personDetails);
        this.setState({
          vehicle:personDetails.data.vehicle,
          name:personDetails.data.firstName +" "+personDetails.data.lastName,
        })
    })
    .catch(err=>{
      console.log("err",err);
    })
  }

  getData(){
    axios.get('/api/attendance/get/'+this.state.tracking_id)
    .then(ticket=>{
      console.log("ticket",ticket);
      this.setState({
        totalDistance:ticket.data.totalDistanceTravelled,
        totalTime:parseInt(ticket.data.totalTime)
      })
       const distance = this.getDistance()
        if (! distance) {
          return
        }
        var path = [];
        for (var i = 0; i < ticket.data.routeCoordinates.length; i++) {
          path.push({lat:ticket.data.routeCoordinates[i].latitude,lng:ticket.data.routeCoordinates[i].longitude,distance:ticket.data.routeCoordinates[i].distanceTravelled ? ticket.data.routeCoordinates[i].distanceTravelled : 0})
        }
        let progress = path.filter(coordinates => coordinates.distance < distance)
        const nextLine = path.find(coordinates => coordinates.distance > distance)
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
        const actualAngle = angle - 90
        console.log("actualAngle",actualAngle)

        const markerUrl = this.state.vehicle==="Car" ? "/images/car.png": "/images/bike_1.png";
        const marker = document.querySelector(`[src="${markerUrl}"]`)
        if (marker) { // when it hasn't loaded, it's null
          marker.style.transform = `rotate(${actualAngle}deg)`
        }
        this.setState({routeCoordinates:progress},()=>{this.handleClick(progress)})
    })
    .catch(err=>{
      console.log("err",err);
    })
  }

  msToTime(duration){
    if(duration <= 0){
      return "NA"
    }else{
      var milliseconds = parseInt((duration % 1000) / 100),
      seconds = Math.floor((duration / 1000) % 60),
      minutes = Math.floor((duration / (1000 * 60)) % 60),
      hours = Math.floor((duration / (1000 * 60 * 60)) % 24);
      hours = (hours < 10) ? "0" + hours : hours;
      minutes = (minutes < 10) ? "0" + minutes : minutes;
      seconds = (seconds < 10) ? "0" + seconds : seconds;
      return hours + ":" + minutes;
    }
    
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

  handleClick = (item, event) => {
    console.log("item",item);
    this.setState({ selectedMarker: item })
    this.getAddress(item[item.length-1].lat,item[item.length-1].lng )
  }
  render() {
     const pathCoordinates = [
        { lat: 18.5018, lng: 73.8636 },
        { lat: 36.2169884797185, lng: -112.056727493181 }
    ];
    console.log("this.state.routeCoordinates",this.state.routeCoordinates);
    return (
      <React.Fragment>
      <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOPadding">
        <section className="content">
        <div className="pageContent col-lg-12 col-md-12 col-sm-12 col-xs-12">
          <div className="box-header with-border col-lg-12 col-md-12 col-xs-12 col-sm-12 NOpadding-right">
             <h5 className="weighttitle col-lg-2 col-md-11 col-xs-11 col-sm-11">Tracking Map</h5>
             <h5 className="weighttitle col-lg-3 col-md-11 col-xs-11 col-sm-11">Name : {this.state.name} </h5>
             <h5 className="weighttitle col-lg-4 col-md-11 col-xs-11 col-sm-11">Distance Travelled : {this.state.totalDistance? this.state.totalDistance.toFixed(6)+" Km":"0 Km"} </h5>
             <h5 className="weighttitle col-lg-3 col-md-11 col-xs-11 col-sm-11">Total Hours : {this.state.totalTime? this.msToTime(this.state.totalTime):"0"} </h5>
          </div>
           {this.state.routeCoordinates && this.state.routeCoordinates.length > 0 ?
            <div className="col-lg-12 col-md-12 col-xs-12 col-xs-12 text-center">
              <MapWithAMarker
                selectedMarker={this.state.selectedMarker}
                markers={this.state.locations}
                onClick={this.handleClick}
                googleMapURL="https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places"
                loadingElement={<div style={{ height: `100%` }} />}
                containerElement={<div style={{ height: `650px` }} />}
                mapElement={<div style={{ height: `100%` }} />}
                pathCoordinates={this.state.routeCoordinates}
                vehicle={this.state.vehicle}
                fullName = {this.state.name}
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