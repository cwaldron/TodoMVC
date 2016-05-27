/*jshint strict: true, undef: true, eqeqeq: true */
/*global $, document, View, TodoTemplate */

/**
 * The todo view.
 *
 * @class
 */
function TodoView() {
	'use strict';
	
	this.inherit(TodoView, View);
	
	var self = this,
		view = {},
		todoapp = $('.todoapp'),
		template = new TodoTemplate(),
		
		viewCommands = {
			
			initContent: function(settings) {
				var element = template.createElementFor(template.content, settings.glossary);
				todoapp.append(element);
				view.todoList = $('.todo-list');
				view.todoItemCount = $('.todo-count');
				view.clearCompleted = $('.clear-completed');
				view.workspace = $('.workspace');
				view.main = $('.main');
				view.menu = $('.menu');
				view.toggleAll = $('.toggle-all');
				view.newTodo = $('.new-todo');
				attachHandlers();
			},
			
			showEntries: function (todos) {
				view.todoList.empty();
				todos.forEach(function(todo) {
					var viewdata = Object.create(null);
					viewdata.id = todo.id;
					viewdata.title = todo.title;
					if (todo.completed) {
						viewdata.completed = 'completed';
						viewdata.checked = 'checked';
					}

					var element = template.createElementFor(template.listitem, viewdata);
					view.todoList.append(element);
				});
			},
			
			showStats: function (stats) {
				var viewdata = Object.create(null);
				viewdata.count = stats.active;
				viewdata.plural = (stats.active > 1) ? 's' : '';
				var text = template.createTextFor(template.summary, viewdata);
				view.todoItemCount.html(text);
				view.workspace.css('display', (stats.total > 0) ? 'block' : 'none');
				view.clearCompleted.css('display', (stats.completed > 0) ? 'block' : 'none');
			},
			
			toggleAll: function (isCompleted) {
				view.toggleAll.prop('checked', isCompleted);
			},
			
			setFilter: function (href) {
				view.menu.find('.filters .selected').removeClass('selected');
				view.menu.find('.filters [href="' + href + '"]').addClass('selected');
			},
			
			/**
			 * Clears the new todo field.
			 */
			clearNewTodo: function () {
				view.newTodo.val('');
			},
			
			/**
			 * Change the completion state of the todo item.
			 *
			 * @param {number} id		The todo identifier.
			 * @param {string} title	The title of the todo.
			 */
			completedItem: function (id, completed) {
				var listItem = view.todoList.find('[data-id="' + id + '"]');
				var btnCompleted = listItem.find('.toggle');
				listItem[(completed) ? 'addClass' : 'removeClass']('completed');
				btnCompleted.prop('checked', completed);
			},
			
			/**
			 * Edit todo by creating an input field used for editing.
			 *
			 * @param {number} id		The todo identifier.
			 * @param {string} title	The title of the todo.
			 */
			editItem: function (id, title) {
				var listItem = view.todoList.find('[data-id="' + id + '"]'),
					input = $(document.createElement('input'));
				listItem.addClass('editing');
				input.addClass('edit');
				listItem.append(input);
				input.val(title);
				input.focus();
			},
			
			/**
			 * Edit of todo is completed.
			 *
			 * @param {number} id		The todo identifier.
			 * @param {string} title	The title of the todo.
			 */
			editItemDone: function (id, title) {
				var listItem = view.todoList.find('[data-id="' + id + '"]');
				listItem.find('input.edit').remove();
				listItem.removeClass('editing');
				listItem.removeData('canceled');
				listItem.find('label').text(title);
			},
			
			/**
			 * Remove the todo item.
			 *
			 * @param {number} id		The todo identitifier.
			 */
			removeItem: function (id) {
				var item = view.todoList.find('[data-id="' + id + '"]');
				item.remove();
			}
		};
    
	/**
	 * Initialize instance.
	 */
    function initialize() {
        self.$base.init.call(self, viewCommands);
    }
	
	/**
	 * Attaches the UI event handler to the view selectors.
	 */
	function attachHandlers() {
		
		view.newTodo.on('change', function() {
			self.trigger(self.messages.todoAdd, this.value);
		});

		view.clearCompleted.on('click', function() {
			self.trigger(self.messages.todoRemoveCompleted, this, view.clearCompleted.checked);
		});


		view.toggleAll.on('click', function(event) {
			self.trigger(self.messages.todoToggleAll, view.toggleAll.prop('checked'));
		});

		/**
		 * Initiate edit of todo item.
		 *
		 * @param {event}	event	Event object.
		 */
		view.todoList.on('dblclick', 'li label', function(event) {
			var id = $(event.target).parents('li').data('id');
			self.trigger(self.messages.todoEdit, id);
		});

		/**
		 * Process the toggling of the completed todo item.
		 *
		 * @param {event}	event	Event object.
		 */
		view.todoList.on('click', 'li .toggle', function(event) {
			var btnCompleted = $(event.target);
			var todoItem = btnCompleted.parents('li');
			var label = todoItem.find('label');
			self.trigger(self.messages.todoToggle, {id: todoItem.data('id'), title: label.text(), completed: btnCompleted.prop('checked')});
		});

		/**
		 * Accept and complete todo item editing.
		 *
		 * @param {event}	event	Event object.
		 */
		view.todoList.on('keypress', 'li .edit', function(event) {
			if (event.keyCode === self.ENTER_KEY) {
				$(event.target).blur();
			}
		});

		/*
		 * Cancel todo item editing.
		 */
		view.todoList.on('keyup', 'li .edit', function(event) {
			if (event.keyCode === self.ESCAPE_KEY) {
				var editor = $(event.target);
				var todoItem = editor.parents('li');
				var id = todoItem.data('id');
				todoItem.data('canceled', true);
				editor.blur();
				self.trigger(self.messages.todoEditCancel, id);
			}
		});

		/*
		 * Complete todo item editing when focus is loss.
		 */
		view.todoList.on('blur', 'li .edit', function(event) {
			var editor = $(event.target);
			var todoItem = editor.parents('li');
			if (!todoItem.data('canceled')) {
				var id = todoItem.data('id');
				self.trigger(self.messages.todoEditSave, id, editor.val());
			}
		});

		// Remove todo item.
		view.todoList.on('click', '.destroy', function(event) {
			var id = $(event.target).parents('li').data('id');
			self.trigger(self.messages.todoRemove, id);
		});
	}
    
	/**
	 * Initialize the view.
     * 
     * @returns {Promise}   Resource acquisition promise.
	 */
    this.init = function() {
        return template.init()
            .then(initialize);
    };
}
