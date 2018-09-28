'use strict';

var express = require('express');
var router = express.Router();
var debug = require('debug')('express-middleware-module-loader');

var fs = require('fs');
var path = require('path');

// Hooks Cache
var hooks_cache = {};

// Load all the hooks
function loadHooksFromDirectory(search_dir) {
    var search_path = path.resolve(search_dir);

    debug("Search path:",search_path);

    fs.readdirSync(search_dir).forEach(function (hook_name) {

        if (fs.statSync(path.join(search_dir, hook_name)).isDirectory()) {
            debug("Found hook:", hook_name);

            let hook_dir = path.join(search_path, hook_name);

            debug("Loading from:", hook_dir);
            hooks_cache[hook_name] = require(hook_dir);

            var hook_handle = '/' + hook_name;

            debug("Adding hook route:", hook_handle);
            router.use(hook_handle, hooks_cache[hook_name]);
        }

    });
}

var getHooks = function () {
    return Object.keys(hooks_cache);
}

var loadModule = function (dirs = []) {
    debug("dirs:", dirs);

    if (typeof dirs == 'string') {
        debug("dirs argument is a string. Converting to array.");
        dirs = [dirs];
    }

    if (dirs === undefined || !(Array.isArray(dirs)))
        throw new Error("Invalid dirs argument:\n" + dirs);

    if (dirs.length < 1)
        throw new Error("Empty dirs argument:\n" + dirs);

    dirs.forEach(function (dir) {
        debug("Loading hooks from directory:", dir);
        loadHooksFromDirectory(dir);
    })

    return router;
};

module.exports = loadModule;

module.exports.getHooks = getHooks;

exports = module.exports;