/* jshint strict: true, undef: true */
/* globals $, console, document, window, Todos */

$(document).ready(function() {
    "use strict";
    
    var todos = Todos.create();
    var subscriber = function() { 
        todos.navigate(window.location);
    };
    
    $(window).on('load', subscriber);
	$(window).on('hashchange', subscriber);
});
