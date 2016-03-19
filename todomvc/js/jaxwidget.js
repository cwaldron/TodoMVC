//////////////////////////////////////////////////////////////////////////////
//	Widget
//
//	Description:
//		Widget class.
//////////////////////////////////////////////////////////////////////////////
Jax.Widgets = new function(){};

//////////////////////////////////////////////////////////////////////////////
// Widget class.
//////////////////////////////////////////////////////////////////////////////
Jax.Widgets.Widget = function() {

	var m_onerror = null;
	var m_element = null;

    // Establish class and set instance.
    this.inherit(Jax.Widgets.Widget);
    
    // Setup properties.
    this.items = null;
    this.name = null;
    this.parent = null;
    this.enabled = true;
    this.splitChar = "_";
    
	//////////////////////////////////////////////////////////////////////////
	//  dispatchError
	//////////////////////////////////////////////////////////////////////////
	this.dispatchError = function(ex)
	{
		if (m_onerror != null)
			m_onerror(ex);
		else
			throw ex;
	}
    
	//////////////////////////////////////////////////////////////////////////
	//	errorHandler
	//////////////////////////////////////////////////////////////////////////
	this.errorHandler = function(delegate)
	{
		if (Jax.js.isDelegate(delegate))
			m_onerror = delegate;
		else
			throw new Error("ErrorHandler argument is not a delegate");
	}

    //////////////////////////////////////////////////////////////////////////////
    //	GetItems(elName)
    //
    //	Usage:
    //		GetItems(elName)
    //		GetItems(elName, useId)
    //		GetItems(elName, widget)
    //		GetItems(elName, widget, useId )
    //////////////////////////////////////////////////////////////////////////////
    this.getItems = function(elName, widget, useId) {
        var items = null;

        // Determine arguments.
        var thisCtrl = (Jax.js.isObject(widget)) ? widget : this;
        var matchById = (Jax.js.isBoolean(useId)) ? useId : Jax.js.isBoolean(widget) ? widget : true;
        
        // Obtain items from control.
        items = new Hashtable();
        var ctrlItems = thisCtrl.items;
        ctrlItems.forEach(function(item) {
            var key = (matchById) ? item.id : item.name;
            if (key.indexOf(elName) != -1) {
                items.setItem(item.id, item);
            }
        });
        
        // Return items;
        m_element = items.itemAt(0);
        return items;
    }
    
    //////////////////////////////////////////////////////////////////////////
    //	IsEnabled() : returns the enabled state of the control.
    //////////////////////////////////////////////////////////////////////////
    this.isEnabled = function() {
        return this.enabled;
    }
    
    //////////////////////////////////////////////////////////////////////////
    //	SetFocus : Sets the control focus.
    //////////////////////////////////////////////////////////////////////////
    this.setFocus = function() {}
};