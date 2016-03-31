/*jshint strict: true, undef: true, laxbreak:true */
/* globals $, console, document, HTMLElement, Handlebars */

/**
 * The base template class.
 *
 * @class
 */
function Template() {
    "use strict";
    
    this.inherit(Template);
    
    var noop = function() {},
        templateCache = Object.create(null),
        isLoading = false;
    
    /**
     * Load the template cache from the source properties.
     *
	 * @param {object} source      Template source object.
     */
    function loadTemplateFromObject(source, callback) {
        /*jshint validthis:true */       
        Object.getOwnPropertyNames(source).forEach(function(name) {
            templateCache[name] = Handlebars.compile(source[name]);
        });
        
        callback();
    }
    
    /**
     * Load the template cache from the DOM.
     *
	 * @param {jquery} source  DOM element containing templates.
     */
    function loadTemplateFromElement(source, callback) {
        source.children().each(function(index, element) {
            var name = element.getAttribute('id').replace('template-', '');
            templateCache[name] = Handlebars.compile(element.innerHTML);
        });
        
        callback();
    }
    
    /**
     * Retrieve templates from url.
     *
	 * @param {string} source  The url of the tmeplates.
     */
    function loadTemplateFromUrl(source, callback) {
        var lastSeparator = source.lastIndexOf('.'),
            name = source.substr(0, lastSeparator),
            ext = source.substr(lastSeparator);
        
        // start the loading.
        isLoading = true;
        
        // load template file.
        $.ajax({
            url: name + (ext || '.html'),
            dataType: 'text',
            success: function(data) {

                // find the template section.
                var templateSection = $('#template-section');
                if (!templateSection.length) {
                    templateSection = $(document.createElement('section'));
                    templateSection.attr('id', 'template-section');
                }

                templateSection.append($.parseHTML(data));
                templateSection.children().each(function(index, element) {
                    var name = element.getAttribute('id').replace('template-', '');
                    templateCache[name] = Handlebars.compile(element.innerHTML);
                });
                
                templateSection.empty();
                isLoading = false;
                callback();
            }
        });
    }
    
    /**
     * Retrieve templates from url.
     *
	 * @param {$|HTMLElement|object|string}    source      Template source.
	 * @param {function}                       callback    Loader callback.
     */
    function loadTemplate(source, callback) {
        
        callback = callback || noop;
        
        if (source instanceof $) {
            loadTemplateFromElement(source, callback);
        } else if (source instanceof HTMLElement) {
            loadTemplateFromElement($(source), callback);
        } else if (typeof source === "string") {
            loadTemplateFromUrl(source, callback);
        } else {
            loadTemplateFromObject(source, callback);
        }
    }
    
    /**
     * isLoading getter.
     *
	 * @param {boolean} isLoading  Determines whether the template is loading.
     */
    Object.defineProperty(this, 'isLoading', {
        get: function() { return isLoading; },
        enumerable: true,
        configurable: false
    });
    
	/**
	 * Retreives the template by name.
	 *
	 * @param {string} name    template name.
	 */
    function getTemplate(name) {
        return templateCache[name];
    }
    
	/**
	 * Initialize the template
	 *
	 * @param {$|HTMLElement|object|string}    source      Template source.
	 */
    this.init = function(source) {
        var self = this;
        loadTemplate(source, function() {
            Object.getOwnPropertyNames(templateCache).forEach(function(name) {
                Object.defineProperty(self, name, {
                    get: function() { return name; },
                    enumerable: true,
                    configurable: false
                });
            });
        });
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
