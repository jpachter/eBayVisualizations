var express = require('express');
var http = require('http');
var path = require('path');
var expressConductor = require('express-conductor');

GLOBAL.app = module.exports = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(app.router);

expressConductor.init(app, {controllers: __dirname + '/routes'}, function(err, app) {
  app.listen(app.get('port'));
});

var port =process.env.PORT || 3000;
app.listen(port);

module.exports = app;
