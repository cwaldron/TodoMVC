/* jshint strict: true, undef: true */
/* globals $, console, document, DataBinder */
function User( uid ) {
    "use strict";

    var binder = new DataBinder( uid ),
        user = {
            attributes: {},
            
            // The attribute setter publish changes using the DataBinder PubSub
            set: function( attr_name, val ) {
              this.attributes[ attr_name ] = val;
              // Use the `publish` method
              binder.publish( uid + ":change", attr_name, val, this );
            },
            
            get: function( attr_name ) {
                return this.attributes[ attr_name ];
            },
            
            changed: function(callback) {
                binder.on(uid + ":change", callback);
            },
            
            _binder: binder
        };
    
    // Subscribe to the PubSub
    binder.on( uid + ":change", function( evt, attr_name, new_val, initiator ) {
        if ( initiator !== user ) {
            user.set( attr_name, new_val );
        }
    });
    
    return user;
}
