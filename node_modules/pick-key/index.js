'use strict';

var keys     = require('object-keys');
var isObject = require('is-object');
var pickItem = require('pick-item');


module.exports = function (object) {

  if (!object || !isObject(object)) {
    return undefined;
  }

  var names  = keys(object);
  var length = names.length;

  if (!length) {
    return undefined;
  }

  return pickItem(names);
};
