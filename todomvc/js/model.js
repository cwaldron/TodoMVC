/* jshint strict: true, undef: true, eqeqeq: true, laxbreak: true */
/* globals console, Dispatcher */

/**
 * The base model class.
 *
 * @class
 */
function Model() {
    "use strict";
    
    this.inherit(Model, Dispatcher);
}
