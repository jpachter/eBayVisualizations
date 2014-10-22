/*global it:true describe:true */
"use strict";

var express = require('./mock/express')
  , expressConductor = require('../lib/express-conductor')
  , app

describe('Express Conductor', function(){

  beforeEach(function() {
    app = express()
  })

  it('should crawl all files and expose routes', function(done){

    expressConductor.init(app, {controllers: __dirname + '/controllers'}, function(err, app){
      app.should.have.property('routes');
      app.routes.should.have.property('/posts');
      app.routes.should.have.property('/posts/:id');
      app.routes.should.have.property('/');
      done(err);
    });

  });

  it('should work with a folder called routes as well', function(done) {
    expressConductor.init(app, {routes: __dirname + '/controllers'}, function(err, app){
      app.should.have.property('routes');
      app.routes.should.have.property('/posts');
      app.routes.should.have.property('/posts/:id');
      app.routes.should.have.property('/');
      done(err);
    });
  })

});
