/* jshint strict: true, undef: true, eqeqeq: true, laxbreak: true */
/* globals console, define, Template   */
(function () {
    'use strict';
    
    var dependencies = [
            '$',
            'qunit',
            'inherit',
            'delegate',
            'template',
        ];
        
	var templates = {
		
		content: ''
				+	'<header class="header">'
				+		'<h1>todos</h1>'
				+		'<input class="new-todo" placeholder="{{placeholder}}" autofocus>'
				+	'</header>'
				+	'<section class="workspace">'
				+		'<section class="main">'
				+			'<input class="toggle-all" type="checkbox">'
				+			'<label for="toggle-all">{{markall}}</label>'
				+			'<ul class="todo-list"></ul>'
				+		'</section>'
				+		'<section class="menu">'
				+			'<span class="todo-count"></span>'
				+			'<ul class="filters">'
				+				'<li>'
				+					'<a href="#/" class="selected">{{default}}</a>'
				+				'</li>'
				+				'<li>'
				+					'<a href="#/active">{{active}}</a>'
				+				'</li>'
				+				'<li>'
				+					'<a href="#/completed">{{completed}}</a>'
				+				'</li>'
				+			'</ul>'
				+		 '<button class="clear-completed">{{clear}}</button>'
				+		'</section>'
				+	'</section>',
		
		listitem:	''
				+	'<li data-id="{{id}}" class="{{completed}}">'
				+		'<div class="view">'
				+			'<input class="toggle" type="checkbox" {{checked}}>'
				+			'<label>{{title}}</label>'
				+			'<button class="destroy"></button>'
				+		'</div>'
				+	'</li>',
		
		summary:	'<span><strong>{{count}}</strong> item{{plural}} left</span>'
	};
        
    // Unit test definitions.
	define(dependencies, function($, Qunit) {
        
		// Define the QUnit module and lifecycle.
		Qunit.module('Template Tests', { 
			setup: function () {
			},
			teardown: function () {
			}
		});
        
        Qunit.test('test template initialization from object', function( assert ) {
            
            // Create templates.
            var template = new Template();
            template.init(templates);

            // Obtain summary template.
            var text = template.createTextFor(template.summary, {count: 5, plural:'s'});
            assert.equal(text, '<span><strong>5</strong> items left</span>');
        });
    });
}());
