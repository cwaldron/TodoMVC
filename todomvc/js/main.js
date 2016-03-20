/* jshint strict: true, undef: true */
/* globals $, console, document, window, Subscriber, Todos */

$(document).ready(function() {
    "use strict";
    
    var todos = new Todos();
    var subscriber = new Subscriber(todos, function() { 
        this.navigate(window.location);
    });
    
    $(window).on('load', subscriber);
	$(window).on('hashchange', subscriber);
});
