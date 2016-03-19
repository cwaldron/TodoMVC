/*jshint strict: true, undef: true, eqeqeq: true */
/*global $, _, document, View, TodoTemplate */

function TodoView() {
	'use strict';
    
    this.inherit(TodoView, View);
    
    var self = this,
        todoList = $('.todo-list'),
		todoItemCounter = $('.todo-count'),
		clearCompleted = $('.clear-completed'),
		main = $('.main'),
		footer = $('.footer'),
		toggleAll = $('.toggle-all'),
		newTodo = $('.new-todo'),
        template = new TodoTemplate(),
        
        viewCommands = {
            
            showEntries: function (todos) {
                todoList.empty();
                for (var ii = 0; ii < todos.length; ++ii) {
                    var viewdata = Object.create(null);
                    viewdata.id = todos[ii].id;
                    viewdata.title = todos[ii].title;
                    if (todos[ii].completed) {
                        viewdata.completed = 'completed';
                        viewdata.checked = 'checked';
                    }

                    var element = template.createElementFor(template.listitem, viewdata);
                    todoList.append(element);
                }
            },
            
            showStats: function (stats) {
                var viewdata = Object.create(null);
                viewdata.count = stats.active;
                viewdata.plural = (stats.active > 1) ? 's' : '';
                var text = template.createTextFor(template.counter, viewdata);
                todoItemCounter.html(text);
                clearCompleted.css('display', (stats.completed > 0) ? 'block' : 'none');
                main.css('display', (stats.total > 0) ? 'block' : 'none');
                footer.css('display', (stats.total > 0) ? 'block' : 'none');
            },
            
            toggleAll: function (isCompleted) {
                toggleAll.prop('checked', isCompleted);
            },
            
            setFilter: function (href) {
                footer.find('.filters .selected').removeClass('selected');
                footer.find('.filters [href="' + href + '"]').addClass('selected');
            },
            
            /**
             * Clears the new todo field.
             */
            clearNewTodo: function () {
                newTodo.val('');
            },
            
            /**
             * Change the completion state of the todo item.
             *
             * @param {number} id       The todo identitifier.
             * @param {string} title    The title of the todo.
             */
            completedItem: function (id, completed) {
                var listItem = todoList.find('[data-id="' + id + '"]');
                var btnCompleted = listItem.find('.toggle');
                listItem[(completed) ? 'addClass' : 'removeClass']('completed');
                btnCompleted.prop('checked', completed);
            },
            
            /**
             * Edit todo by creating an input field used for editing.
             *
             * @param {number} id       The todo identitifier.
             * @param {string} title    The title of the todo.
             */
            editItem: function (id, title) {
                var listItem = todoList.find('[data-id="' + id + '"]'),
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
             * @param {number} id       The todo identitifier.
             * @param {string} title    The title of the todo.
             */
            editItemDone: function (id, title) {
                var listItem = todoList.find('[data-id="' + id + '"]');
                listItem.find('input.edit').remove();
                listItem.removeClass('editing');
                listItem.removeData('canceled');
                listItem.find('label').text(title);
            },
            
            /**
             * Remove the todo item.
             *
             * @param {number} id       The todo identitifier.
             */
            removeItem: function (id) {
                var item = todoList.find('[data-id="' + id + '"]');
                item.remove();
            }
        };
    
    /**************************************************************************
     * UI EVENT HANDLERS
     *************************************************************************/
    
    newTodo.on('change', function() {
        self.publish(self.messages.todoAdd, this.value);
    });
    
    clearCompleted.on('click', function() {
        self.publish(self.messages.todoRemoveCompleted, this, clearCompleted.checked);
    });
    
    
    toggleAll.on('click', function(event) {
        self.publish(self.messages.todoToggleAll, toggleAll.prop('checked'));
    });
    
    /**
     * Initiate edit of todo item.
     *
     * @param {event}   event   Event object.
     */
    todoList.on('dblclick', 'li label', function(event) {
        var id = $(event.target).parents('li').data('id');
        self.publish(self.messages.todoEdit, id);
    });
    
    /**
     * Process the toggling of the completed todo item.
     *
     * @param {event}   event   Event object.
     */
    todoList.on('click', 'li .toggle', function(event) {
        var btnCompleted = $(event.target);
        var todoItem = btnCompleted.parents('li');
        var label = todoItem.find('label');
        self.publish(self.messages.todoToggle, {id: todoItem.data('id'), title: label.text(), completed: btnCompleted.prop('checked')});
    });
    
    /**
     * Accept and complete todo item editing.
     *
     * @param {event}   event   Event object.
     */
    todoList.on('keypress', 'li .edit', function(event) {
        if (event.keyCode === self.ENTER_KEY) {
            $(event.target).blur();
        }
    });

    /*
     * Cancel todo item editing.
     */
    todoList.on('keyup', 'li .edit', function(event) {
        if (event.keyCode === self.ESCAPE_KEY) {
            var editor = $(event.target);
            var todoItem = editor.parents('li');
            var id = todoItem.data('id');
            todoItem.data('canceled', true);
            editor.blur();
            self.publish(self.messages.todoEditCancel, id);
        }
    });
    
    /*
     * Accept as completion of todo item editing when focus is loss.
     */
    todoList.on('blur', 'li .edit', function(event) {
        var editor = $(event.target);
        var todoItem = editor.parents('li');
        if (!todoItem.data('canceled')) {
            var id = todoItem.data('id');
            self.publish(self.messages.todoEditSave, id, editor.val());
        }
    });

    // Remove todo item.
    todoList.on('click', '.destroy', function(event) {
        var id = $(event.target).parents('li').data('id');
        self.publish(self.messages.todoRemove, id);
    });
    
    // Initialize view commands.
    this.init(viewCommands);
}
