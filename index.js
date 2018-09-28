'use strict';

var express = require('express');
var router = express.Router();
var debug = require('debug')('express-middleware-module-loader');

var fs = require('fs');
var path = require('path');

// Modules Cache
var modules_cache = {};

// Load all the modules
function loadModulesFromDirectory(search_dir) {
    var search_path = path.resolve(search_dir);

    debug("Search path:",search_path);

    fs.readdirSync(search_dir).forEach(function (module_name) {

        if (fs.statSync(path.join(search_dir, module_name)).isDirectory()) {
            debug("Found module:", module_name);

            let module_dir = path.join(search_path, module_name);

            debug("Loading from:", module_dir);
            modules_cache[module_name] = require(module_dir);

            var module_handle = '/' + module_name;

            debug("Adding module route:", module_handle);
            router.use(module_handle, modules_cache[module_name]);
        }

    });
}

var getModulesList = function () {
    return Object.keys(modules_cache);
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
        debug("Loading modules from directory:", dir);
        loadModulesFromDirectory(dir);
    })

    router.getModulesList = getModulesList;

    return router;
};

module.exports = loadModule;

exports = module.exports;