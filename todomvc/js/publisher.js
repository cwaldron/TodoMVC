/*jshint strict: true, undef: true */
/*globals $, console, document, Delegate */

var Publisher = function (message) {
    "use strict";

    var subscribers = [],
        getDelegate = function (callback, scope) {
            return (scope === undefined) ? callback : Delegate.create(scope, callback);
        };
    
	/**
	 * message
	 *
	 * getter retrieving the associated message.
     *
     * @param {string}  message     Message name.
	 */    
    Object.defineProperty(this, "message", {
        get: function () { return message; },
        enumerable: true
    }); 
    
	/**
	 * subsribe(subscriber)
	 *
	 * adds a subscriber.
     *
     * @param {function}    subscriber  Event subscriber.
	 */    
    this.subscribe = function (subscriber) {
        var subscriberDelegate = getDelegate(subscriber);
        subscribers.push(subscriberDelegate);
    };
    
	/**
	 * unsubsribe(subscriber)
	 *
	 * removes a subscriber
     *
     * @param {function}    subscriber  Event subscriber.
	 */    
    this.unsubscribe = function (subscriber) {
        var subscriberDelegate = getDelegate(subscriber);
        if (subscriberDelegate !== null) {
            
            var count = subscribers.length;
            var newArray = [];
            for (var ii = 0; ii < count; ++ii) {
                var delegate = subscribers[ii];
                if (delegate.equals(subscriber) === false) {
                    newArray.push(subscriber);
                }
            }
            subscribers = newArray;
        }
    };
        
	/**
	 * publish([arg1[, arg2[, ...]]])
	 *
	 * triggers event to subscribers.
     *
     * @param {Arguments}   arguments   Event arguments.
	 */    
    this.publish = function() {
        var count = subscribers.length;
        for (var ii = 0; ii < count; ++ii) {
            var subscriber = subscribers[ii];
            if (subscriber) {
                subscriber.apply(this, arguments);
            }
        }
    };
    
	/**
	 * clear()
	 *
	 * removes all subscribers.
	 */    
	this.clear = function() {
		subscribers = [];
	};

    this.hasSubscribers = function() {
        return subscribers.length > 0;
    };
};