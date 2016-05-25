/*jshint strict: true, undef: true, eqeqeq: true */
/* globals console, Subscriber, Controller, TodoConfig, TodoStore, TodoView */

/**
 * The todos controller.
 *
 * @class
 */
function Todos() {
	"use strict";
	
	this.inherit(Todos, Controller);
	
	var self = this,
        settings = new TodoConfig(),
		view = new TodoView(),
		store = new TodoStore();
    
	/**
	 * Display the remaining number of todo items.
	 */
	function showStats() {
		store.getStats(function(stats) {
			view.render(view.commands.showStats, stats);
			view.render(view.commands.toggleAll, (stats.completed === stats.total));
		});
	}
    
    this.init = function() {
        return view.init().then(function() {
            view.on(subscribers);
            view.render(view.commands.initContent, settings);
            self.$base.init.call(self, router);
        });
    };
    
	/**
	 * Set the application state.
	 *
	 * @param {string} '' | 'active' | 'completed'
	 */
	this.stateChanged = function() {
		this.executeState();
		view.render(view.commands.setFilter, this.getHyperlink());
		showStats();
	};
	
	/**
	 * Router is the receiver of events that changes the application state.
	 */
	var router = {
		
		/**
		 * Renders all todo list items.
		 */
		default: function () {
			store.find(function (results) {
				view.render(view.commands.showEntries, results);
			});
		},

		/**
		 * Renders all active tasks
		 */
		active: function () {
			store.find({ completed: false }, function (results) {
				view.render(view.commands.showEntries, results);
			});
		},

		/**
		 * Renders all completed tasks
		 */
		completed: function () {
			store.find({ completed: true }, function (results) {
				view.render(view.commands.showEntries, results);
			});
		}
	};
	
	
	/**
	 * Subscriber of view events.
	 */
	var subscribers = {
		
		/**
		 * Adds a new todo item to the todo list.
		 */
		todoAdd: new Subscriber(this, function (title) {

			// Add item.
			if (title.trim() === '') {
				return;
			}

			store.create(title, new Subscriber(this, function () {
				view.render(view.commands.clearNewTodo);
				this.stateChanged();
			}));
		}),

		/*
		 * Starts the todo item editing mode.
		 */
		todoEdit: new Subscriber(this, function (id) {
			store.find(id, function (results) {
				view.render(view.commands.editItem, id, results[0].title);
			});
		}),
		
		/*
		 * Saves edited changes to the todo item.
		 */
		todoEditSave: new Subscriber(this, function (id, title) {
			if (title.length !== 0) {
				store.save({id: id, title: title}, function (item) {
					view.render(view.commands.editItemDone, item.id, item.title);
				});
			} else {
				subscribers.todoRemove(id);
			}
		}),

		/*
		 * Cancels the todo item editing mode and restore previous value.
		 */
		todoEditCancel: new Subscriber(this, function (id) {
			store.find(id, function (results) {
				view.render(view.commands.editItemDone, id, results[0].title);
			});
		}),
		
		/**
		 * Removes the todo item.
		 */
		todoRemove: new Subscriber(this, function (id, silent) {
			store.remove(id, function () {
				view.render(view.commands.removeItem, id);
			});

			if (!silent)
				showStats();
		}),
		
		/**
		 * Removes all completed items todo items.
		 */
		todoRemoveCompleted: new Subscriber(this, function () {
			store.find({ completed: true }, function (results) {
				results.forEach(function (item) {
					subscribers.todoRemove(item.id, true);
				});
			});

			showStats();
		}),
		
		/**
		 * Toggles the completion of a todo item.
		 */
		todoToggle: new Subscriber(this, function (viewdata, silent) {
			store.save(viewdata, function (item) {
				view.render(view.commands.completedItem, item.id, item.completed);
			});
			
			if (!silent)
				showStats();
		}),
		
		/**
		 * Toggles completion of all todo items.
		 */
		todoToggleAll: new Subscriber(this, function (completed) {
			store.find({ completed: !completed }, function (results) {
				results.forEach(function (item) {
					subscribers.todoToggle({id: item.id, title: item.title, completed: completed}, true);				 
				});
			});
			
			showStats();
		})
	};
}
