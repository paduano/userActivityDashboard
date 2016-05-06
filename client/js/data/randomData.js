var gaussian = require('gaussian');
var Colors = require('Colors');


function generateClusters() {
    var n_clusters = 5 + Math.floor(Math.random()*10);
    var clusters = [];

    for(let i = 0; i < n_clusters; i++){
        let dist = 0.08;
        let l = -dist/2 + dist*Math.random();
        let r = -dist/2 + dist*Math.random();
        clusters.push({
            lat: 37.759506 + l,
            lng: -122.433998 + r
        });
    }
    return clusters;
}

function generateFakeUsers(n, clusters){
    var u = [];

    var distribution = gaussian(0, 1);

    for(let i = 0; i < n; i++){
        var c = _.sample(clusters);

        let l = distribution.ppf(Math.random())/100;
        let r = distribution.ppf(Math.random())/100;
        u.push({
            lat: c.lat + l,
            lng: c.lng + r
        });
    }
    return u;
}


function generatePlaces(n) {
    var cs = generateClusters();

    return generateFakeUsers(n, cs).map(p => {
        return Object.assign(
            {
                type: _.sample(['restaurant', 'bar', 'entertainment']),
                popularity: Math.random()*10
            }
            , p);
    });

}


/**
 * Return the mock data structure that should be used
 * in the real case.
 *
 * Given the bounds, returns an object with the described structure
 * (NB, the bounds returned don't have to be the same of the one passed,
 * they can be slightly different due to optimization problems)

 *
 * @bounds [{lat:, lon:},{lat:, lon:}] with the google maps
 *  convention (south-west latitude, longitude),(north-east latitude, longitude)
 *
 *
 * @returns
 * {
 *
 *      bounds: [{lat:, lon:},{lat:, lon:}],
 *      grid: [N x M]
 *
 * }
 */
function generateUsersGrid(bounds, users) {

    var grid = [];
    var subdv = 15;
    var lngTile = (bounds[1].lng - bounds[0].lng)/subdv;
    var latTile = (bounds[1].lat - bounds[0].lat)/subdv;

    var maxValue = 1;

    for(let x = 0; x < subdv; x++) {
        let row = [];
        for(let y = 0; y < subdv; y++) {

            var ne = new google.maps.LatLng(bounds[0].lat + (latTile * (y + 1)),
                bounds[0].lng + (lngTile * (x + 1))
            );

            var sw = new google.maps.LatLng(bounds[0].lat + (latTile * (y)),
                bounds[0].lng + (lngTile * (x))
            )

            var gbounds = new google.maps.LatLngBounds(sw, ne);
            //count the number of users in the region
            var count = users.filter(u => {
                return gbounds.contains(new google.maps.LatLng(u.lat, u.lng));
                    //u.lng < bounds[0].lng + (lngTile * (x + 1)) &&
                    //u.lng > bounds[0].lng + (lngTile * (x)) &&
                    //u.lat < bounds[0].lat + (latTile * (y + 1)) &&
                    //u.lat > bounds[0].lng + (latTile * (y))
            }).length;

            maxValue = count > maxValue? count : maxValue;

            row.push(count);
        }
        grid.push(row);
    }

    return {
        bounds: bounds,
        grid: grid,
        maxValue: maxValue
    }

}


function generateUserSeries(){

    return this.data = {
        series : [
            {
                name: 'all-users',
                label: 'overall users',
                values: [
                    {date:'2015-01-01', value:10},
                    {date:'2015-02-01', value:20},
                    {date:'2015-03-01', value:30},
                    {date:'2015-04-01', value:50},
                    {date:'2015-05-01', value:70},
                    {date:'2015-06-01', value:80},
                    {date:'2015-07-01', value:120},
                    {date:'2015-08-01', value:150},
                    {date:'2015-09-01', value:160},
                    {date:'2015-10-01', value:190},
                    {date:'2015-11-01', value:210},
                ], //{date:'2015-12-25', value:}
                color: Colors.allUser
            },
            {
                name: 'active-users',
                label: 'active users',

                values: [
                    {date:'2015-01-01', value:10},
                    {date:'2015-02-01', value:10},
                    {date:'2015-03-01', value:7},
                    {date:'2015-04-01', value:15},
                    {date:'2015-05-01', value:30},
                    {date:'2015-06-01', value:34},
                    {date:'2015-07-01', value:32},
                    {date:'2015-08-01', value:48},
                    {date:'2015-09-01', value:70},
                    {date:'2015-10-01', value:80},
                    {date:'2015-11-01', value:110}
                ],
                color: Colors.activeUser
            }
        ]
    }

}



module.exports = {
    generateFakeUsers : generateFakeUsers,
    generateUsersGrid : generateUsersGrid,
    generateClusters : generateClusters,
    generatePlaces : generatePlaces,
    generateUserSeries : generateUserSeries
};