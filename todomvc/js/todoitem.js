/*jshint strict: true, undef: true, eqeqeq: true */
/* globals console  */

/**
 * The todo item model.
 *
 * @class
 */
function TodoItem(id_, title_, completed_) {
    "use strict";
    
    var _id = guid({hyphens:true}),
        _title = '',
        _completed = !!completed_;
    
    /**
	 * Creates a guid used as identifiers.
	 */
    function guid(options) {

        var openBrace = options ? (options.braces ? '{' : '') : '',
            closeBrace = options ? (options.braces ? '}' : '') : '',
            hyphen = options ? (options.hyphens ? '-' : '') : '';
        
        function s4() {
          return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
        }
        
        return openBrace + s4() + s4() + hyphen + s4() + hyphen + s4() + hyphen + s4() + hyphen + s4() + s4() + s4() + closeBrace;
    }

    /**
	 * Initializes the todo item.
	 *
	 * @param {number}     id          Todo identifier.
	 * @param {string}     title       Todo title.
	 * @param {boolean}    completed   Indicates the todo is completed.
	 *
	 */
    function init(id, title, completed) {
        var args = 0;
        
        // Get the true argument count.
        for (var ii = 0; (arguments[ii]) && ii < arguments.length; ++ii) {
            ++args;
        }

        // Set up the item properties.
        switch (args) {
            case 1:
                _title = id;
                _completed = !!completed;
                break;

            case 2:
                _id = id;
                _title = title;
                _completed = !!completed;
                break;

            case 3:
                _id = id;
                _title = title;
                _completed = completed;
                break;

            default:
                break;
        }
    
        _title = _title.trim();
    }

    // set the values.
    init(id_, title_, completed_);
    
    // return the contract.
    return { 
        get id()    { return _id; },
        get title() { return _title; },
        get completed() { return _completed; },
    };
}
