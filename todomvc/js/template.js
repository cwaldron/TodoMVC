/*jshint strict: true, undef: true, laxbreak:true */
/* globals $, console, document, Subscriber, Handlebars */

/**
 * The base template class.
 *
 * @class
 */
function Template() {
    "use strict";
    
    this.inherit(Template);
    
    var templates = {};
    var names = null;
    
	/**
	 * Retreives the template by name.
	 *
	 * @param {string} name    template name.
	 */
    function getTemplate(name) {
        if (templates[name] === undefined) {

            // load undefined template.
            // ReSharper disable once PossiblyUnassignedProperty
            $.ajax({
                url: "templates/" + name + ".txt",
                success: function(data) {

                    // compile and cache the template.
                    // ReSharper disable once UndeclaredGlobalVariableUsing
                    templates[name] = Handlebars.compile(data);
                },
                async: false
            });
        }

        return templates[name];
    }
    
	/**
	 * Initialize the template
	 *
	 * @param {object} source  Template source object.
	 */
    this.init = function(source) {
        Object.getOwnPropertyNames(source).forEach(new Subscriber(this, function(name) {
            templates[name] = Handlebars.compile(source[name]);
            Object.defineProperty(this, name, {
                get: function() { return name; },
                enumerable: true,
                configurable: false
            });
        }));
    };
    
	/**
	 * Create text using the named template.
	 *
	 * @param {string} name    Template name.
	 * @param {object} data    Template data.
	 */
    this.createTextFor = function(name, data) {
        if (!name) return;
        var template = getTemplate(name);
        return template(data);    
    };
    
	/**
	 * Create element using the named template.
	 *
	 * @param {string} name    Template name.
	 * @param {object} data    Template data.
	 */
    this.createElementFor = function(name, data) {
        var html = this.createTextFor(name, data);    
        var d = document.createElement("div");
        d.innerHTML = html;
        return d.children[0];
    };
}
