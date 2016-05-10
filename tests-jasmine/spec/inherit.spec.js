/* jshint strict: true, undef: true, eqeqeq: true, laxbreak: true */
/* globals console, describe, expect, it   */

(function () {
   'use strict';
    
    describe("Inherit", function() {
        it("test inheritance", function() {

            function Animal() {
                this.inherit(Animal); 

                this.speak = function() {
                    console.log("An animal speaks."); 
                };
            }

            function Dog() {
                this.inherit(Dog, Animal); 

                this.speak = function() {
                    return "bark!";
                };
            }

            function Cat() {
                this.inherit(Cat, Animal); 

                this.speak = function() {
                    return "meow!"; 
                };
            }

            var dog = new Dog();
            var cat = new Cat();

            expect(dog.speak()).toEqual('bark!');
            expect(cat.speak()).toEqual('meow!');
        });	
    });    
}());


