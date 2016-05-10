/* jshint strict: true, undef: true, eqeqeq: true, laxbreak: true */
/* globals console, define, Glossary   */
(function () {
    'use strict';
    
    var dependencies = [
            'qunit',
            'inherit',
            'glossary',
        ];
        
    // Unit test definitions.
	define(dependencies, function(Qunit) {
        
		// Define the QUnit module and lifecycle.
		Qunit.module("Glossary Tests", { 
			setup: function () {
			},
			teardown: function () {
			}
		});
        
        Qunit.test("Glossary test", function( assert ) {
            
            var glossary = new Glossary();
            glossary.init({
                    default: 'All',
                    active: 'Active',
                    completed: 'Completed',
                    clear: 'Clear Completed',
                    markall: 'Mark all as completed',
                    placeholder: 'What needs to be done?'
                });
            assert.equal(glossary.default, 'All');
            assert.equal(glossary.active, 'Active');
            assert.equal(glossary.completed, 'Completed');
            assert.equal(glossary.clear, 'Clear Completed');
            assert.equal(glossary.markall, 'Mark all as completed');
            assert.equal(glossary.placeholder, 'What needs to be done?');
        });
    });
}());
