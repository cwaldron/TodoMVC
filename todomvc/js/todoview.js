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
		dom = {},
		template = new TodoTemplate(),
		
		viewCommands = {
			
			initContent: function(settings) {
				dom.todoapp = $('.todoapp');
				var element = template.createElementFor(template.content, settings.glossary);
				dom.todoapp.append(element);
				dom.todoList = $('.todo-list');
				dom.todoItemCount = $('.todo-count');
				dom.clearCompleted = $('.clear-completed');
				dom.workspace = $('.workspace');
				dom.main = $('.main');
				dom.menu = $('.menu');
				dom.toggleAll = $('.toggle-all');
				dom.newTodo = $('.new-todo');
				attachHandlers();
			},
			
			showEntries: function (todos) {
				dom.todoList.empty();
				todos.forEach(function(todo) {
					var viewdata = Object.create(null);
					viewdata.id = todo.id;
					viewdata.title = todo.title;
					if (todo.completed) {
						viewdata.completed = 'completed';
						viewdata.checked = 'checked';
					}

					var element = template.createElementFor(template.listitem, viewdata);
					dom.todoList.append(element);
				});
			},
			
			showStats: function (stats) {
				var viewdata = Object.create(null);
				viewdata.count = stats.active;
				viewdata.plural = (stats.active > 1) ? 's' : '';
				var text = template.createTextFor(template.summary, viewdata);
				dom.todoItemCount.html(text);
				dom.workspace.css('display', (stats.total > 0) ? 'block' : 'none');
				dom.clearCompleted.css('display', (stats.completed > 0) ? 'block' : 'none');
			},
			
			toggleAll: function (isCompleted) {
				dom.toggleAll.prop('checked', isCompleted);
			},
			
			setFilter: function (href) {
				dom.menu.find('.filters .selected').removeClass('selected');
				dom.menu.find('.filters [href="' + href + '"]').addClass('selected');
			},
			
			/**
			 * Clears the new todo field.
			 */
			clearNewTodo: function () {
				dom.newTodo.val('');
			},
			
			/**
			 * Change the completion state of the todo item.
			 *
			 * @param {number} id		The todo identitifier.
			 * @param {string} title	The title of the todo.
			 */
			completedItem: function (id, completed) {
				var listItem = dom.todoList.find('[data-id="' + id + '"]');
				var btnCompleted = listItem.find('.toggle');
				listItem[(completed) ? 'addClass' : 'removeClass']('completed');
				btnCompleted.prop('checked', completed);
			},
			
			/**
			 * Edit todo by creating an input field used for editing.
			 *
			 * @param {number} id		The todo identitifier.
			 * @param {string} title	The title of the todo.
			 */
			editItem: function (id, title) {
				var listItem = dom.todoList.find('[data-id="' + id + '"]'),
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
			 * @param {number} id		The todo identitifier.
			 * @param {string} title	The title of the todo.
			 */
			editItemDone: function (id, title) {
				var listItem = dom.todoList.find('[data-id="' + id + '"]');
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
				var item = dom.todoList.find('[data-id="' + id + '"]');
				item.remove();
			}
		};
	
	/**
	 * Attaches the UI event handler to the view selectors.
	 */
	function attachHandlers() {
		
		dom.newTodo.on('change', function() {
			self.trigger(self.messages.todoAdd, this.value);
		});

		dom.clearCompleted.on('click', function() {
			self.trigger(self.messages.todoRemoveCompleted, this, dom.clearCompleted.checked);
		});


		dom.toggleAll.on('click', function(event) {
			self.trigger(self.messages.todoToggleAll, dom.toggleAll.prop('checked'));
		});

		/**
		 * Initiate edit of todo item.
		 *
		 * @param {event}	event	Event object.
		 */
		dom.todoList.on('dblclick', 'li label', function(event) {
			var id = $(event.target).parents('li').data('id');
			self.trigger(self.messages.todoEdit, id);
		});

		/**
		 * Process the toggling of the completed todo item.
		 *
		 * @param {event}	event	Event object.
		 */
		dom.todoList.on('click', 'li .toggle', function(event) {
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
		dom.todoList.on('keypress', 'li .edit', function(event) {
			if (event.keyCode === self.ENTER_KEY) {
				$(event.target).blur();
			}
		});

		/*
		 * Cancel todo item editing.
		 */
		dom.todoList.on('keyup', 'li .edit', function(event) {
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
		 * Accept as completion of todo item editing when focus is loss.
		 */
		dom.todoList.on('blur', 'li .edit', function(event) {
			var editor = $(event.target);
			var todoItem = editor.parents('li');
			if (!todoItem.data('canceled')) {
				var id = todoItem.data('id');
				self.trigger(self.messages.todoEditSave, id, editor.val());
			}
		});

		// Remove todo item.
		dom.todoList.on('click', '.destroy', function(event) {
			var id = $(event.target).parents('li').data('id');
			self.trigger(self.messages.todoRemove, id);
		});
	}
	
	
	// Initialize view commands.
	this.init(viewCommands);
}
