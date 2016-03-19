/*jshint strict: true, undef: true, eqeqeq: true */
/* globals console, Messages, Subscriber, TodoStore, TodoView */

function Todos() {
    "use strict";
    
    var currentState,
        prevState,
        view = new TodoView(),
        store = new TodoStore();
    
	/**
	 * Loads and initialises the view
	 *
	 * @param {string} '' | 'active' | 'completed'
	 */
    function navigate(location) {
        currentState = getState(location);
        if (prevState !== currentState) {
            display();
        }
        prevState = currentState;
	}
    
	/**
	 * Updates the pieces of the page which change depending on the remaining
	 * number of todos.
	 */
	function showStats() {
        store.getStats(function(stats) {
            view.render(view.commands.showStats, stats);
        });
	}
    
	/**
	 * Set the application state.
	 *
	 * @param {string} '' | 'active' | 'completed'
	 */
    function display() {
        router[currentState]();
        view.render(view.commands.setFilter, getHyperlink(currentState));
        showStats();
    }
    
	/**
	 * Translate the current state into the hyperlink reference.
	 *
	 * @param {string}     currentState
	 */
    function getHyperlink(currentState) {
        return '#/' + ((currentState === 'default') ? '' : currentState);
    }
    
	/**
	 * Gets the controller state from the location.
	 *
	 * @param {string} '' | 'active' | 'completed'
	 */
    function getState(location) {
        var state = (location.hash) ? location.hash.split('/')[1] : 'default';
        return state || 'default';
    }

    /**
     * Router is the receiver of events that changes the application state.
     */
    var router = {
        
        /**
         * An event to fire on load. Will get all items and display them in the
         * todo-list
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
         * An event to fire whenever you want to add an item. Simply pass in the event
         * object and it'll handle the DOM insertion and saving of the new item.
         */
        todoAdd: new Subscriber(this, function (title) {

            // Add item.
            if (title.trim() === '') {
                return;
            }

            store.create(title, function () {
                view.render(view.commands.clearNewTodo);
                display();
            });
        }),
                                
        /*
         * Triggers the item editing mode.
         */
        todoEdit: new Subscriber(this, function (id) {
            store.find(id, function (results) {
                view.render(view.commands.editItem, id, results[0].title);
            });
        }),
        
        /*
         * Finishes the item editing mode successfully.
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
         * Cancels the item editing mode and restore previous title.
         */
        todoEditCancel: new Subscriber(this, function (id) {
            store.find(id, function (results) {
                view.render(view.commands.editItemDone, id, results[0].title);
            });
        }),
        
        /**
         * By giving it an ID it'll find the DOM element matching that ID,
         * remove it from the DOM and also remove it from storage.
         *
         * @param {number} id The ID of the item to remove from the DOM and
         * storage
         */
        todoRemove: new Subscriber(this, function (id, silent) {
            store.remove(id, function () {
                view.render(view.commands.removeItem, id);
            });

            if (!silent) display();
        }),
        
        /**
         * Will remove all completed items from the DOM and storage.
         */
        todoRemoveCompleted: new Subscriber(this, function () {
            store.find({ completed: true }, function (results) {
                results.forEach(function (item) {
                    subscribers.todoRemove(item.id, true);
                });
            });

            display();
        }),
        
        /**
         * Give it an ID of a model and a checkbox and it will update the item
         * in storage based on the checkbox's state.
         *
         * @param {object} viewdata The checkbox to check the state of complete or not
         * @param {boolean|undefined} silent Prevent re-filtering the todo items
         */
        todoToggle: new Subscriber(this, function (viewdata, silent) {
            store.save(viewdata, function (item) {
                view.render(view.commands.completedItem, item.id, item.completed);
            });
            
            if (!silent) showStats();
        }),
        
        /**
         * Will toggle ALL checkboxes' on/off state and completeness of models.
         * Just pass in the event object.
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
    
    
	/**
	 * Set up subscribers.
	 */
    view.bind(subscribers);
    

    /**
	 * return contract.
	 */
    return {
        navigate: navigate
    };
}
