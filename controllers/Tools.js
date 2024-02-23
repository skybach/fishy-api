'use strict';

var utils = require('../utils/writer.js');
var Tools = require('../service/ToolsService');

module.exports.lookup_domain = function lookup_domain (req, res, next) {
  var domain = req.swagger.params['domain'].value;
  Tools.lookup_domain(domain)
    .then(function (response) {
      response.client_ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress; // get request ip or x-fwded ip
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response, 400);
    });
};

module.exports.validate_ip = function validate_ip (req, res, next) {
  var request = req.swagger.params['request'].value;
  Tools.validate_ip(request)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response, 400);
    });
};
