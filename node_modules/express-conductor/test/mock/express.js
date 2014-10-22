"use strict";

function App() {
  if(!(this instanceof App))
    return new App();

  this.routes = {};
}

App.prototype.get = function(route, action) {
  this.routes[route] = action;
};

module.exports = App;
