/* jshint strict: true, undef: true */
/* globals $, console, document, Delegate */
var Subscriber = function (scope, callback) {
    "use strict";
	var getDelegate = function (scope, callback) {
		return (callback === undefined) ?
                (scope.hasOwnProperty("scope") ? scope : Delegate.create(document, scope))
            : Delegate.create(scope, callback);
	};	
	
	return getDelegate(scope, callback);
};