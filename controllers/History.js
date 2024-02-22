'use strict';

var utils = require('../utils/writer.js');
var History = require('../service/HistoryService');

module.exports.queries_history = function queries_history (req, res, next) {
  History.queries_history()
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};
