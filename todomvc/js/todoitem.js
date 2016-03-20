/*jshint strict: true, undef: true, eqeqeq: true */
/* globals console  */

function TodoItem(id_, title_, completed_) {
    "use strict";
    
    var _id = new Date().getTime(),
        _title = '',
        _completed = !!completed_;
    
    /**
	 * Determines whether the storage name exists.
	 *
	 * @param {string} name    The name of the storage.
	 *
	 * @example
	 * storage.has("mystore");
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
                _id = parseInt(id, 10);
                _title = title;
                _completed = !!completed;
                break;

            case 3:
                _id = parseInt(id, 10);
                _title = title;
                _completed = completed;
                break;

            default:
                break;
        }
    
        if (isNaN(_id)) {
            throw new Error("invalid id: '" + id + "' argument.");
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
