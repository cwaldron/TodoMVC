/* jshint strict: true, undef: true, eqeqeq: true, laxbreak: true */
/* globals console, define, Delegate, Dispatcher, Subscriber   */
(function () {
    'use strict';
    
    var dependencies = [
            'qunit',
            'inherit',
            'delegate',
            'eventbus',
            'publisher',
            'subscriber',
            'dispatcher'
        ],
        
        eventBus = {};
    
    // Unit test definitions.
	define(dependencies, function(Qunit) {
        
		// Define the QUnit module and lifecycle.
		Qunit.module("Dispatcher Tests", { 
			setup: function () {
			},
			teardown: function () {
			}
		});
        
        Qunit.test("test dispatcher event processing", function( assert ) {
            
            var dispatcher = new Dispatcher();
            dispatcher.on("testMessage", new Subscriber(this, function(assert, testValue) {
                assert.equal(testValue, 4);
            }));
            
            dispatcher.trigger("testMessage", assert, 4);
            dispatcher.off("testMessage");
            
            // The dispatcher will not trigger this is message as it should be off.
            // The test will fail if triggered.
            dispatcher.trigger("testMessage", assert, 5);
        });
        
        Qunit.test("test dispatcher command processing", function( assert ) {
            
            var dispatcher = new Dispatcher(),
                commands = {
                    testCommand: function(assert, testValue) {
                        assert.equal(testValue, 4);
                    }
                };
            
            dispatcher.init(commands);
            dispatcher.execute(dispatcher.commands.testCommand, assert, 4);
        });
    });
}());
