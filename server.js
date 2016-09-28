'use strict';
var config = require('./gulp.config');

var express = require('express'),
  env = process.env.NODE_ENV = process.env.NODE_ENV || 'dev',
  app = express(),
  port = process.env.PORT || 451;

const crypto = require('crypto');

// Used to check auto-login param security
app.use('/checklogin/:t/:ts', function (req, res, next) {
  console.log(process.env.HASH_SECRET);
  var hashResult = validateTimeHash(req.params.t, req.params.ts);
  res.send(hashResult);
});

app.get("/communityUrl", function(request, response) {
  response.json(process.env.COMMUNITY_URL);
});

switch (env) {
  case 'production':
    console.log('*** PROD ***');
    app.use(express.static(config.root + config.compile.replace('.', '')));
    app.get('/*', function(req, res) {
      res.sendFile(config.root + config.compile.replace('.', '') + 'index.html');
    });
    break;
  default:
    console.log('*** DEV ***');
    app.use(express.static(config.root + config.build.replace('.', '')));
    app.use(express.static(config.root + config.src.replace('.', '') + 'app/'));
    app.use(express.static(config.root));
    app.use(express.static(config.root + config.components.dir));
    app.get('/*', function(req, res) {
      res.sendFile(config.root + config.build.replace('.', '') + 'index.html');
    });
    break;
}

app.listen(port);
console.log('Listening on port ' + port + '...');

function validateTimeHash(t, ts) {
  if (!t || !ts) {
    return false;
  }

  var secret = process.env.HASH_SECRET;
  var hash = crypto.createHmac('sha256', secret)
                 .update(t)
                 .digest('hex');

  return ts == hash;
}
