var express = require('express'),
app         = express(),
bodyParser  = require('body-parser'),
fs          = require('fs'),
_           = require('underscore');

/**
*	Configuring Express
*/
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.set('views', __dirname + '/views');
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

/**
*	Routes
*/
app.get('/', function (req, res) {
  fs.readdir(__dirname + '/public/videos', function(err, files){
    if(err){
      next(err);
    }else{
      files = _.filter(files, function(file){
        if(file !== '.DS_Store'){
          return true;
        }
      });
      res.render('index.ejs', {files: files});
    }
  });
});

app.get('/play', function (req, res) {
  var url = req.query.url || null;

  if(url){
    res.render('video.ejs', { videoURL: url });
  }else{
    res.status(400).send('No video chosen.');
  }
});

/**
* API
*/

app.get('/api/videos', function(req, res, next){
  fs.readdir(__dirname + '/public/videos', function(err, files){
    if(err){
      next(err);
    }else{
      files = _.filter(files, function(file){
        if(file !== '.DS_Store'){
          return true;
        }
      });
      res.send(files);
    }
  });
});

app.get('/api/videos/*', function(req, res, next){
  var params = req.params['0'] || null;

  if(params){
    var folderPath = __dirname + '/public/videos/',
    folders        = params.split('/');

    if(folders.length > 0){
      
      for(var i = 0; i < folders.length; i++){
        if(i !== folders.length - 1 ){
          folderPath += folders[i] + '/';
        }else{
          folderPath += folders[i];
        }
      }
    }

    fs.readdir(folderPath, function(err, files){
      if(err){
        next(err);
      }else{
        files = _.filter(files, function(file){
          if(file !== '.DS_Store'){
            return true;
          }
        });
        res.send(files);
      }
    });
  }else{
    req.status(400).send('No folder found.');
  }
});

// First Level
app.get('/*', function(req, res, next){
  var params = req.params['0'] || null;
  
  if(params){
    var folderPath = __dirname + '/public/videos/',
    folders        = params.split('/');

    if(folders.length > 0){
      
      for(var i = 0; i < folders.length; i++){
        if(i !== folders.length - 1 ){
          folderPath += folders[i] + '/';
        }else{
          folderPath += folders[i];
        }
      }
    }

    fs.readdir(folderPath, function(err, files){
      if(err){
        next(err);
      }else{
        files = _.filter(files, function(file){
          if(file !== '.DS_Store'){
            return true;
          }
        });
        res.render('index.ejs', {files: files, folders: folders });
      }
    });
  }else{
    req.status(400).send('No folder found.');
  }
});

/**
*	Initializing Server
*/ 
var server = app.listen(8006, function () {
  console.log('App listening at http://localhost:8006');
});