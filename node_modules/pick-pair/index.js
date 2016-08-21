'use strict';

var isObject = require('is-object');
var pickKey  = require('pick-key');


module.exports = function (object) {

  var ret = {};

  if (object && isObject(object)) {
    var key = pickKey(object);

    if (key) {
      ret[key] = object[key];
    }
  }

  return ret;
};
