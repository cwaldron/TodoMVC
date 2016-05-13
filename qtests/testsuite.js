/* jshint strict: true, undef: true, eqeqeq: true, laxbreak: true */
/* globals require, QUnit */
(function () {
    'use strict';    
    
    // Configure RequireJS so it resolves relative module paths from the `src`
	// folder.
    require.config({
        baseUrl: "./src",
		paths: {
			$: "http://code.jquery.com/jquery-2.2.3",
			qunit: "http://code.jquery.com/qunit/qunit-1.23.1",
			delegate: "todomvc/js/delegate",
			inherit: "todomvc/js/inherit",
            map: "todomvc/js/map",
			eventbus: "todomvc/js/eventbus",
			publisher: "todomvc/js/publisher",
			subscriber: "todomvc/js/subscriber",
			dispatcher: "todomvc/js/dispatcher",
			glossary: "todomvc/js/glossary",
			template: "todomvc/js/template",
		}
    });

	// A list of all QUnit test Modules.  Make sure you include the `.js` 
	// extension so RequireJS resolves them as relative paths rather than using
	// the `baseUrl` value supplied above.
	var testModules = [
		"tests/inherit.tests.js",
		"tests/map.tests.js",
		"tests/publisher.tests.js",
		"tests/eventbus.tests.js",
		"tests/dispatcher.tests.js",
		"tests/glossary.tests.js",
		"tests/template.tests.js",
	];
	
    // Resolve all testModules and then start the Test Runner.
	require(testModules, function(){
		QUnit.load();
		QUnit.start();
	});
}());

