/*
*  Copyright (C) 2015 by Flowingly Ltd. All Rights Reserved.
*/

// This file holds all of the JavaScript code specific to the BPMN.html page.

// Setup all of the Diagrams and what they need.
// This is called after the page is loaded.

/* jshint strict: true, undef: true */
var Delegate = (function () {
    "use strict";

    var create = function(scope, callback) {

        function Delegate(obj, func) {
            var noop = function() {},
                self = obj,
                method = func;

            this.invoke = function () {
                if (self && method) {
                    return (arguments) ? method.apply(self, arguments) : method.apply(self);
                } else {
                    return noop;
                }
            };

            this.invoke.scope = {
                get scope() {
                    return self;
                }
            };

            this.invoke.callback = {
                get callback() {
                    return method;
                }
            };

            this.invoke.equals = function (delegate) {
                return this.scope === delegate.scope && this.callback === delegate.callback;
            };
        }

        return new Delegate(scope, callback).invoke;
    };

    return {

        // methods.
        create: create
    };

}());
