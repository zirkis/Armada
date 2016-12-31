// eslint-disable-next-line import/no-extraneous-dependencies
import Ember from 'ember';

// eslint-disable-next-line no-undef
const Google = window.google;

const {isEmpty} = Ember;

export default Ember.Component.extend({
  ride: null,
  rideChanged: Ember.observer('ride',
    'ride.departurePlace',
    'ride.arrivalPlace', function() {
    Ember.run.once(this, 'drawPolyline');
  }),
  // Insert map in the map-canvas container
  didInsertElement() {
    this.drawPolyline();
  },
  drawPolyline() {
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
    this.setRoutes(map);
  },
  // Set the route on the map
  setRoutes(map) {
    const ride = this.get('ride');
    if (!ride || isEmpty(ride) || !ride.get('departurePlace') || !ride.get('arrivalPlace')) {
      return;
    }
    const departurePlaces = ride.get('departurePlace');
    const arrivalPlaces = ride.get('arrivalPlace');
    const directionsDisplay = null;
    const rendererOptions = {
      map: map,
      suppressMarkers: true,
      preserveViewport: true
    };
    const directionsService = new Google.maps.DirectionsService();
    const travelMode = Google.maps.DirectionsTravelMode.DRIVING;

    // console.log(`${departurePlaces[i]} => ${arrivalPlaces[i]}`);

    const request = {
      origin: departurePlaces,
      destination: arrivalPlaces,
      travelMode: travelMode
    };

    directionsService.route(request,
      this.makeRouteCallback(map, directionsDisplay, rendererOptions));
  },
  makeRouteCallback(map, disp, rendererOptions) {
    const bounds = new Google.maps.LatLngBounds();

    return (response, status) => {
      if (status === Google.maps.DirectionsStatus.OK) {
        const startLocation = {};
        const endLocation = {};

        const polyline = new Google.maps.Polyline({
          path: [],
          strokeColor: '#FFFF00',
          strokeWeight: 3
        });

        // Display summary information.
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
            startLocation.latlng = legs[i].start_location;
            startLocation.address = legs[i].start_address;
            this.createMarker(legs[i].start_location, 'start',
              legs[i].start_address, "green");
          }
          endLocation.latlng = legs[i].end_location;
          endLocation.address = legs[i].end_address;
          let steps = legs[i].steps;

          for (let j = 0; j < steps.length; j++) {
            let nextSegment = steps[j].path;

            for (let k = 0; k < nextSegment.length; k++) {
              polyline.getPath().push(nextSegment[k]);
              bounds.extend(nextSegment[k]);
            }
          }
        }
        polyline.setMap(map);
        map.fitBounds(bounds);
      }
    };
  },
  createMarker(latlng, label, html) {
    const map = this.get('map');
    const infowindow = this.get('infowindow');
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
  }

});
