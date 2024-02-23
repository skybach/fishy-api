'use strict';

var utils = require('../utils/writer.js');
var Info = require('../service/InfoService');

module.exports.info = function info (req, res, next) {
  Info.info()
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response, 400);
    });
};
