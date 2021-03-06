/*jshint strict:true, undef:true, eqeqeq:true, laxbreak:true */
/* globals Publisher */

/**
 * An event bus is an object that dispatches notification of events to 
 * subscribers that are bound to a specific message.  A message is an 
 * event type.  When an event of a particular type occurs the event message
 * is published to subscribers of that event type.
 *
 * @class
 *
 * @example
 * var eventBus = new EventBus([messages]);
 */
var EventBus = function (messages) {
    "use strict";

    var publishers = {};
    
    if (!!messages) {
        if (typeof messages === "object") {
            for (var message in messages) {
                publishers[message] = new Publisher(message);
            }
        } else if (messages.constructor === Array) {
            messages.forEach(function(message) {
                publishers[message] = new Publisher(message);
            });
        }
    }
    
	/**
	 * subscribe(message, subscriber)
	 *
	 * attaches a subscriber to a message.
     *
     * @param {string}      message     event message.
     * @param {Subscriber}  subscriber  event subscriber.
	 */    
    var subscribe = function (message, subscriber) {
        if (!publishers[message]) {
            publishers[message] = new Publisher(message);
        }
        
        publishers[message].subscribe(subscriber);
    };
    
	/**
	 * unsubscribe(message, subscriber)
	 *
	 * detaches a subscriber from a message.
     *
     * @param {string}      message     event message.
     * @param {Subscriber}  subscriber  event subscriber.
	 */    
    var unsubscribe = function (message, subscriber) {
        if (!!publishers[message]) {
            if (!subscriber) {
                publishers[message].clear();
            } else {
                publishers[message].unsubscribe(subscriber);
            }
        }
    };
    
	/**
	 * publish(message)
	 *
	 * triggers event to message subscribers.
     *
     * @param {string}      message     event message.
	 */    
    var publish = function (message) {
        if (!!publishers[message]) {
            var args = [];
            for (var ii = 1; ii < arguments.length; ++ii) {
                args.push(arguments[ii]);
            }
            publishers[message].publish.apply(this, args);
        }
    };
    
	/**
	 * getPublishers()
	 *
	 * returns the event bus publishers 
     *
     * @returns {Array}     Array of publishers.
	 */    
    var getPublishers = function () {
        var list = [];
        for (var message in publishers) {
            if (publishers.hasOwnProperty(message)) {
                list.push(publishers[message]);
            }
        }
        return list;
    };
    
	/**
	 * getMessages()
	 *
	 * returns the event bus message names.
     *
     * @returns {Array}     Array of message names.
	 */    
    var getMessages = function () {
        return Object.getOwnPropertyNames(publishers);
    };
    
    return {
        subscribe: subscribe,
        unsubscribe: unsubscribe,
        publish: publish,
        getPublishers: getPublishers,
        getMessages: getMessages
    };
};
