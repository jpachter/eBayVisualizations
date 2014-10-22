"use strict";

module.exports.init = function(app) {
  app.get('/posts', getPosts);
};

function getPosts(req, res, next) {
  res.send('posts');
}
