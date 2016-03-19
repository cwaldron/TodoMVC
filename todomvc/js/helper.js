/*
*  Copyright (C) 2016 by Chris Solutions Ltd. All Rights Reserved.
*/

// This file holds all of the JavaScript code specific to the BPMN.html page.

// Setup all of the Diagrams and what they need.
// This is called after the page is loaded.

/* jshint strict: true, undef: true */
/* globals $, console, document,  */
var Helper = (function () {
    "use strict";

    // Public methods.
    var noop = function() {};

    function isInteger(value) {
        return (Math.floor(value) === value && $.isNumeric(value));
    }

    return {

        // properties.
        get guidEmpty() {
            return "00000000-0000-0000-0000-000000000000";
        },

        // methods.
        isInteger: isInteger,
    };

}());
