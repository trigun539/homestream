var express     = require('express'),
app             = express(),
path            = require('path'),
bodyParser      = require('body-parser'),
fs              = require('fs'),
_               = require('underscore'),
morgan          = require('morgan'),
method_override = require('method-override'),
Datastore       = require('nedb');

var PORT = process.env.PORT || 46005;

/**
 * DB Stuff
 */

var db = {};

// Creating locations collection
db.locations = new Datastore({ filename: path.join(__dirname, 'locations.db'), autoload: true });

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

db.locations.find({}, (err, rows) => {
  if (err) {
    console.log(err);
  } else {
    var locations = [];
    _.each(rows, function(row){
      app.use(`/${row.name}`, express.static(path.resolve(row.path)));
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
  res.render('video.ejs', {videoURL: req.query.videoURL.replace('#', '')});
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
  db.locations.find({}, (err, docs) => {
    if(err){
      console.log(err);
      next(err);
    }else{
      console.log('the locations: ', docs);
      var locations = [];
      _.each(docs, function(row){
        locations.push(row.name);
      });
      res.send(locations);
    }
  });
});

app.post('/api/locations', function(req, res, next){
  var location = req.body || null;

  if('name' in location && 'path' in location){
    db.locations.insert(location, (err, newDoc) => {
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
  if(name) {
    db.locations.remove({ name: name }, (err, numRemoved) => {
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

    db.locations.find({}, (err, rows) => {
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
    db.locations.find({}, (err, rows) => {
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

app.get('/api/audio', function (req, res) {
		console.log('api audioURL', req.query.audioURL);
		res.set({'Content-Type': 'audio/mpeg'});
    var readStream = fs.createReadStream(req.query.audioURL);
    readStream.pipe(res);
});

/**
*	Initializing Server
*/ 
var server = app.listen(PORT, function () {
  console.log(`App listening at http://localhost:${PORT}`);
});

module.exports = server;
