/* jshint strict: true, undef: true, eqeqeq: true, laxbreak: true */
/* globals console, define, EventBus, Subscriber   */
(function () {
    'use strict';
    
    var dependencies = [
            'qunit',
            'inherit',
            'delegate',
            'eventbus',
            'publisher',
            'subscriber'
        ],
        
        eventBus = {};
    
    // Unit test definitions.
	define(dependencies, function(Qunit) {
        
		// Define the QUnit module and lifecycle.
		Qunit.module("EventBus Tests", { 
			setup: function () {
			},
			teardown: function () {
			}
		});
        
        Qunit.test("test eventbus", function( assert ) {
            
            var eventBus = new EventBus();
            eventBus.subscribe("testMessage", new Subscriber(this, function(assert, testValue) {
                assert.equal(testValue, 4);
            }));
            
            eventBus.publish("testMessage", assert, 4);
            eventBus.unsubscribe("testMessage");
            
            // This message will not be published if unsubscibed.
            // The test will fail if published.
            eventBus.publish("testMessage", assert, 5);
        });
    });
}());
