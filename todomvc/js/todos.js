/*jshint strict: true, undef: true, eqeqeq: true */
/* globals console, Promise, Subscriber, Controller, TodoConfig, TodoModel, TodoView */

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
		model = new TodoModel();
    
	/**
	 * Initialize instance.
	 */
    function initialize() {
        view.on(subscribers);
        view.render(view.commands.initContent, settings);
        self.$base.init.call(self, router);
    }
    
	/**
	 * Display the remaining number of todo items.
	 */
	function showStats() {
		model.getStats(function(stats) {
			view.render(view.commands.showStats, stats);
			view.render(view.commands.toggleAll, (stats.completed === stats.total));
		});
	}
    
	/**
	 * Initialize the todos controller.
     * 
     * @returns {Promise}   Resource acquisition promise.
	 */
    this.init = function() {
        return Promise.all([settings.init(),
                            model.init(),
                            view.init()])
            .then(initialize);
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
			model.find(function (results) {
				view.render(view.commands.showEntries, results);
			});
		},

		/**
		 * Renders all active tasks
		 */
		active: function () {
			model.find({ completed: false }, function (results) {
				view.render(view.commands.showEntries, results);
			});
		},

		/**
		 * Renders all completed tasks
		 */
		completed: function () {
			model.find({ completed: true }, function (results) {
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

			model.add(title, new Subscriber(this, function () {
				view.render(view.commands.clearNewTodo);
				this.stateChanged();
			}));
		}),

		/*
		 * Starts the todo item editing mode.
		 */
		todoEdit: new Subscriber(this, function (id) {
			model.find(id, function (results) {
				view.render(view.commands.editItem, id, results[0].title);
			});
		}),
		
		/*
		 * Saves edited changes to the todo item.
		 */
		todoEditSave: new Subscriber(this, function (id, title) {
			if (title.length !== 0) {
				model.save({id: id, title: title}, function (item) {
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
			model.find(id, function (results) {
				view.render(view.commands.editItemDone, id, results[0].title);
			});
		}),
		
		/**
		 * Removes the todo item.
		 */
		todoRemove: new Subscriber(this, function (id, silent) {
			model.remove(id, function () {
				view.render(view.commands.removeItem, id);
			});

			if (!silent)
				showStats();
		}),
		
		/**
		 * Removes all completed items todo items.
		 */
		todoRemoveCompleted: new Subscriber(this, function () {
			model.find({ completed: true }, function (results) {
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
			model.save(viewdata, function (item) {
				view.render(view.commands.completedItem, item.id, item.completed);
			});
			
			if (!silent)
				showStats();
		}),
		
		/**
		 * Toggles completion of all todo items.
		 */
		todoToggleAll: new Subscriber(this, function (completed) {
			model.find({ completed: !completed }, function (results) {
				results.forEach(function (item) {
					subscribers.todoToggle({id: item.id, title: item.title, completed: completed}, true);				 
				});
			});
			
			showStats();
		})
	};
}
