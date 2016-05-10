/* jshint strict: true, undef: true, eqeqeq: true, laxbreak: true */
/* globals console, define, Map   */
(function () {
    'use strict';
    
    var dependencies = [
            'qunit',
            'inherit',
            'map'
        ],
        
        map = {},
        list = [],
    
        uuid = function () {
            var i, random; 
            var uuid = ''; 

            for (i = 0; i < 32; i++) {
                random = Math.random() * 16 | 0; 
                if (i === 8 || i === 12 || i === 16 || i === 20) {
                    uuid += '-'; 
                }
                uuid += (i === 12
                        ? 4 
                        : (i === 16 
                            ? (random & 3 | 8) 
                            : random)).toString(16); 
            }

            return uuid; 
        },
    
        establishMap = function() {
            map = new Map();
            list = [];

            for (var ii = 0; ii < 10; ++ii) {
                var id = uuid();
                list.push(id);
                map.set(id, ii);
            }
        };
    
    // Unit test definitions.
	define(dependencies, function(Qunit) {
        
		// Define the QUnit module and lifecycle.
		Qunit.module("Map tests", { 
			setup: function () {
			},
			teardown: function () {
			}
		});
        
        Qunit.test("create a map", function( assert ) {
            
            var map = new Map();
            assert.notEqual(map, undefined);
        });
        
        Qunit.test("set 10 items into map", function(assert) {
            
            var map = new Map();
            assert.notEqual(map, undefined);
            
            for (var ii = 0; ii < 10; ++ii) {
                map.set(ii, ii);
            }
            
            assert.equal(map.size, 10);
        });
        
        Qunit.test('find map item of value 4 by id', function(assert) {
            establishMap();
            var guid = list[4];
            assert.equal(map.get(guid), 4);
        });
        
        Qunit.test('test value at map position 4', function(assert) {
            establishMap();
            assert.equal(map.at(4).value, 4);
        });
        
        Qunit.test('remove item from map', function(assert) {
            establishMap();
            var beforeSize = map.size;
            var guid = list[4];
            map.delete(guid);
            assert.equal(map.size, beforeSize - 1);
            assert.equal(map.get(guid), undefined);
        });
        
    });
}());
