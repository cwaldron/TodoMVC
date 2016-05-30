/*jshint strict: true, undef: true, eqeqeq: true */
/*global console, localStorage, Promise, Map */

/**
 * Creates a storage object that wraps local storage.
 *
 * @param {string} name The name of our DB we want to use
 * @param {function} callback Our fake DB uses callbacks because in
 * real life you probably would be making AJAX calls
 */

var Storage = function () {
	'use strict';
    
    var noop = function () {},
        storage = new Map(),
        defaultFilter = function (query, data) {
            for (var q in query) {
                if (query[q] !== data[q]) {
                    return false;
                }
            }
            return true;
        },
		allFilter = function(query, data) {
			return true;
		};
    
	/**
	 * Initialize the storage.
	 *
	 * @param {string} name    The name of the storage.
	 *
	 * @example
	 * storage.init("mystore");
	 */
    this.init = function (name) {
        return new Promise(function(resolve, reject) {
            try {
                if (!storage.has(name)) {
                    var store = new Map(localStorage.getItem(name));
                    storage.set(name, store);
                }
                resolve();
            }
            catch(e) {
                reject(e);
            }
        }); 
    };
    
	/**
	 * Finds items based on a query given as a JS object
	 *
	 * @param {object}     query       The query to match against (i.e. {foo: 'bar'})
	 * @param {function}   callback    The callback to fire when the query has
	 * completed running
	 *
	 * @example
	 * db.find({foo: 'bar', hello: 'world'}, function (data) {
	 *	 // data will return any items that have foo: bar and
	 *	 // hello: world in their properties
	 * });
	 */
	this.find = function (name, query, filter, callback) {
        var results = [],
            action = callback || filter,
            refine = (callback) ? filter : defaultFilter,
            store = storage.get(name);
        
        if (!store) {
            console.log("find: storage '" + name + "' not found.");
            return;
        }
        
        store.forEach(function(value) {
            if (refine(query, value)) {
                results.push(value);
            }
        });
        
		action.call(this, results);
	};

	/**
	 * Will retrieve all data from the collection
	 *
	 * @param {function} callback The callback to fire upon retrieving data
	 */
	this.findAll = function (name, callback) {
		this.find(name, {}, allFilter, function(results) {
            var action = callback || noop;
			action.call(this, results);
		});
	};
    
    /**
	 * Determines whether the storage name exists.
	 *
	 * @param {string} name    The name of the storage.
	 *
	 * @example
	 * storage.has("mystore");
	 */
    this.getItems = function (name) {
        return Array.from(storage.get(name).entries);
    };

    /**
	 * Get the count of items in the storage.
	 *
	 * @param {string} name    The name of the storage.
	 *
	 * @example
	 * storage.has("mystore");
	 */
    this.getSize = function (name) {
        return storage.get(name).entries.length;
    };
    
    /**
	 * Determines whether the storage name exists.
	 *
	 * @param {string} name    The name of the storage.
	 *
	 * @example
	 * storage.has("mystore");
	 */
    this.has = function (name) {
        return storage.has(name);
    };
    
	/**
	 * Will save the given data to the DB. If no item exists it will create a new
	 * item, otherwise it'll simply update an existing item's properties
	 *
	 * @param {object}     entity      The data to save back into the DB
	 * @param {function}   callback    The callback to fire after saving
	 */
	this.save = function (name, entity, callback) {

        // get the data store.
        this.create(name);
        var store = storage.get(name);

        // update and save the item.
        store.set(entity.id, entity);
        localStorage.setItem(name, store.toString());
        
        // call back.
		var action = callback || noop;
        action.call(this, entity);
	};

	/**
	 * Will remove an item from the Store based on its ID
	 *
	 * @param {number} id The ID of the item you want to remove
	 * @param {function} callback The callback to fire after saving
	 */
	this.remove = function (name, id, callback) {
        var store = storage.get(name);
        
        if (!store || !store.has(id)) {
            return;
        }
        
        store.delete(id);
        localStorage.setItem(name, store.toString());
        
        // call back.
		var action = callback || noop;
		action();
	};

    /**
	 * Will drop the store from the storage.
	 *
	 * @param {function} callback The callback to fire after dropping the data
	 */
    this.drop = function (name, callback) {
        if (!storage.has(name)) {
            return;
        }
        
        storage.get(name).clear();
        storage.delete(name);
		localStorage.removeItem(name);
        
        // call back.
		var action = callback || noop;
		action();
	};
	
    /**
	 * Will drop all storage and start fresh
	 *
	 * @param {function} callback The callback to fire after dropping the data
	 */
    this.clear = function (callback) {
        
        for (var key in storage.keys()) {
            this.drop(key);
        }
        
        // call back.
		var action = callback || noop;
        action();
	};
};
