'use strict';
var config = require('./gulp.config');

var express = require('express'),
  env = process.env.NODE_ENV = process.env.NODE_ENV || 'dev',
  app = express(),
  port = process.env.PORT || 451;

const crypto = require('crypto');

// Used to check auto-login param security
app.use('/checklogin/:t/:ts', function (req, res, next) {
  console.log(req.params);
  var hashResult = validateTimeHash(req.params.t, req.params.ts);
  res.send(hashResult);
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

  // TODO: Remove after testing!
  if(!process.env.HASH_SECRET) {
    process.env['HASH_SECRET'] = "xB+EPTs3FPM7C+Nr0eNJcHnuD26DReJFwjU9X0wmJJY="
  }

  var secret = process.env.HASH_SECRET;
  console.log(secret);

  var hash = crypto.createHmac('sha256', secret)
                 .update(t)
                 .digest('hex');

  //console.log("CONVERTED");
  //console.log(hash);

  return ts == hash;
}
