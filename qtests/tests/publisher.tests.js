/* jshint strict: true, undef: true, eqeqeq: true, laxbreak: true */
/* globals console, define, Publisher, Subscriber   */
(function () {
    'use strict';
    
    var dependencies = [
            'qunit',
            'inherit',
            'delegate',
            'publisher',
            'subscriber'
        ],
        
        eventBus = {};
    
    // Unit test definitions.
	define(dependencies, function(Qunit) {
        
		// Define the QUnit module and lifecycle.
		Qunit.module('Publisher Tests', { 
			setup: function () {
			},
			teardown: function () {
			}
		});
        
        Qunit.test('test publisher', function( assert ) {
            
            var publisher = new Publisher('testMessage');
            var subscriber1 = new Subscriber(this, function(message, assert, testValue) {
                assert.equal(message, 'testMessage', 'subscriber1');
                assert.equal(testValue, 4);
            });
            
            var subscriber2 = new Subscriber(this, function(message, assert, testValue) {
                assert.equal(message, 'testMessage', 'subscriber2');
                assert.equal(testValue, 4);
            });
            
            var subscriber3 = new Subscriber(this, function(message, assert, testValue) {
                assert.equal(message, 'testMessage', 'subscriber3');
                assert.equal(testValue, 4);
            });
            
            publisher.subscribe(subscriber1, assert, 4);
            publisher.subscribe(subscriber2, assert, 4);
            publisher.subscribe(subscriber3, assert, 4);
            
            publisher.publish('testMessage', assert, 4);
            
            // Unsubscribe.
            publisher.unsubscribe(subscriber1);
            publisher.unsubscribe(subscriber2);
            publisher.unsubscribe(subscriber3);
            
            // This message will not be published if unsubscibed.
            // The test will fail if published.
            publisher.publish('testMessage', assert, 5);
        });
    });
}());
