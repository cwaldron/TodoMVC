/* jshint strict: true, undef: true, eqeqeq: true, laxbreak: true */
/* globals console, Dispatcher */

/**
 * The base view class.
 *
 * @class
 */
function View() {
    "use strict";
    
    this.inherit(View, Dispatcher);

    /**
     * ENTER_KEY
     *
     */    
    Object.defineProperty(this, 'ENTER_KEY', {
      get: function() { return 13; },
      enumerable: true,
      configurable: false
    });    

    /**
     * ESCAPE_KEY
     *
     */    
    Object.defineProperty(this, 'ESCAPE_KEY', {
      get: function() { return 27; },
      enumerable: true,
      configurable: false
    });    

    /**
     * render(command[, arg1[, arg2[, ...]]])
     *
     * renders a view command.
     */    
    this.render = function (command) {
        this.execute.apply(this, [].slice.apply(arguments));
    };
}
