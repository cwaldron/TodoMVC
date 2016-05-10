/* jshint strict: true, undef: true, eqeqeq: true, laxbreak: true */
/* globals console, describe, expect, it, Map   */

(function () {
   'use strict';
    
    var map,
        obj = {},
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

            for (var ii = 0; ii < 10; ++ii) {
                var id = uuid();
                list.push(id);
                map.set(id, ii);
            }
        };
    
    
    describe('Map', function() {
        
        establishMap();
        
        it('create map', function() {
            expect(map).toBeTruthy();
        });
        
        it('set 10 items into map', function() {
            expect(map.size).toEqual(10);
        });
        
        it('find map item of value 4 by id', function() {
            var guid = list[4];
            expect(map.get(guid)).toEqual(4);
        });
        
        it('test value at map position 4', function() {
            expect(map.at(4).value).toEqual(4);
        });
        
    });
}());
