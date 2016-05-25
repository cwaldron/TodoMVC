/* jshint strict: true, undef: true */
/* globals $, console, document, window, Delegate, Todos */

$(document).ready(function() {
    "use strict";
    
    var todos = new Todos();

    var onHashChange = Delegate.create(todos, function() { 
        this.navigate(window.location);
    });
    
    var onLoad = Delegate.create(todos, function() { 
        this.init()
        .then(onHashChange);
    });
    
    $(window).on('load', onLoad);
	$(window).on('hashchange', onHashChange);
});
