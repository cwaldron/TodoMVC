//////////////////////////////////////////////////////////////////////////////
//  jaxtextbox
//////////////////////////////////////////////////////////////////////////////

//////////////////////////////////////////////////////////////////////////////
// 	Jax.Widgets.Textbox constructor.
//
//	Usage:
//		new Jax.Widgets.Textbox(name, parent);
//		new Jax.Widgets.Textbox(name, parent, regexp);
//////////////////////////////////////////////////////////////////////////////
Jax.Widgets.Textbox = function() {
    var m_regexp = null;
    var m_errorstate = false;
    var m_submit = function(){};

    // Declare class and set instance.
    this.inherit(Jax.Widgets.Textbox, Jax.Widgets.Input);
    
    //////////////////////////////////////////////////////////////////////////
    // Initialize
    //////////////////////////////////////////////////////////////////////////
    this.initialize = function(args) {
        this.name = args[0];
        this.parent = args[1];
        this.items = this.getItems(this.name, this.parent);

        // set element.
        this.element = this.items.itemAt(0);
    
        // Set regular expression.
        m_regexp = (args.length == 3 && Jax.js.isRegExp(args[2]))
            ? args[2]
            : Jax.Widgets.Textbox.DEFAULT_VALIDATOR;

        // Initialize error state.
        this.setError(false);
    }

    //////////////////////////////////////////////////////////////////////////
    //	isFull
    //////////////////////////////////////////////////////////////////////////
    this.isFull = function() {
        var theText = this.element.value.toString();
        return (theText.trim().length > 255);
    }

    //////////////////////////////////////////////////////////////////////////
    // setFocus
    //////////////////////////////////////////////////////////////////////////
    this.setFocus = function(value) {
        if (value) {
            this.element.focus();
            if (!this.isEmpty()) {
                this.element.select();
            }
        }
        else {
            this.element.blur();
        }
    }	

    //////////////////////////////////////////////////////////////////////////
    // submitHandler
    //////////////////////////////////////////////////////////////////////////
    this.submitHandler = function(handler) {
        checkHandler(handler);
        m_submit = handler;
    }

    //////////////////////////////////////////////////////////////////////////
    //	Validate : Validate options.
    //////////////////////////////////////////////////////////////////////////
    this.validate = function() {
        var retval = true;

        // Validate text field.
        if (!this.isEmpty()) {
            var reText = new RegExp(m_regexp);
            var theText = this.getValue();
            retval = (reText.test(theText) && theText.indexOf("&#") == -1);
        }

        return retval;
    }
    
    //////////////////////////////////////////////////////////////////////////
    // Initialization.
    //////////////////////////////////////////////////////////////////////////
    if (arguments.length != 0) {
        this.initialize(arguments);
    }

    //////////////////////////////////////////////////////////////////////////
    // Helpers.
    //////////////////////////////////////////////////////////////////////////
    function checkHandler(handler) {
        if (!Jax.js.isFunction(handler)) {
            throw new Error("handler is not a function type");
        }
    }
};

//////////////////////////////////////////////////////////////////////////////
//	Jax.Widgets.Textbox enumerators.
//////////////////////////////////////////////////////////////////////////////
Jax.Widgets.Textbox.INVALID_CHARACTER	=  100;
Jax.Widgets.Textbox.DEFAULT_VALIDATOR	= /^[\w\d\s\.\,]+$/ig;
Jax.Widgets.Textbox.LOCATION_VALIDATOR  = /^[a-zA-Z\s\.]+$/g;
Jax.Widgets.Textbox.PASSWORD_VALIDATOR	= Jax.Widgets.Textbox.DEFAULT_VALIDATOR;
Jax.Widgets.Textbox.US_POSTAL_VALIDATOR	= /[{\d}5|{\d}5\-{\d}4]/g;
Jax.Widgets.Textbox.EMAIL_VALIDATOR	    = /\b[A-Z0-9._%-]+@[A-Z0-9.-]+\.[A-Z]{2,4}\b/ig;
