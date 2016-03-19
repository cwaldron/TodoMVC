/*
*  Copyright (C) 2015 by Chris Solutions Ltd. All Rights Reserved.
*/

// EventBus definition.
// Sets up a publisher/subscriber event bus.

/* jshint strict: true, undef: true */
/* globals Publisher */

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
    
    var subscribe = function (message, subscriber) {
        if (!publishers[message]) {
            publishers[message] = new Publisher(message);
        }
        
        publishers[message].subscribe(subscriber);
    };
    
    var unsubscribe = function (message, subscriber) {
        if (!!publishers[message]) {
            if (!subscriber) {
                publishers[message].clear();
            } else {
                publishers[message].unsubscribe(subscriber);
            }
        }
    };
    
    var publish = function (message) {
        if (!!publishers[message]) {
            var args = [];
            for (var ii = 1; ii < arguments.length; ++ii) {
                args.push(arguments[ii]);
            }
            publishers[message].publish.apply(this, args);
        }
    };
    
    var getPublishers = function () {
        var list = [];
        for (var message in publishers) {
            if (publishers.hasOwnProperty(message)) {
                list.push(publishers[message]);
            }
        }
        return list;
    };
    
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
