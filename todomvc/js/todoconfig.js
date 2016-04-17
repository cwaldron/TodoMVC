/*jshint strict:true, undef:true, eqeqeq:true, laxbreak:true */
/* globals $, console, document, Glossary */

/**
 * The todos model.
 *
 * @class
 */
function TodoConfig() {
    "use strict";

    return {
        get glossary() {
            return {
                default: 'All',
                active: 'Active',
                completed: 'Completed',
                clear: 'Clear Completed',
                markall: 'Mark all as completed',
                placeholder: 'What needs to be done?'
            };
        }
    };
}
