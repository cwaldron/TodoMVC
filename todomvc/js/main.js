/*
*  Copyright (C) 2016 by Chris Solutions Ltd. All Rights Reserved.
*/

// This file holds all of the JavaScript code specific to the BPMN.html page.

// Setup all of the Diagrams and what they need.
// This is called after the page is loaded.

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
