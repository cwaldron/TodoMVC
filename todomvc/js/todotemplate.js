/*jshint strict:true, undef:true, eqeqeq:true, laxbreak:true */
/*global $, Template */

function TodoTemplate() {
	'use strict';
    
    this.inherit(TodoTemplate, Template);
    
    var templates = {
        
        content: ''
                +   '<header class="header">'
                +       '<h1>todos</h1>'
                +       '<input class="new-todo" placeholder="{{placeholder}}" autofocus>'
                +   '</header>'
                +   '<section class="workspace">'
                +       '<section class="main">'
                +           '<input class="toggle-all" type="checkbox">'
                +           '<label for="toggle-all">{{markall}}</label>'
                +           '<ul class="todo-list"></ul>'
                +       '</section>'
                +       '<section class="menu">'
                +           '<span class="todo-count"></span>'
                +           '<ul class="filters">'
                +               '<li>'
                +                   '<a href="#/" class="selected">{{default}}</a>'
                +               '</li>'
                +               '<li>'
                +                   '<a href="#/active">{{active}}</a>'
                +               '</li>'
                +               '<li>'
                +                   '<a href="#/completed">{{completed}}</a>'
                +               '</li>'
                +           '</ul>'
                +		 '<button class="clear-completed">{{clear}}</button>'
                +       '</section>'
                +   '</section>',
        
        listitem:   ''
                +   '<li data-id="{{id}}" class="{{completed}}">'
                +       '<div class="view">'
                +           '<input class="toggle" type="checkbox" {{checked}}>'
                +  			'<label>{{title}}</label>'
                +			'<button class="destroy"></button>'
                +		'</div>'
                +   '</li>',
        
        summary:    '<span><strong>{{count}}</strong> item{{plural}} left</span>'
    };
    
    //this.init(templates);
    this.init($('#templates'));
    //this.init("template/templates.html");
}
