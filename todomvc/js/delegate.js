/*jshint strict:true, undef:true, eqeqeq:true, laxbreak:true */
/* globals console */
var Delegate = (function () {
    "use strict";

	/**
	 * Creates a delegate.
     *
     * A delegate is a callback function when invoked its this variable is set to the
     * predefined scope object.
     *
     * NOTE: This class was written years before bind was natively supported by Javascript
     * functions.  However this class remains useful as bind doesn't support the ability
     * to inspect the scope object bound to the callback.
	 *
	 * @param {object}     scope       object used to set the callback's scope.
	 * @param {function}   callback    the callback function.
	 *
	 * @returns {function} Delegate invocation function.
	 *
	 * @example
	 * Delegate.create(this, function([arg1[, arg2[, ...]]]) {
	 *     ...
     * });
	 */
    var create = function(scope, callback) {

        function Delegate(obj, func) {
            var noop = function() {},
                self = obj,
                id = Date.now(),
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
            
            Object.defineProperty(this.invoke, 'id', {
              get: function() {
                  return id;
              },
              enumerable: true,
              configurable: false
            });
            
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
