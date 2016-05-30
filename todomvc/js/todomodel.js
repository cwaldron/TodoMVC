/*jshint strict:true, undef:true, eqeqeq:true, laxbreak:true */
/* globals $, console, document, Model, Subscriber, Storage, TodoItem */

/**
 * The todos storage model.
 *
 * @class
 */
function TodoModel() {
	"use strict";
	
	this.inherit(TodoModel, Model);
	
	var self = this,
        DBNAME = 'todos';
    
	/**
	 * Initialize the model.
     * 
     * @returns {Promise}   Resource acquisition promise.
	 */
    this.init = function() {
        return self.$base.init.call(self, DBNAME);
    };
	
	/**
	 * Create new todo item
	 *
	 * @param {string} [title] The title of the task
	 * @param {function} [callback] The callback to fire after the model is created
	 */
	this.add = function(title, callback) {
		title = title || '';
		var todo = new TodoItem(title);
        self.$base.add.call(self, todo, callback);
	};
	
	
	/**
	 * Returns a count of all todos
	 */
	this.getStats = function(callback) {
		var results = self.$base.getItems.call(self);
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
	 * Updates a model by giving it an ID, data to update, and a callback to fire when
	 * the update is completed.
	 *
	 * @param {object}	   entity	   The properties to update and their new value
	 * @param {function}   callback	   The callback to fire when the update is complete.
	 */
	this.save = function(entity, callback) {
		var todo = new TodoItem(entity.id, entity.title, entity.completed);
        self.$base.save.call(self, todo, callback);
	};
}
