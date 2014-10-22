"use strict";

module.exports.init = function(app) {
  app.get('/', index);
};

function index(req, res, next) {
  res.send('Good job');
}
