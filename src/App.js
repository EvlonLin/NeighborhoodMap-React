import React from "react"
import "./css/App.css"
import InfoPanel from "./components/InfoPanel"
import { MapStyle } from "./MapStyle.js"

class App extends React.Component {
  // setup the variables
  state = {
    markers: [],
    infowindow: '',
    locations: [
      {
        title: 'Pizza Nova', 
        location: {lat: 43.6651599, lng: -79.3883925}, 
        address: '997 Bay St, Toronto',
        type: "food",
        id: "4b958823f964a520d8a734e3"
      },
      {
        title: 'Jimmy\'s Coffee',
        location: {lat: 43.6452575, lng: -79.4003085},
        address: '107 Portland St, Toronto',
        type: "food",
        id: "4b2274c1f964a5200f4724e3"
      },
      {
        title: 'Mark Andrew Hair Studio',
        location: {lat: 43.6512735, lng: -79.3953462}, 
        address: '51 Sullivan St, Toronto',
        type: "fun",
        id: "4b11bcf0f964a5207a8323e3"
      },
      {
        title: 'Krispy Kreme Doughnut Café',
        location: {lat: 43.6617052, lng: -79.4082591}, 
        address: '215 Harbord St, Toronto',
        type: "food",
        id: "4cdb1125d4ecb1f7d9777748"
      },
      {
        title: 'Lever Brothers soap factory', 
        location: {lat: 43.6531261, lng: -79.3479356}, 
        address: '21 Don Roadway, Toronto',
        type: "fun",
        id: "531f6f3b498e347c2c14d59c"
      },
      {
        title: 'The Rosemont Fitness', 
        location: {lat: 43.645604, lng: -79.390136}, 
        address: '50 John Street, Toronto',
        type: "fun",
        id: "571d37de498ef2ba27feb6ef"
      }
    ],
    map: {},
    bounds: '',
  }

  //run initMap function when open the app
  componentDidMount() {
    window.initMap = this.initMap;
    loadMap(`https://maps.googleapis.com/maps/api/js?key=AIzaSyAhXhPjZlCsSU-ByZO61Pw24Pg0-rBnB20&v=3&libraries=places&callback=initMap`)
  }

  initMap = () => {
    //create map elements
    var mapview = document.getElementById("map");
    var infowindow = new window.google.maps.InfoWindow();
    var bounds = new window.google.maps.LatLngBounds();
    mapview.style.height = window.innerHeight + "px";
    //setup map
    var map = new window.google.maps.Map(mapview, {
        center: {lat: 43.6547878, lng: -79.3967198},
        zoom: 14,
        mapTypeControl: false,
        styles: MapStyle
    });
    //setup markers
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
      bounds.extend(loc.position);
      loc.addListener('click', () => {
        this.toggleBounce(loc)
        this.createInfowindow(loc)
        map.setCenter(loc.position);
        map.panBy(-100, -200);
      });
      this.state.markers.push(loc)
      return null
    })
    //save value into state
    this.setState({
      map: map,
      infowindow: infowindow,
      bounds: bounds,
    });
    this.handleresizeMapZoom()
  }

  //event handler for markers onclick event
  handleMarkersClick = (marker) => {
    this.state.map.setCenter(marker.position);
    this.state.map.setZoom(16);
    this.state.map.panBy(-100, -250);
    this.createInfowindow(marker);
    this.toggleBounce(marker);
  }

  //event handler for resize map center for different window sizes
  handleresizeMapZoom = () => {
    const { map, bounds } = this.state;
    if (window.innerWidth >= 1177) {
      map.setZoom(14);
    } else if (window.innerWidth >= 700) {
      map.setZoom(13);
    } else {
      map.fitBounds(bounds);
    }
    map.panBy(0, 0);
  }

  //change markers animatiom for filter search
  toggleBounce(marker) {
    marker.setAnimation(null)
    this.state.markers.map((mar)=> mar.setAnimation(null))
    marker.setAnimation(window.google.maps.Animation.BOUNCE)
  }

  //create infowindow
  createInfowindow(marker) {
    this.state.infowindow.setContent(
      '<div class="infowindow">'+
      '<h2>Loading...</h2>'+
      '</div>'
    );
    this.state.infowindow.open(this.state.map, marker);
    this.foursquareInfowindow(marker)
  }

  //sending Ajax requese to foursquare
  foursquareInfowindow(marker) {
    const clientId = "J34XRZ3VMGC0DRUHC2ZAMVJ5RWU1G01JDDPEZ4PVB3L1KSH3";
    const clientSecret = "VRV0SUVBLZGKHSMEVDUYHNG5MQFRXLX04DRMR3MPTYH4RK3Z";
    var errorMessage = `<p>Sorry can't get data from the server</p>`
    var url = `https://api.foursquare.com/v2/venues/${marker.id}?client_id=${clientId}&client_secret=${clientSecret}&v=20170621`;

    fetch(url)
      .then((response) => {
        //log error message when failed to get the data
        if (response.status !== 200) {
          this.state.infowindow.setContent(errorMessage);
          return null
        }
        response.json()
        //getting the result and use it to make infowindow contents
        .then((responseJson) => {
          var data = responseJson.response.venue;
          var photo = data.photos.groups[0].items[0];
          var photoSize = "300x200";
          var content = 
          `<div>
            <h2>${marker.title}</h2>
            <img class="mainPhoto" src="${photo.prefix}${photoSize}${photo.suffix}" alt="photo for ${marker.title}" aria-label="photo for ${marker.title}">
            <span><b>Phone: </b>${data.contact.formattedPhone !== undefined? data.contact.formattedPhone : `not avalable :(`}</span>
            <span><b>Address: </b>${data.location.address},${data.location.city}</span>
            <span><b>Website: </b>${data.url !== undefined? `<a href=${data.url}>${data.url}</a>` : `not avalable :(`}</span>
            <a class="footNote" href=https://developer.foursquare.com/>Powered by Foursquare</a>
          </div>`
          this.state.infowindow.setContent(content);
        })
      }).catch((error) => {
          this.state.infowindow.setContent(errorMessage);
        })
  }
  //passing parent data to child
  render() {
    return (
      <div className="container">
        <InfoPanel
        searchPlace={this.searchPlace}
        handleClick={this.handleMarkersClick}
        resizeMapZoom={this.handleresizeMapZoom}
        locations={this.state.locations}
        markers={this.state.markers}
        map={this.state.map}
        infowindow={this.state.infowindow}
        />
        <div id="map"/>
      </div>
    );
  }
}

export default App;
//load map asynchronous and catch the error
function loadMap(src) {
    var ref = window.document.getElementsByTagName("script")[0];
    var script = window.document.createElement("script");
    script.src = src;
    script.async = true;
    script.onerror = function () {
        document.write("Google Maps is unavailable right now");
    };
    ref.parentNode.insertBefore(script, ref);
}
