import React from "react"
import "./App.css"
import InfoPanel from "./components/InfoPanel"
import scriptLoader from 'react-async-script-loader';
import { MapStyle } from "./MapStyle.js"
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

var locations = [
  {title: 'Park Ave Penthouse', location: {lat: 40.7713024, lng: -73.9632393}},
  {title: 'Chelsea Loft', location: {lat: 40.7444883, lng: -73.9949465}},
  {title: 'Union Square Open Floor Plan', location: {lat: 40.7347062, lng: -73.9895759}},
  {title: 'East Village Hip Studio', location: {lat: 40.7281777, lng: -73.984377}},
  {title: 'TriBeCa Artsy Bachelor Pad', location: {lat: 40.7195264, lng: -74.0089934}},
  {title: 'Chinatown Homey Space', location: {lat: 40.7180628, lng: -73.9961237}}
];


class MapApp extends React.Component {
  state = {
    marker: '',
    infowindow: '',
    locations: '',
    map: ''
  }
  componentDidMount() {
    window.initMap = this.initMap;
  }
  initMap = () => {
    var mapview = document.getElementById("map");
    mapview.style.height = window.innerHeight + "px";
    var map = new window.google.maps.Map(mapview, {
        center: {lat: 40.7413549, lng: -73.9980244},
        zoom: 13,
        mapTypeControl: false,
        styles: MapStyle
    });
    var marker = new window.google.maps.Marker({
      position: {lat: 40.7413549, lng: -73.9980244},
      map: map,
      title: 'bingo!'
    });
    var Infowindow = new window.google.maps.InfoWindow();

    this.setState({
      map: map,
      infowindow: Infowindow,
      marker: marker
    });

    marker.addListener('click', () => {
      this.state.infowindow.marker = this.state.marker;
      this.state.infowindow.setContent(
        '<Paper>'+
        marker.title+
        '</Paper>'
        )
      this.state.infowindow.open(this.state.map, this.state.infowindow.marker);
    });

  }

  // infowindowHanddler = (marker) => {
  //     this.state.infowindow.marker = this.state.marker;
  //     this.state.infowindow.setContent(
  //       '<Paper>'+
  //       marker.title+
  //       '</Paper>'
  //       )
  //     this.state.infowindow.open(this.state.map, this.state.infowindow.marker);
      // this.state.infowindow.addListener('closeclick', function() {
      //   this.state.infowindow.close();
      // });
    // }
  

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