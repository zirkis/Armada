// eslint-disable-next-line import/no-extraneous-dependencies
import Ember from 'ember';

// eslint-disable-next-line no-undef
const Google = google;

export default Ember.Component.extend({
  // Data to display
  rides: null,

  // Map
  map: null,
  polyline: [],
  directionsService: null,
  stepDisplay: null,
  position: null,
  marker: [],
  poly2: [],
  poly: null,
  startLocation: [],
  endLocation: [],
  timerHandle: [],
  speed: 0.000005,
  wait: 1,
  infowindow: null,
  myPano: null,
  panoClient: null,
  nextPanoId: null,
  Colors: ["#FF0000", "#00FF00", "#0000FF"],

  // Animation
  lastVertex: 1,
  stepnum: 0,
  step: 50, // 5; // metres
  tick: 100, // milliseconds
  eol: [],

  // Insert map in the map-canvas container
  insertMap: function () {
    const container = this.$('.map-canvas')[0];
    const options = {
      zoom: 12,
      mapTypeId: Google.maps.MapTypeId.ROADMAP
    };
    // eslint-disable-next-line no-new
    const map = new Google.maps.Map(container, options);
    const address = 'Paris';
    const geocoder = new Google.maps.Geocoder();

    // On converti l'adresses en coordonnées géographiques
    geocoder.geocode({'address': address}, results => {
      // On ajuste le zoom sur le resultat
      map.fitBounds(results[0].geometry.viewport);
    });
    this.set('map', map);
    this.setRoutes();
  }.on('didInsertElement'),

  // Set the route on the map
  setRoutes: function () {
    const rides = this.get('rides');
    if (!rides) {
      return;
    }
    const map = this.get('map');
    const departurePlaces = rides.map(ride => {
      return ride.get('departurePlace');
    });
    console.log(departurePlaces);
    const arrivalPlaces = rides.map(ride => {
      return ride.get('arrivalPlace');
    });
    const directionsDisplay = [];

    for (let i = 0; i < departurePlaces.length; i++) {

      let rendererOptions = {
        map: map,
        suppressMarkers: true,
        preserveViewport: true
      };
      let directionsService = new Google.maps.DirectionsService();

      let travelMode = Google.maps.DirectionsTravelMode.DRIVING;

      let request = {
        origin: departurePlaces[i],
        destination: arrivalPlaces[i],
        travelMode: travelMode
      };

      directionsService.route(request,
        this.makeRouteCallback(i, directionsDisplay[i], rendererOptions));
    }
  },
  makeRouteCallback: function (routeNum, disp, rendererOptions) {
    const map = this.get('map');
    const polyline = this.get('polyline');
    const poly2 = this.get('poly2');
    const startLocation = this.get('startLocation');
    const endLocation = this.get('endLocation');
    const marker = this.get('marker');

    if (polyline[routeNum] && (polyline[routeNum].getMap() != null)) {
      this.startAnimation(routeNum);
      return;
    }
    return function (response, status) {

      if (status === Google.maps.DirectionsStatus.OK) {

        // const bounds = new Google.maps.LatLngBounds();
        // let route = response.routes[0];
        startLocation[routeNum] = {};
        endLocation[routeNum] = {};


        polyline[routeNum] = new Google.maps.Polyline({
          path: [],
          strokeColor: '#FFFF00',
          strokeWeight: 3
        });

        poly2[routeNum] = new Google.maps.Polyline({
          path: [],
          strokeColor: '#FFFF00',
          strokeWeight: 3
        });


        // For each route, display summary information.
        // let path = response.routes[0].overview_path;
        const legs = response.routes[0].legs;

        disp = new Google.maps.DirectionsRenderer(rendererOptions);
        disp.setMap(map);
        disp.setDirections(response);

        //Markers
        for (let i = 0; i < legs.length; i++) {
          if (i === 0) {
            startLocation[routeNum].latlng = legs[i].start_location;
            startLocation[routeNum].address = legs[i].start_address;
            // marker = google.maps.Marker({map:map,position: startLocation.latlng});
            marker[routeNum] = this.createMarker(legs[i].start_location, "start",
              legs[i].start_address, "green");
          }
          endLocation[routeNum].latlng = legs[i].end_location;
          endLocation[routeNum].address = legs[i].end_address;
          let steps = legs[i].steps;

          for (let j = 0; j < steps.length; j++) {
            let nextSegment = steps[j].path;

            for (let k = 0; k < nextSegment.length; k++) {
              polyline[routeNum].getPath().push(nextSegment[k]);
              //bounds.extend(nextSegment[k]);
            }
          }
        }
      }
      polyline[routeNum].setMap(map);
      //map.fitBounds(bounds);
      this.startAnimation(routeNum);
    }; // else alert("Directions request failed: "+status);
  },
  startAnimation: function (index) {
    const map = this.get('map');
    const eol = this.get('eol');
    const poly2 = this.get('poly2');
    const polyline = this.get('polyline');
    const timerHandle = this.get('timerHandle');

    if (timerHandle[index]) {clearTimeout(timerHandle[index]);}
    eol[index]=polyline[index].Distance();
    map.setCenter(polyline[index].getPath().getAt(0));

    poly2[index] = new Google.maps.Polyline(
      {
        path: [polyline[index].getPath().getAt(0)],
        strokeColor:"#FFFF00",
        strokeWeight:3
      });
    // Allow time for the initial map display
    timerHandle[index] = setTimeout("animate("+index+",50)",2000);
  },
  animate: function (index, d) {
    const eol = this.get('eol');
    const polyline = this.get('polyline');
    const timerHandle = this.get('timerHandle');
    const marker = this.get('marker');
    const endLocation = this.get('endLocation');
    const step = this.get('step');
    const tick = this.get('tick');

    if (d > eol[index]) {
      marker[index].setPosition(endLocation[index].latlng);
      return;
    }
    let p = polyline[index].GetPointAtDistance(d);

    //map.panTo(p);
    marker[index].setPosition(p);
    //this.updatePoly(index,d);
    timerHandle[index] = setTimeout("animate("+index+","+(d+step)+")", tick);
  },
  updatePoly: function (i,d) {
    const poly2 = this.get('poly2');
    const polyline = this.get('polyline');
    const lastVertex = this.get('lastVertex');
    const endLocation = this.get('endLocation');

    // Spawn a new polyline every 20 vertices, because updating a 100-vertex poly is too slow
    if (poly2[i].getPath().getLength() > 20) {
      poly2[i] =
        new Google.maps.Polyline([polyline[i].getPath().getAt(lastVertex-1)]);
      // map.addOverlay(poly2)
    }

    if (polyline[i].GetIndexAtDistance(d) < lastVertex+2) {
      if (poly2[i].getPath().getLength()>1) {
        poly2[i].getPath().removeAt(poly2[i].getPath().getLength()-1);
      }
      poly2[i].getPath()
        .insertAt(poly2[i].getPath().getLength(),
          polyline[i].GetPointAtDistance(d));
    } else {
      poly2[i].getPath()
        .insertAt(poly2[i].getPath().getLength(), endLocation[i].latlng);
    }
  }

});
