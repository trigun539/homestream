'use strict';

var express = require('express'),
app         = express(),
bodyParser  = require('body-parser'),
fs          = require('fs'),
_           = require('underscore');

/**
 * DB Stuff
 */
var locations = [
  { path: '/Users/eperez/homevideos', name: 'homevideos'},
  { path: '/Users/eperez/Movies', name: 'Movies' }
];

/**
*	Configuring Express
*/
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.set('views', __dirname + '/views');
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

// Setting locations
_.each(locations, function(loc){
  app.use(express.static(loc.path));
});

/**
*	Routes
*/
app.get('/', function (req, res, next) {
  res.render('index.ejs');
});

/**
 * API
 */

function getFiles(path, callback){
  fs.readdir(path, function(err, files){
    if(err){
      console.log(err);
      callback(err, null);
    }else{
      files = _.filter(files, function(file){
        if(file !== '.DS_Store'){
          return true;
        }
      });
      callback(null, files);
    }
  });
}

app.get('/api/files', function(req, res, next){
  var path = req.query.path || null;

  if(path){
    var pathArr  = path.split('/'),
    locationName = pathArr.splice(0,1)[0];

    _.each(locations, function(loc){
      if(loc.name === locationName){
        getFiles(loc.path + '/' + pathArr.join('/'), function(err, files){
          if(err){
            console.log(err);
            next(err);
          }else{
            res.send(files);
          }
        });
      }
    });
  }else{
    var files = [];
    _.each(locations, function(loc){
      files.push(loc.name);
    });
    res.send(files);
  }
});

/**
*	Initializing Server
*/ 
var server = app.listen(3002, function () {
  console.log('App listening at http://localhost:3002');
});

module.exports = server;