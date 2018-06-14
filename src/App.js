import React from "react"
import "./App.css"
import InfoPanel from "./components/InfoPanel"
import scriptLoader from 'react-async-script-loader';
import { MapStyle } from "./MapStyle.js"

class MapApp extends React.Component {
  componentDidMount() {
    window.initMap = this.initMap;
  }
  initMap() {
    var mapview = document.getElementById("map");
    mapview.style.height = window.innerHeight + "px";
    let map = new window.google.maps.Map(mapview, {
        center: {lat: 40.7413549, lng: -73.9980244},
        zoom: 13,
        mapTypeControl: false,
        styles: MapStyle
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