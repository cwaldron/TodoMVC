/* jshint strict: true, undef: true, eqeqeq: true, laxbreak: true */
/* globals console, Dispatcher */

/**
 * The base model class.
 *
 * @class
 */
function Controller() {
    "use strict";
    
    this.inherit(Controller, Dispatcher);
    
    var currentState = 'default',
        prevState = null;
    
    /**
     * currentState
     *
     */    
    Object.defineProperty(this, 'currentState', {
        get: function() { return currentState; },
        enumerable: true,
        configurable: false
    });
    
	/**
	 * Loads and initialises the view
	 *
	 * @param {string} '' | 'active' | 'completed'
	 */
    this.stateChanged = function(currentState, prevState){
        console.log('override this method');
    };
    
	/**
	 * Loads and initialises the view
	 *
	 * @param {string} '' | 'active' | 'completed'
	 */
    this.navigate = function(location) {
        currentState = this.setCurrentState(location);
        if (prevState !== currentState) {
            this.stateChanged(currentState, prevState);
        }
        prevState = currentState;
	};
    
    /**
	 * Invokes the current state.
	 *
	 * @param {object | string} '' | 'active' | 'completed'
	 */
    this.executeState = function() {
        this.execute(this.commands[currentState]);
    };

    /**
	 * Gets the controller state from the location.
	 *
	 * @param {object | string} '' | 'active' | 'completed'
	 */
    this.setCurrentState = function(location) {
        if ((typeof location !== 'object') && (typeof location === 'string')) {
            var temp = location;
            location = {};
            location.hash = temp;
        } 
        
        currentState = (location.hash) ? location.hash.split('/')[1] : 'default';
        currentState = currentState || 'default';
        return currentState;
    };
    
	/**
	 * Translate the current state into the hyperlink reference.
	 *
	 * @param {string}     currentState
	 */
    this.getHyperlink = function() {
        return '#/' + ((currentState === 'default') ? '' : currentState);
    };
}
