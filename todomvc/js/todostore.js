/*jshint strict:true, undef:true, eqeqeq:true, laxbreak:true */
/* globals $, console, document, Model, Subscriber, Storage, TodoItem */

/**
 * The todos storage model.
 *
 * @class
 */
function TodoStore() {
	"use strict";
	
	this.inherit(TodoStore, Model);
	
	var DBNAME = 'todos',
		storage = new Storage(),
		noop = function() {};
	
	storage.create(DBNAME);
	
	/**
	 * size property.
	 */
	Object.defineProperty(this, 'size', {
		get: function() { return storage.get(DBNAME).size; },
		enumerable: true,
		configurable: false
	});	   
	
	/**
	 * Creates a new todo model
	 *
	 * @param {string} [title] The title of the task
	 * @param {function} [callback] The callback to fire after the model is created
	 */
	this.create = function(title, callback) {
		title = title || '';
		var todo = new TodoItem(title);
		storage.save(DBNAME, todo, callback);
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
			return storage.findAll(DBNAME, action);
		} else if (queryType === 'string') {
			storage.find(DBNAME, { id: query }, action);
		} else if (queryType === 'number') {
			query = parseInt(query, 10);
			storage.find(DBNAME, { id: query }, action);
		} else {
			storage.find(DBNAME, query, action);
		}
	};
	
	/**
	 * Returns a count of all todos
	 */
	this.getStats = function(callback) {
		var results = storage.getItems(DBNAME);
		var stats = { active: 0, completed: 0, total: results.length};
		results.forEach(function(item) {
			if (item.value.completed) {
				stats.completed++;
			} else {
				stats.active++;
			}
		});

		callback(stats);
	};
	
	/**
	 * Removes a model from storage
	 *
	 * @param {number} id The ID of the model to remove
	 * @param {function} callback The callback to fire when the removal is complete.
	 */
	this.remove = function(id, callback) {
		storage.remove(DBNAME, id, callback);
	};

	/**
	 * WARNING: Will remove ALL data from storage.
	 *
	 * @param {function} callback The callback to fire when the storage is wiped.
	 */
	this.removeAll = function(callback) {
		storage.drop(DBNAME, callback);
	};
	
	/**
	 * Updates a model by giving it an ID, data to update, and a callback to fire when
	 * the update is completed.
	 *
	 * @param {object}	   entity	   The properties to update and their new value
	 * @param {function}   callback	   The callback to fire when the update is complete.
	 */
	this.save = function(entity, callback) {
		var todo = new TodoItem(entity.id, entity.title, entity.completed);
		storage.save(DBNAME, todo, callback);
	};
}
