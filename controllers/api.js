'use strict';

/**
* API
*/

var _ = require('underscore');

var locations = [
  '/Users/eperez/apps/homestream/public/videos', 
  '/Users/eperez/videos',
  '/Users/eperez/Movies'
];

// Locations
app.get('/api/locations', function(req, res, next){
  var locNameArr = [];
  _.each(locations, function(loc){
    var tempHold = loc.split('/');
    locNameArr.push({
      path: loc,
      name: tempHold[tempHold.length - 1]
    });
  });

  res.send(locNameArr);
});