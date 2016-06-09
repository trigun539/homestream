'use strict';

var express     = require('express'),
app             = express(),
bodyParser      = require('body-parser'),
fs              = require('fs'),
_               = require('underscore'),
morgan          = require('morgan'),
method_override = require('method-override'),
sqlite3         = require('sqlite3').verbose(),
db              = new sqlite3.Database('homestream.db');

/**
 * DB Stuff
 */


db.serialize(function() {
  db.run("CREATE TABLE if not exists locations (name TEXT PRIMARY KEY, path TEXT)");
});

/**
*	Configuring Express
*/
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.set('views', __dirname + '/views');
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(method_override());
app.use(morgan('tiny'));

// Setting locations
db.all("SELECT * FROM locations", function(err, rows) {
  if(err){
    console.log(err);
  }else{
    var locations = [];
    _.each(rows, function(row){
      app.use(express.static(row.path));
    });
  }
});

/**
*	Routes
*/
app.get('/', function (req, res, next) {
  res.render('index.ejs');
});

app.get('/video', function (req, res, next) {
  res.render('video.ejs', {videoURL: req.query.videoURL});
});

app.get('/audio', function (req, res, next) {
  res.render('audio.ejs', {audioURL: req.query.audioURL});
});

app.get('/settings', function(req, res, next){
  res.render('settings.ejs');
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

app.get('/api/locations', function(req, res, next){
  db.all("SELECT * FROM locations", function(err, rows) {
    if(err){
      console.log(err);
      next(err);
    }else{
      var locations = [];
      _.each(rows, function(row){
        locations.push(row.name);
      });
      res.send(locations);
    }
  });
});

app.post('/api/locations', function(req, res, next){
  var location = req.body || null;

  if('name' in location && 'path' in location){
    var query = 'INSERT into locations(name,path) VALUES ("' + location.name + '", "' + String(location.path) + '")';
    db.run(query, function(err){
      if(err){
        console.log(err);
        next(err);
      }else{
        res.status(200).send();
      }
    });
  }
});

app.delete('/api/locations/:location', function(req, res, next){
  var name = req.params.location || null;
  if(name){
    var query = 'DELETE FROM locations WHERE name="' + name + '"';
    db.run(query, function(err){
      if(err){
        console.log(err);
        next(err);
      }else{
        res.status(200).send();
      }
    });
  }else{
    res.status(400).send('Location not found.');
  }
});

app.get('/api/files', function(req, res, next){
  var path = req.query.path || null;

  if(path){
    var pathArr  = path.split('/'),
    locationName = pathArr.splice(0,1)[0];

    db.all("SELECT * FROM locations", function(err, rows) {
      if(err){
        console.log(err);
        next(err);
      }else{
        _.each(rows, function(loc){
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
      }
    });
  }else{
    db.all("SELECT * FROM locations", function(err, rows) {
      if(err){
        console.log(err);
        next(err);
      }else{
        var locations = [];
        _.each(rows, function(row){
          locations.push(row.name);
        });
        res.send(locations);
      }
    });
  }
});

/**
*	Initializing Server
*/ 
var server = app.listen(46005, function () {
  console.log('App listening at http://localhost:46005');
});

module.exports = server;
