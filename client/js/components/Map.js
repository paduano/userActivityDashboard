var React = require('react');
var ReactFauxDOM = require('react-faux-dom');
var ActiveUsersOverlay = require('components/ActiveUsersOverlay');
var AllUsersOverlay = require('components/AllUsersOverlay');
var PlacesOverlay = require('components/PlacesOverlay');
var randomData = require('data/randomData');

var mapStyle = [
    {
        "featureType": "water",
        "stylers": [
            { "color": "#777777" }
        ]
    },
    {
        featureType: "administrative",
        elementType: "labels",
        stylers: [
            { visibility: "off" }
        ]
    },{
        featureType: "poi",
        elementType: "labels",
        stylers: [
            { visibility: "off" }
        ]
    },{
        featureType: "water",
        elementType: "labels",
        stylers: [
            { visibility: "off" }
        ]
    },{
        featureType: "road",
        elementType: "labels",
        stylers: [
            { visibility: "off" }
        ]
    }
];



class Map extends React.Component {

    setUpOverlay(){

        //XXX change the logic about how the users are generated/fetched and passed
        var clusters = randomData.generateClusters();
        var activeUsers = randomData.generateFakeUsers(500, clusters);


        this.allUsersOverlay = new AllUsersOverlay(this.map, clusters);
        this.activeUsersOverlay = new ActiveUsersOverlay(this.map, activeUsers);
        this.placesOverlay = new PlacesOverlay(this.map);

        var self = this;

        google.maps.event.addListener(this.map, 'bounds_changed', function() {
            var allUsers = randomData.generateFakeUsers(1000, clusters);
            //Generate fake data
            var allUsersData = {
                overallUsers: randomData.generateUsersGrid(
                    self.activeUsersOverlay.geoBounds
                    , allUsers)
            };

            var placesData = {
                places: randomData.generatePlaces(30)
            }

            self.allUsersOverlay.setData(allUsersData);
            self.placesOverlay.setData(placesData);
        });

    }

    setUpGmap(){

        var mapCanvas = document.getElementById('main-map');
        var mapOptions = {
            center: new google.maps.LatLng(37.763972, -122.431297),
            styles: mapStyle,
            disableDefaultUI: true,
            zoom: 12,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };

        this.map = new google.maps.Map(mapCanvas, mapOptions);
        this.setUpOverlay();

    }

    componentDidMount(){
        this.setUpGmap();
    }

    render() {
        return <div id="main-map" className="gmap"></div>;
    }
}

module.exports = Map;


