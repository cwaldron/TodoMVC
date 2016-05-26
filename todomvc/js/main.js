/* jshint strict: true, undef: true */
/* globals $, console, document, window, Todos */

$(document).ready(function() {
    "use strict";

    // Create Todos controller.
    var todos = new Todos();

    // Setup hash change handler.
    var onHashChange = (function() {
        todos.navigate(window.location);
    });
    
    // Set up load handler.
    var onLoad = (function() {
        todos.init().then(onHashChange);
    });

    // Attach application event handlers.
    $(window).on('load', onLoad);
	$(window).on('hashchange', onHashChange);
});
