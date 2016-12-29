// eslint-disable-next-line import/no-extraneous-dependencies
import Ember from 'ember';

// eslint-disable-next-line no-undef
const Google = google;

Google.maps.Polyline.prototype.GetPointAtDistance = function(metres) {
  // some awkward special cases
  if (metres === 0) {return this.getPath().getAt(0);}
  if (metres < 0) {return null;}
  if (this.getPath().getLength() < 2) {return null;}
  var dist=0;
  var olddist=0;
  for (var i=1; (i < this.getPath().getLength() && dist < metres); i++) {
    olddist = dist;
    dist += Google.maps.geometry.spherical.computeDistanceBetween(
      this.getPath().getAt(i),
      this.getPath().getAt(i-1)
    );
  }
  if (dist < metres) {
    return null;
  }
  var p1= this.getPath().getAt(i-2);
  var p2= this.getPath().getAt(i-1);
  var m = (metres-olddist)/(dist-olddist);
  return new Google.maps.LatLng( p1.lat() + (p2.lat()-p1.lat())*m, p1.lng() + (p2.lng()-p1.lng())*m);
};
Google.maps.LatLng.prototype.kmTo = function(a) {
  var e = Math, ra = e.PI/180;
  var b = this.lat() * ra, c = a.lat() * ra, d = b - c;
  var g = this.lng() * ra - a.lng() * ra;
  var f = 2 * e.asin(e.sqrt(e.pow(e.sin(d/2), 2) + e.cos(b) * e.cos
      (c) * e.pow(e.sin(g/2), 2)));
  return f * 6378.137;
};

Google.maps.Polyline.prototype.inKm = function(n) {
  var a = this.getPath(n), len = a.getLength(), dist = 0;
  for (var i=0; i < len-1; i++) {
    dist += a.getAt(i).kmTo(a.getAt(i+1));
  }
  return dist;
};
Google.maps.Polyline.prototype.GetIndexAtDistance = function(metres) {
  // some awkward special cases
  if (metres === 0) {return this.getPath().getAt(0);}
  if (metres < 0) {return null;}
  var dist=0;
  var olddist=0;
  for (var i=1; (i < this.getPath().getLength() && dist < metres); i++) {
    olddist = dist;
    dist += this.getPath().getAt(i).kmTo(this.getPath().getAt(i-1));
  }
  if (dist < metres) {return null;}
  return i;
};

const {isEmpty} = Ember;

export default Ember.Component.extend({
  // Data to display
  rides: null,

  // Map
  map: null,
  polyline: [],
  bounds: null,
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
  tick: 2000000, // milliseconds
  eol: [],

  // Insert map in the map-canvas container
  didInsertElement() {
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
  },
  // Set the route on the map
  setRoutes() {
    const rides = this.get('rides');
    if (isEmpty(rides)) {
      return;
    }
    const map = this.get('map');
    const departurePlaces = rides.map(ride => {
      return ride.get('departurePlace');
    });
    const arrivalPlaces = rides.map(ride => {
      return ride.get('arrivalPlace');
    });
    const directionsDisplay = [];
    const rendererOptions = {
      map: map,
      suppressMarkers: true,
      preserveViewport: true
    };
    const directionsService = new Google.maps.DirectionsService();
    const travelMode = Google.maps.DirectionsTravelMode.DRIVING;
    let request = null;

    for (let i = 0; i < departurePlaces.length; i++) {
      console.log(`${departurePlaces[i]} => ${arrivalPlaces[i]}`);

      request = {
        origin: departurePlaces[i],
        destination: arrivalPlaces[i],
        travelMode: travelMode
      };

      directionsService.route(request,
        this.makeRouteCallback(i, directionsDisplay[i], rendererOptions));
    }
  },
  makeRouteCallback(routeNum, disp, rendererOptions) {
    const map = this.get('map');
    const polyline = this.get('polyline');
    const poly2 = this.get('poly2');
    const startLocation = this.get('startLocation');
    const endLocation = this.get('endLocation');
    const marker = this.get('marker');
    const bounds = new Google.maps.LatLngBounds();
    this.set('bounds', bounds);

    if (polyline[routeNum] && (polyline[routeNum].getMap() != null)) {
      // this.startAnimation(routeNum);
      return;
    }
    return (response, status) => {
      if (status === Google.maps.DirectionsStatus.OK) {
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
        // LEGS contains all the infos we need: distance, duration (useless
        // if we take the speed of the car
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
            marker[routeNum] = this.createMarker(legs[i].start_location, 'start',
              legs[i].start_address, "green");
          }
          endLocation[routeNum].latlng = legs[i].end_location;
          endLocation[routeNum].address = legs[i].end_address;
          let steps = legs[i].steps;

          for (let j = 0; j < steps.length; j++) {
            let nextSegment = steps[j].path;

            for (let k = 0; k < nextSegment.length; k++) {
              polyline[routeNum].getPath().push(nextSegment[k]);
              bounds.extend(nextSegment[k]);
            }
          }
        }
        polyline[routeNum].setMap(map);
        map.fitBounds(bounds);
        // this.startAnimation(routeNum);
      }
    };
  },
  createMarker(latlng, label, html) {
    const map = this.get('map');
    const contentString = '<b>'+label+'</b><br>'+html;
    const marker = new Google.maps.Marker({
      position: latlng,
      map: map,
      title: label,
      zIndex: Math.round(latlng.lat()*-100000)<<5
    });
    marker.myname = label;

    Google.maps.event.addListener(marker, 'click', function() {
      infowindow.setContent(contentString);
      infowindow.open(map, marker);
    });
    return marker;
  },
  startAnimation(index) {
    const map = this.get('map');
    const eol = this.get('eol');
    const poly2 = this.get('poly2');
    const polyline = this.get('polyline');
    const timerHandle = this.get('timerHandle');
    const tick = this.get('tick');
    if (timerHandle[index]) {clearTimeout(timerHandle[index]);}
    eol[index]=polyline[index].inKm();
    map.setCenter(polyline[index].getPath().getAt(0));

    poly2[index] = new Google.maps.Polyline({
      path: [polyline[index].getPath().getAt(0)],
      strokeColor:"#FFFF00",
      strokeWeight:3
    });
    // Allow time for the initial map display
    setTimeout(this.animate(index, 1550), 3 * tick);
    timerHandle[index] = setTimeout(this.animate(index, 550), tick);
  },
  animate(index, d) {
    console.log('couou');
    const map = this.get('map');
    const eol = this.get('eol');
    const polyline = this.get('polyline');
    const marker = this.get('marker');
    const endLocation = this.get('endLocation');
    const step = this.get('step');
    const timerHandle = this.get('timerHandle');
    const tick = this.get('tick');
    if (d > eol[index]) {
      marker[index].setPosition(endLocation[index].latlng);
      return;
    }
    const p = polyline[index].GetPointAtDistance(d);
    map.panTo(p);
    marker[index].setPosition(p);
    this.updatePoly(index, d);
  },
  updatePoly(i, d) {
    const poly2 = this.get('poly2');
    const polyline = this.get('polyline');
    const lastVertex = this.get('lastVertex');
    const endLocation = this.get('endLocation');

    // Spawn a new polyline every 20 vertices, because updating a 100-vertex poly is too slow
    if (poly2[i].getPath().getLength() > 20) {
      poly2[i] =
        new Google.maps.Polyline([polyline[i].getPath().getAt(lastVertex-1)]);
      map.addOverlay(poly2);
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
