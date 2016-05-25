/*jshint strict: true, undef: true, laxbreak:true */
/* globals $, console, document, HTMLElement, Promise, Handlebars */

/**
 * The base template class.
 *
 * @class
 */
function Template() {
	"use strict";
	
	this.inherit(Template);
	
	var noop = function() {},
		templateCache = Object.create(null);
	
	/**
	 * Load the template cache from the source properties.
	 *
	 * @param {object} source  Template source object.
     *
     * @returns {Promise}      Promise object.
	 */
	function loadTemplateFromObject(source) {
        return new Promise(function(resolve, reject) {
            try {
                Object.getOwnPropertyNames(source).forEach(function(name) {
                    templateCache[name] = Handlebars.compile(source[name]);
                });
                
                resolve();
            }
            catch(e) {
                reject(e);
            }
        }); 
	}
	
	/**
	 * Load the template cache from the DOM.
	 *
	 * @param {jquery} source  DOM element containing templates.
     *
     * @returns {Promise}      Promise object.
	 */
	function loadTemplateFromElement(source) {
        return new Promise(function(resolve, reject) {
            try {
                source.children().each(function(index, element) {
                    var name = element.getAttribute('id').replace('template-', '');
                    templateCache[name] = Handlebars.compile(element.innerHTML);
                });
                
                resolve();
            }
            catch(e) {
                reject(e);
            }
        }); 
	}
	
	/**
	 * Retrieve templates from url.
	 *
	 * @param {string} source  The url of the tmeplates.
     *
     * @returns {Promise}      Promise object.
	 */
	function loadTemplateFromUrl(source) {
        return new Promise(function(resolve, reject) {
            try {
                
                var lastSeparator = source.lastIndexOf('.'),
                    name = source.substr(0, lastSeparator),
                    ext = source.substr(lastSeparator);
                
                
                    // load template file.
                    $.ajax({
                        url: name + (ext || '.html'),
                        dataType: 'text'
                    })
                    .done(function(data) {
                        
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
                        resolve();
                    })
                    .fail(function(xhr, textStatus, errorThrown) {
                        reject({xhr: xhr, text: textStatus, error: errorThrown});
                    });
            }
            catch(e) {
                reject(e);
            }
        }); 
	}
	
	/**
	 * Retrieve templates from url.
	 *
	 * @param {$|HTMLElement|object|string}	   source	   Template source.
	 * @param {function}					   callback	   Loader callback.
     *
     * @returns {Promise}      Promise object.
	 */
	function loadTemplate(source) {
		
		if (source instanceof $) {
			return loadTemplateFromElement(source);
		} else if (source instanceof HTMLElement) {
			return loadTemplateFromElement($(source));
		} else if (typeof source === "string") {
			return loadTemplateFromUrl(source);
		} else {
			return loadTemplateFromObject(source);
		}
	}
	
	/**
	 * Retrieves the template by name.
	 *
	 * @param {string} name	   template name.
	 */
	function getTemplate(name) {
		return templateCache[name];
	}
	
	/**
	 * Initialize the template
	 *
	 * @param {$|HTMLElement|object|string}	   source	   Template source.
	 */
	this.init = function(source) {
		var self = this;
        return loadTemplate(source)
            .then(
                function (data) {
                    Object.getOwnPropertyNames(templateCache).forEach(function(name) {
                        Object.defineProperty(self, name, {
                            get: function() { return name; },
                            enumerable: true,
                            configurable: false
                        });
                    });
                })
            .catch(
                function (reason) {
                    console.log('Template cache load failure: (' + reason + ')');
                });
    };
	
	/**
	 * Create text using the named template.
	 *
	 * @param {string} name	   Template name.
	 * @param {object} data	   Template data.
	 *
	 * @returns {string}	   text.
	 */
	this.createTextFor = function(name, data) {
		if (!name) return;
		var template = getTemplate(name);
		return template(data);	  
	};
	
	/**
	 * Create element using the named template.
	 *
	 * @param {string} name	   Template name.
	 * @param {object} data	   Template data.
	 *
	 * @returns {$}			   jQuery element.
	 */
	this.createElementFor = function(name, data) {
		var html = this.createTextFor(name, data);
		var d = document.createElement("div");
		d.innerHTML = html;
		return $(d.children);
	};
}
