"use strict";

module.exports.init = function(app) {
  app.get('/posts/:id', showPosts);
};

function showPosts(req, res, next) {
  res.send('post');
}
