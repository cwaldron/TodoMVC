/*jshint strict:true, undef:true, eqeqeq:true, laxbreak:true */
/*global $, Humdrum */

function TodoTemplate() {
	'use strict';
    
    this.inherit(TodoTemplate, Humdrum.Template);
    
    var templates = {

        listitem:   '<li data-id="{{id}}" class="{{completed}}">'
                +       '<div class="view">'
                +           '<input class="toggle" type="checkbox" {{checked}}>'
                +  			'<label>{{title}}</label>'
                +			'<button class="destroy"></button>'
                +		'</div>'
                +   '</li>',
        
        counter:    '<strong>{{count}}</strong> item{{plural}} left'
    };
    
    this.init(templates);
}
