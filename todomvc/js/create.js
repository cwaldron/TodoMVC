/*jshint strict:true, undef:true, eqeqeq:true, laxbreak:true, -W055 */

/**
 * creates an object instance of the class.
 *
 * @example
 * Myclass.create([arg1[, arg2[, ...]]]);
 */
(function () {
    "use strict";
	
    if (!Function.hasOwnProperty('create')) {
        Function.prototype.create = function() {
            function clazz() {}
            clazz.prototype = this.prototype;
            var obj = new clazz();
            this.apply(obj, Array.prototype.slice.call(arguments));
            return obj;
        };    
    }
}());
