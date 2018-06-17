import React from "react"
import "./App.css"
import InfoPanel from "./components/InfoPanel"
import scriptLoader from 'react-async-script-loader';
import { MapStyle } from "./MapStyle.js"
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

class MapApp extends React.Component {
  state = {
    marker: [],
    infowindow: '',
    locations: 
    [
    {title: 'Park Ave Penthouse', location: {lat: 40.7713024, lng: -73.9632393}},
    {title: 'Chelsea Loft', location: {lat: 40.7444883, lng: -73.9949465}},
    {title: 'Union Square Open Floor Plan', location: {lat: 40.7347062, lng: -73.9895759}},
    {title: 'East Village Hip Studio', location: {lat: 40.7281777, lng: -73.984377}},
    {title: 'TriBeCa Artsy Bachelor Pad', location: {lat: 40.7195264, lng: -74.0089934}},
    {title: 'Chinatown Homey Space', location: {lat: 40.7180628, lng: -73.9961237}}
    ],
    map: ''
  }
  componentDidMount() {
    window.initMap = this.initMap;
  }
  initMap = () => {
    var mapview = document.getElementById("map");
    var infowindow = new window.google.maps.InfoWindow();
    mapview.style.height = window.innerHeight + "px";
    var map = new window.google.maps.Map(mapview, {
        center: {lat: 40.7413549, lng: -73.9980244},
        zoom: 13,
        mapTypeControl: false,
        styles: MapStyle
    });

    this.state.locations.map( loc => {
        loc = new window.google.maps.Marker({
        position: loc.location,
        map: map,
        title: loc.title,
        animation: window.google.maps.Animation.DROP,
        });
        loc.addListener('click', () => {
        infowindow.marker = loc;
        infowindow.setContent(
          '<Paper>'+
          loc.title+
          '</Paper>'
          )
        infowindow.open(this.state.map, infowindow.marker);

      });
    })
    
    this.setState({
      map: map,
      // infowindow: Infowindow,
    });
  }

  render() {
    return (
      <div className="container">
      <div id="map"/>
      <InfoPanel/>
      </div>
    );
  }
}

export default scriptLoader(
    [`https://maps.googleapis.com/maps/api/js?key=AIzaSyAhXhPjZlCsSU-ByZO61Pw24Pg0-rBnB20&v=3&callback=initMap`]
)(MapApp);