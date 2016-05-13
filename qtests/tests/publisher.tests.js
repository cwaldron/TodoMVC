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
        
        eventBus = {},
        
        subscriber1, subscriber2, subscriber3;

    
    // Unit test definitions.
	define(dependencies, function(Qunit) {
        
		// Define the QUnit module and lifecycle.
		Qunit.module('Publisher Tests', { 
			setup: function () {
                subscriber1 = new Subscriber(this, function(message, assert, testValue) {
                    assert.equal(message, 'testMessage', 'subscriber1');
                    assert.equal(testValue, 4);
                });

                subscriber2 = new Subscriber(this, function(message, assert, testValue) {
                    assert.equal(message, 'testMessage', 'subscriber2');
                    assert.equal(testValue, 4);
                });

                subscriber3 = new Subscriber(this, function(message, assert, testValue) {
                    assert.equal(message, 'testMessage', 'subscriber3');
                    assert.equal(testValue, 4);
                });
			},
			teardown: function () {
			}
		});
        
        Qunit.test('test publisher', function( assert ) {
            
            // Create publisher.
            var publisher = new Publisher('testMessage');

            // Set up subscribers.
            publisher.subscribe(subscriber1, assert, 4);
            publisher.subscribe(subscriber2, assert, 4);
            publisher.subscribe(subscriber3, assert, 4);
            
            // Test hasSubscribers.
            assert.equal(publisher.hasSubscribers(), true, 'publisher has subscribers');

            // Publish message.
            publisher.publish('testMessage', assert, 4);
            
            // Unsubscribe.
            publisher.unsubscribe(subscriber1);
            publisher.unsubscribe(subscriber2);
            publisher.unsubscribe(subscriber3);
            
            // This message will not be published if unsubscibed.
            // The test will fail if published.
            publisher.publish('testMessage', assert, 5);
            
            // Setup subscribers again.
            publisher.subscribe(subscriber1, assert, 4);
            publisher.subscribe(subscriber2, assert, 4);
            publisher.subscribe(subscriber3, assert, 4);
            
            // Test clear.
            publisher.clear();
            
            // This line will fail if clearing subscribers did not work.
            publisher.publish('testMessage', assert, 5);
        });
    });
}());
