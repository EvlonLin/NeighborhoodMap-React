import React, { Component } from 'react';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

class GoogleMap extends Component {
  state = {
    location: [
      {title: 'Park Ave Penthouse', location: {lat: 40.7713024, lng: -73.9632393}},
      {title: 'Chelsea Loft', location: {lat: 40.7444883, lng: -73.9949465}},
      {title: 'Union Square Open Floor Plan', location: {lat: 40.7347062, lng: -73.9895759}},
      {title: 'East Village Hip Studio', location: {lat: 40.7281777, lng: -73.984377}},
      {title: 'TriBeCa Artsy Bachelor Pad', location: {lat: 40.7195264, lng: -74.0089934}},
      {title: 'Chinatown Homey Space', location: {lat: 40.7180628, lng: -73.9961237}}],
    map: '',
    infowindow:''
  }

  componentDidMount() {
    window.initMap = this.initMap;
  }

  initMap() {
    let map = new window.google.maps.Map(document.getElementById('map'), {
        center: {lat: 40.7413549, lng: -73.9980244},
        zoom: 13,
        mapTypeControl: false
    });
  }

  render() {
    return (
      <div id='map'>
      </div>
    );
  }
}


// AIzaSyAhXhPjZlCsSU-ByZO61Pw24Pg0-rBnB20


export default GoogleMap;