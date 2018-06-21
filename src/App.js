import React from "react"
import "./App.css"
import InfoPanel from "./components/InfoPanel"
import scriptLoader from 'react-async-script-loader';
import { MapStyle } from "./MapStyle.js"
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';

class MapApp extends React.Component {
  state = {
    markers: [],
    infowindow: '',
    locations: [
      {
        title: 'Pizza Nova', 
        location: {lat: 43.6651599, lng: -79.3883925}, 
        address: '997 Bay St, Toronto, ON M5S 3A6',
        type: "food",
        id: "4b958823f964a520d8a734e3"
      },
      {
        title: 'Jimmy\'s Coffee',
        location: {lat: 43.6452575, lng: -79.4003085},
        address: '107 Portland St, Toronto ON M5V 2N3',
        type: "food",
        id: "4b2274c1f964a5200f4724e3"
      },
      {
        title: 'Mark Andrew Hair Studio',
        location: {lat: 43.6512735, lng: -79.3953462}, 
        address: '51 Sullivan St, Toronto ON',
        type: "fun",
        id: "4b11bcf0f964a5207a8323e3"
      },
      {
        title: 'Krispy Kreme Doughnut Café',
        location: {lat: 43.6617052, lng: -79.4082591}, 
        address: '215 Harbord St, Toronto ON M5S 1H6',
        type: "food",
        id: "4cdb1125d4ecb1f7d9777748"
      },
      {
        title: 'Lever Brothers soap factory', 
        location: {lat: 43.6531261, lng: -79.3479356}, 
        address: '21 Don Roadway, Toronto ON',
        type: "fun",
        id: "531f6f3b498e347c2c14d59c"
      },
      {
        title: 'The Rosemont Fitness', 
        location: {lat: 43.645604, lng: -79.390136}, 
        address: '50 John Street, Toronto ON',
        type: "fun",
        id: "571d37de498ef2ba27feb6ef"
      }
    ],
    map: {},
  }
  componentDidMount() {
    window.initMap = this.initMap;
  }

  initMap = () => {
    var mapview = document.getElementById("map");
    var input = document.getElementById("search");
    var infowindow = new window.google.maps.InfoWindow();
    mapview.style.height = window.innerHeight + "px";
    var map = new window.google.maps.Map(mapview, {
        center: {lat: 43.6547878, lng: -79.3967198},
        zoom: 14,
        mapTypeControl: false,
        styles: MapStyle
    });
    this.setState({
      map: map,
      infowindow: infowindow
    });

    this.state.locations.map( loc => {
        loc = new window.google.maps.Marker({
        position: loc.location,
        map: map,
        title: loc.title,
        address: loc.address,
        animation: window.google.maps.Animation.DROP,
        type: loc.type,
        id: loc.id
        });

        loc.addListener('click', () => {
          this.toggleBounce(loc)
          this.createInfowindow(loc)
        });
        this.state.markers.push(loc)
    })
  }

  handleClick = (loc) => {
    this.state.map.setCenter(loc.position);
    this.state.map.panBy(0, 0);
    this.toggleBounce(loc);
  }

  toggleBounce(marker) {
    marker.setAnimation(null)
    this.state.markers.map((mar)=> mar.setAnimation(null))
    marker.setAnimation(window.google.maps.Animation.BOUNCE)
  }

  createInfowindow(marker) {
    this.state.infowindow.setContent(
      '<Card>'+
      'Loading Data...'+
      '</Card>'
    );
    this.state.infowindow.open(this.state.map, marker);
    this.foursquareInfowindow(marker)
  }

  foursquareInfowindow(marker) {
    const clientId = "TPIDDHBKB2QFBWEV2MPDOFGUSWXCXGAA5IVOWEMN5ASR3UJW";
    const clientSecret = "4HB1ZZJBVXC3F0BREBPSGXYK0VZ5ALS4XRNJZSBP1JROG0DE";
    var url = `https://api.foursquare.com/v2/venues/${marker.id}?client_id=${clientId}&client_secret=${clientSecret}&v=20170621`;

    fetch(url)
      .then((response) => {
        response.json()
        .then((responseJson) => {
          var data = responseJson.response.venue;
          var photo = data.photos.groups[0].items[0];
          var photoSize = "300x200";
          var content = 
          `<div class="infowindow">
            <h2>${marker.title}</h2>
            <img src="${photo.prefix}${photoSize}${photo.suffix}" alt="photo for ${marker.title}">
            <span><b>Phone: </b>${data.contact.formattedPhone !== undefined? data.contact.formattedPhone : `not avalable :(`}</span>
            <span><b>Address: </b>${data.location.formattedAddress}</span>
            <span><b>Website: </b>${data.url !== undefined? `<a href=${data.url}>${data.url}</a>` : `not avalable :(`}</span>
          </div>`
          this.state.infowindow.setContent(content);
        })
      }).catch((error) => {
        this.state.infowindow.setContent(
          '<Paper>'+
            'Sorry can\'t get data from the server ' +
          '</Paper>'
        );
      })
  }

  render() {
    return (
      <div className="container">
      <div id="map"/>
      <InfoPanel
      searchPlace={this.searchPlace}
      handleClick={this.handleClick}
      locations={this.state.locations}
      markers={this.state.markers}
      map={this.state.map}
      />
      </div>
    );
  }
}

export default scriptLoader(
    [`https://maps.googleapis.com/maps/api/js?key=AIzaSyAhXhPjZlCsSU-ByZO61Pw24Pg0-rBnB20&v=3&libraries=places&callback=initMap`]
)(MapApp);