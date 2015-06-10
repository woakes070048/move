#!/usr/bin/env node
/*eslint-env node */
'use strict';

var pkg = require('../package.json');

var prefix = process.argv[2] || '';
var cordovaPlugin = 'cordova-plugin-';

function isCordovaPlugin(dependency) {
  return dependency.slice(0, cordovaPlugin.length) === cordovaPlugin;
}

function addPrefix(plugin) {
  return prefix + plugin;
}

var result = Object.keys(pkg.devDependencies)
  .filter(isCordovaPlugin)
  .map(addPrefix);

result = result.join(' ');
console.log(result);
