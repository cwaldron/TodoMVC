/*jshint strict:true, undef:true, eqeqeq:true, laxbreak:true */

/**
 * The glossary used to hold display strings.
 *
 * @class
 */
function Glossary() {
    "use strict";
	
	this.inherit(Glossary);	
	var self = this;
    
    /**
	 * init(stringEntries)
     *
     * initializes the glossary from the string entries.
     *
     * @param {object|Array}    stringEntries   String entries.
     */
	this.init = function(stringEntries) {
		if (typeof stringEntries === 'object') {
			Object.getOwnPropertyNames(stringEntries).forEach(function(name) {
				Object.defineProperty(self, name, {
					get: function() { return stringEntries[name]; },
					enumerable: true,
					configurable: false
				});
			});
		} else if (stringEntries instanceof Array) {
			stringEntries.forEach(function(item) {
				Object.defineProperty(self, item.key, {
					get: function() { return item.value; },
					enumerable: true,
					configurable: false
				});
			});
		}
    };

    // Initialize the glossary if entries are passed in during construction.
    if (arguments.length > 0) {
        this.init(arguments[0]);
    }
}
