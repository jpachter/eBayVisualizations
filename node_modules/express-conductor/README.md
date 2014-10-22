<img src="express-conductor.png" alt="Express Conductor" />

A library for moving your express routes/controllers out of your app file.

##Status:
[![Build Status](https://travis-ci.org/taterbase/express-conductor.png)](https://travis-ci.org/taterbase/express-conductor)

##Usage:

Require express-conductor and after configuring your app file, pass it in detailing the location of your routes and controllers.

```javascript
var expressConductor = require('express-conductor');

/*
 * Normal express setup...
 */

expressConductor.init(app, {controllers: __dirname + '/controllers'}, function(err, app){
  http.createServer(app).listen(PORT, function(){
    console.log("Express server listening on port " + PORT);
  });
});
```

Inside your routes/controllers folder you can structure your files however you want. 
Express-conductor will traverse folders and grab any file. You can have a simple file layout

```
controllers
├── index.js
└── posts.js
```

Or you can have a nested structure to imitate actions

```
controllers
├── Posts
|   ├── show.js
|   ├── create.js
|   └── etc...
└── Comments
    ├── show.js
    ├── create.js
    └── etc...
```

Express-conductor will grab them all. Just expose an init function and define your routes accordingly.

```javascript
module.exports.init = function(app){
  app.get('/posts/:id', showPost);
};

function showPost(req, res){
  //Show post
}
```

##Testing
Be sure to install the dev dependencies and just run `npm test`

##License
MIT
