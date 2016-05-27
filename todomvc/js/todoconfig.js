/*jshint strict:true, undef:true, eqeqeq:true, laxbreak:true */
/* globals $, console, document, Promise, Glossary */

/**
 * The todos model.
 *
 * @class
 */
function TodoConfig() {
    "use strict";
    
    var self = this;
    
	/**
	 * Initialize instance.
	 */
    function initialize() {
        return new Promise(function(resolve, reject) {
            self.glossary = {
                        default: 'All',
                        active: 'Active',
                        completed: 'Completed',
                        clear: 'Clear Completed',
                        markall: 'Mark all as completed',
                        placeholder: 'What needs to be done?'
                    };
            
            resolve();
        });
    }

	/**
	 * Initialize the configuration.
     * 
     * @returns {Promise}   Resource acquisition promise.
	 */
    this.init = function() {
        return initialize();
    };
}
