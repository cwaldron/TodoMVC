/*jshint strict:true, undef:true, eqeqeq:true, laxbreak:true */
/*global console */

/**
 * The map class is a collection that combines sequential access to 
 * an association.
 *
 * @class
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
	 * Gets the key-value pair at a particular index.
	 *
	 * @param {number} index	The sequence index.
	 *
	 * @example
	 * map.at(0);
	 */
    this.at = function (index) {
        return 	{ key: entries[index].key, value: entries[index].value };
    };
	
    /**
	 * Clears the entries from the map.
	 *
	 * @example
	 * map.clear();
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
	 * Deletes entry from the map.
	 *
	 * @param {string} key     The key of the entry to remove from map.
	 *
	 * @example
	 * map.delete("mystore");
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
	 * Executes a callback for each key/value pair in the map.
	 *
	 * @param {function}   callback        Callback to execute for each element.
	 * @param {object}     thisArg         The scope of the callback.
	 *
	 * @example
     * map.forEach(function(value, key, index) {
     *    ...
     * });
	 */
    this.forEach = function (callback, thisArg) {
        var scope = thisArg || this;
        
        for (var ii = 0; ii < entries.length; ++ii) {
            if (callback.call(scope, entries[ii].value, entries[ii].key, ii) === true)
                break;
        }
    };
    
	/**
	 * Gets the value associated with the specified key.
	 *
	 * @param {string} key     The key of the associated mapped value.
	 *
	 * @example
	 * var value = map.key("mykey");
	 */
    this.get = function (key) {
        return this.has(key) ? mapper[key].entry.value : undefined;
    };
    
	/**
	 * Determines whether the specified key exists in the map.
	 *
	 * @param {string} key     The key of the associated mapped value.
	 *
     * @returns {boolean}      Returns true if the key exists in the map; otherwise false.
	 *
	 * @example
	 * map.has("mykey");
	 */
    this.has = function (key) {
        return mapper.hasOwnProperty(key);
    };
    
	/**
	 * Returns a collection of the map keys.
	 *
	 * @example
	 * map.keys();
	 */
    this.keys = function () {
        var results = [];
        for (var ii = 0; ii < entries.length; ++ii) {
            results.push(entries[ii].keys);
        }
        return results;
    };
    
	/**
	 * Assign a value referenced by a key.
	 *
	 * @param {string} key     The key of the associated mapped value.
	 * @param {object} value   The value to associate with the key.
	 *
	 * @example
	 * map.set(key, value);
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
	 * Retuns a collection of the mapped values.
	 *
	 * @example
	 * map.values();
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
	 * @example
	 * map.toString();
	 */
    this.toString = function () {
        return JSON.stringify(entries);
    };
};
