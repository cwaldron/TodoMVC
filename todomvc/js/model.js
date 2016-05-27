/* jshint strict: true, undef: true, eqeqeq: true, laxbreak: true */
/* globals console, Dispatcher, Storage */

/**
 * The base model class.
 *
 * @class
 */
function Model(name) {
    "use strict";
    
    this.inherit(Model, Dispatcher);
    
	var dbName, 
		storage = new Storage();
	
	/**
	 * size property.
	 */
	Object.defineProperty(this, 'size', {
		get: function() { return storage.get(dbName).size; },
		enumerable: true,
		configurable: false
	});	   
    
	/**
	 * Initialize the model.
     * 
     * @returns {Promise}   Resource acquisition promise.
	 */
    this.init = function(name) {
        dbName = name;
        return storage.init(dbName);
    };
	
	/**
	 * Add a new todo item
	 *
	 * @param {string} [title] The title of the task
	 * @param {function} [callback] The callback to fire after the model is created
	 */
	this.add = function(item, callback) {
		storage.save(dbName, item, callback);
	};
	
	/**
	 * Finds and returns a model in storage. If no query is given it'll simply
	 * return everything. If you pass in a string or number it'll look that up as
	 * the ID of the model to find. Lastly, you can pass it an object to match
	 * against.
	 *
	 * @param {string|number|object} [query] A query to match models against
	 * @param {function} [callback] The callback to fire after the model is found
	 *
	 * @example
	 * model.find(1, func); // Will find the model with an ID of 1
	 * model.find('1'); // Same as above
	 * //Below will find a model with foo equaling bar and hello equaling world.
	 * model.find({ foo: 'bar', hello: 'world' });
	 */
	this.find = function(query, callback) {
		var queryType = typeof query;
		var action = callback || function () {};

		if (queryType === 'function') {
			action = query;
			return storage.findAll(dbName, action);
		} else if (queryType === 'string') {
			storage.find(dbName, { id: query }, action);
		} else if (queryType === 'number') {
			query = parseInt(query, 10);
			storage.find(dbName, { id: query }, action);
		} else {
			storage.find(dbName, query, action);
		}
	};
	
	/**
	 * Get all items
	 */
	this.getItems = function() {
        return storage.getItems(dbName);
	};
	
	/**
	 * Removes a model from storage
	 *
	 * @param {number} id The ID of the model to remove
	 * @param {function} callback The callback to fire when the removal is complete.
	 */
	this.remove = function(id, callback) {
		storage.remove(dbName, id, callback);
	};

	/**
	 * WARNING: Will remove ALL data from storage.
	 *
	 * @param {function} callback The callback to fire when the storage is wiped.
	 */
	this.removeAll = function(callback) {
		storage.drop(dbName, callback);
	};
	
	/**
	 * Saves an item.
	 *
	 * @param {object}	   item            The item to save.
	 * @param {function}   callback        The callback to fire when saving is complete.
	 */
	this.save = function(item, callback) {
		storage.save(dbName, item, callback);
	};    
}
