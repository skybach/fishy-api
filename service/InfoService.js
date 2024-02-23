'use strict';
var fs = require('fs'), path = require('path');
var jsyaml = require('js-yaml');

/**
 * API Info
 * Info
 *
 * returns List
 **/
exports.info = function() {
  var spec = fs.readFileSync(path.join(__dirname,'../api/swagger.yaml'), 'utf8');
  var swaggerDoc = jsyaml.load(spec);

  return new Promise(function(resolve, reject) {
    var info = {
      version: swaggerDoc.info.version,
      date: Date.now(),
      kubernetes: process.env.IS_KUBERNETES==='true'
    };

    resolve(info);
  });
}

