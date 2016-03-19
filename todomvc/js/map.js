/*jshint strict:true, undef:true, eqeqeq:true, laxbreak:true */
/*global console */

/**
 * Creates a storage object that wraps local storage.
 *
 * @param {string} name The name of our DB we want to use
 * real life you probably would be making AJAX calls
 */

var Map = function (json) {
	'use strict';
    
    this.inherit(Map);
    
    var entries = (!json) ? [] : JSON.parse(json),
        mapper = {};

    // set up the mapper.
    entries.forEach(function(item, index) {
        mapper[item.key] = {'entry': {'key': item.key, 'value': item.value}, 'index' : index};
    });
    
    
    /**
	 * Gets the size of the map.
	 *
	 * @example
	 * var count = map.size;
	 */
    Object.defineProperty(this, 'size', {
        get: function() {
            return entries.length;
        },
        enumerable: true
    });
    

    /**
	 * Determines whether the storage name exists.
	 *
	 * @param {string} name    The name of the storage.
	 *
	 * @example
	 * storage.has("mystore");
	 */
    this.clear = function () {
        entries = [];
        for (var prop in mapper){
            if (mapper.hasOwnProperty(prop)){
                delete mapper[prop];
            }
        }
    };
    

    /**
	 * Determines whether the storage name exists.
	 *
	 * @param {string} name    The name of the storage.
	 *
	 * @example
	 * storage.delete("mystore");
	 */
    this.delete = function (key) {
        if (this.has(key)) {
            var collection = [],
                found = 0;
            for (var ii = 0; ii < entries.length; ++ii) {
                if (entries[ii].key !== key) {
                    collection.push(entries[ii]);
                    mapper[entries[ii].key].index = (ii - found);
                } else {
                    found = 1;
                }
            }
            entries = collection;
            delete mapper[key];
        }
    };
    
	/**
	 * Gets the collection of map entries.
	 *
	 * @example
	 * map.entries;
	 */
    Object.defineProperty(this, 'entries', {
        get: function() {
            return entries;
        },
        enumerable: true
    });
    
    /**
	 * Determines whether the storage name exists.
	 *
	 * @param {string} name    The name of the storage.
	 *
	 * @example
	 * storage.has("mystore");
	 */
    this.forEach = function (callback, thisArg) {
        var thisParam = thisArg || this;
        
        for (var ii = 0; ii < entries.length; ++ii) {
            if (callback.call(thisParam, entries[ii].key, entries[ii].value) === true)
                break;
        }
    };
    
    
	/**
	 * Determines whether the storage name exists.
	 *
	 * @param {string} name    The name of the storage.
	 *
	 * @example
	 * storage.has("mystore");
	 */
    this.get = function (key) {
        return this.has(key) ? mapper[key].entry.value : undefined;
    };
    
    
	/**
	 * Determines whether the storage name exists.
	 *
	 * @param {string} name    The name of the storage.
	 *
	 * @example
	 * storage.has("mystore");
	 */
    this.has = function (key) {
        return mapper.hasOwnProperty(key);
    };
    
	/**
	 * Determines whether the storage name exists.
	 *
	 * @param {string} name    The name of the storage.
	 *
	 * @example
	 * storage.has("mystore");
	 */
    this.keys = function () {
        var results = [];
        for (var ii = 0; ii < entries.length; ++ii) {
            results.push(entries[ii].keys);
        }
        return results;
    };
    

	/**
	 * Determines whether the storage name exists.
	 *
	 * @param {string} name    The name of the storage.
	 *
	 * @example
	 * storage.has("mystore");
	 */
    this.set = function (key, value) {
        var info = this.has(key)
            ? mapper[key]
            : {entry: {'key': key, 'value': undefined}, 'index' : undefined};
        
        info.entry.value = value;
        var index = info.index;
        if (index !== undefined) {
            entries[index] = info.entry;
        } else {
            index = entries.length;
            entries.push(info.entry);
            info.index = index;
        }
        
        mapper[key] = info;
    };
    
    
	/**
	 * Determines whether the storage name exists.
	 *
	 * @param {string} name    The name of the storage.
	 *
	 * @example
	 * storage.has("mystore");
	 */
    this.values = function () {
        var results = [];
        for (var ii = 0; ii < entries.length; ++ii) {
            results.push(entries[ii].value);
        }
        return results;
    };
    
    
	/**
	 * Converts map to JSON string.
	 *
	 * @param {string} name    The name of the storage.
	 *
	 * @example
	 * storage.has("mystore");
	 */
    this.toString = function () {
        return JSON.stringify(entries);
    };
};
