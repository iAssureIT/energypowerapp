import React, { Component } from "react"
import { withGoogleMap, withScriptjs, GoogleMap,Marker,Polyline } from 'react-google-maps'
import { compose } from "recompose"
import axios from 'axios';

const MapWithAMarker = compose(withGoogleMap)(props => {
  console.log("props",props);
  const icon = {
    url:
      "https://images.vexels.com/media/users/3/154573/isolated/preview/bd08e000a449288c914d851cb9dae110-hatchback-car-top-view-silhouette-by-vexels.png",
      scaledSize: new window.google.maps.Size(20, 20),
      anchor: { x: 10, y: 10 }
  };

  return (
     <GoogleMap
        defaultZoom={16}
        center={props.path[props.path.length - 1]}
      >
        {props.path && (
          <div>
            <Polyline
              path={props.path}
              options={{ strokeColor: "#FF0000 " }}
            />
            <Marker
              icon={icon}
              position={props.path[props.path.length - 1]}
            />
          </div>
        )}
      </GoogleMap>
  )
})


export default class Tracking extends Component {
  constructor(props) {
    super(props)
    this.state = {
      path:props.path,
      selectedMarker: false,
      velocity : 400,
      progress: [],
      initialDate : new Date()
    }
  }

  componentDidMount = () => {
    this.interval = window.setInterval(this.moveObject, 1000)
  }

  moveObject = () => {
    const distance = this.getDistance()
    if (! distance) {
      return
    }

    let progress = this.state.path.filter(coordinates => coordinates.distance < distance)

    const nextLine = this.state.path.find(coordinates => coordinates.distance > distance)
    if (! nextLine) {
      this.setState({ progress })
      return // it's the end!
    }
    const lastLine = progress[progress.length - 1]

    const lastLineLatLng = new window.google.maps.LatLng(
      lastLine.lat,
      lastLine.lng
    )

    const nextLineLatLng = new window.google.maps.LatLng(
      nextLine.lat,
      nextLine.lng
    )

    // distance of this line 
    const totalDistance = nextLine.distance - lastLine.distance
    const percentage = (distance - lastLine.distance) / totalDistance

    const position = window.google.maps.geometry.spherical.interpolate(
      lastLineLatLng,
      nextLineLatLng,
      percentage
    )

    progress = progress.concat(position)
    this.setState({ progress })
  }

  consoleDistance = () => {
    console.log(this.getDistance())
  }

   componentDidUpdate = () => {
    const distance = this.getDistance()
    if (! distance) {
      return
    }

    let progress = this.state.path.filter(coordinates => coordinates.distance < distance)

    const nextLine = this.state.path.find(coordinates => coordinates.distance > distance)

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

    const markerUrl = 'https://images.vexels.com/media/users/3/154573/isolated/preview/bd08e000a449288c914d851cb9dae110-hatchback-car-top-view-silhouette-by-vexels.png'
    const marker = document.querySelector(`[src="${markerUrl}"]`)
    console.log("marker",marker);
    
    if (marker) { // when it hasn't loaded, it's null
      marker.style.transform = `rotate(${actualAngle}deg)`
    }

  }

  componentWillMount = () => {
    this.state.path = this.state.path.map((coordinates, i, array) => {
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

    console.log(this.state.path)
  }

  getDistance = () => {
    // seconds between when the component loaded and now
    const differentInTime = (new Date() - this.state.initialDate) / 1000 // pass to seconds
    return differentInTime * this.state.velocity // d = v*t -- thanks Newton!
  }

  render(){
    return (
      <React.Fragment>
          <section className="content">
          <div className="pageContent col-lg-12 col-md-12 col-sm-12 col-xs-12">
            <MapWithAMarker
              googleMapURL="https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places"
              loadingElement={<div style={{ height: `100%` }} />}
              containerElement={<div style={{ height: `650px` }} />}
              mapElement={<div style={{ height: `100%` }} />}
              path={this.state.progress}
            />
            </div> 
         </section>
      </React.Fragment>
    )
  }
}
