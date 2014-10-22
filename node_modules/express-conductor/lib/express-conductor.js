"use strict";

var fs = require('fs')
  , waitress = require('waitress')
  ;

module.exports.init = function(app, options, cb){
  initialize(
      app //Always send app first
    , options  //options second
    , cb  //and cb last
    , initControllers
  );

};

function initControllers(app, options, next){
  //Make sure we are async
  process.nextTick(function(){
    if(options.controllers || options.routes){
      var path = options.controllers || options.routes
        , controllers = {}
        ;

      loadDir(path, null, controllers, function(err){
        for(var c in controllers){
          controllers[c].init(app); //Setting routes
        }
        next();
      });
    }
    else
      next();
  });
}

function loadDir(root, path, entities, cb) {
  cb = cb || function(){};
  path = path || root;

  var files = fs.readdirSync(path);
  files.forEach(function inspectFile(file) {
    var fullPath = path + '/' + file;
    var stats = fs.statSync(fullPath);
    if (stats.isFile()) {
      matchFile(root, fullPath, entities);
    } else if (stats.isDirectory()) {
      loadDir(root, fullPath, entities);
    }
  });

  cb(null, entities);
}

function matchFile(root, file, entities) {
  var match = /^(.*?\/([A-Za-z_]*))\.js$/.exec(file);
  if (match) {
    var name = match[1].replace(root, '');
    entities[name] = require(file);
  }
}

function initialize(app, options, cb /* , arguments */){
  var args = arguments
    , i = 3
    , done = waitress(args.length - 3, function(err){
      cb(err, app);
    });


  for(i ; i < args.length; ++i){
    args[i](app, options, done);
  }
}
