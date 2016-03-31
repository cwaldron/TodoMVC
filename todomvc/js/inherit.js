/*jshint strict:true, undef:true, eqeqeq:true, laxbreak:true, -W055 */

/**
 * Javascript class inheritance.
 *
 * This uses a technique of copying the prototype and properties of the base class
 * to the derive class.
 *
 * @example
 * Object.inherit([derive], base);
 */
(function () {
    "use strict";
	
	var getClassName = function(clazz) {
        var name;
		var result = /(this)\.inherit\(([\w\.]+)[,|\)]/.exec(clazz.toString());
		if (result === null) {
			result = /(function)\s+(\w+).*/g.exec(clazz.toString());
			//if (result == null) {
				//throw new Error("cannot reference undeclared class");
			//}
		}
		name = result[2];
        return name;
    };

    /**
     * creates a derive class from the base class.
     *
     * @param {class} clazz     The derive class.
     * @param {class} base      The base class.
     */
    var derive = function(clazz, base) {
        if (clazz.$base)
            return;
        
        // Derive class from from base classes.
        if (base) {
            base.prototype.$init = true;
            clazz.prototype = new base();
            delete base.prototype.$init;
            clazz.prototype.constructor = clazz;
            Object.defineProperty(clazz, '$base', {
                get: function() {return base;}
            });
        }
        else {
            Object.defineProperty(clazz, '$base', {
                get: function() {return Object;}
            });
        }
    };

    /**
     * inherit function attached to all objects
     *
     * @param {class} clazz     The derive class.
     * @param {class} base      The base class.
     *
     * @example
     * Object.inherit([derive], base);
     */
    if (!Object.hasOwnProperty('inherit')) {
        Object.defineProperty(Object.prototype, 'inherit', {
            value: function(clazz, base) {
				
                // Derive new class from the base class.
                derive(clazz, base);

                // Set up the instance.
                for (var property in clazz.prototype) {	
                    if (property !== '$init') {
                        Object.defineProperty(this, property, Object.getOwnPropertyDescriptor(clazz.prototype, property));
                    } else {
                        delete clazz.prototype[property];
                    }
                }
                this.$base = (base) ? clazz.prototype : {};
                this.$class = getClassName(clazz);
            }
        });
    }
}());
