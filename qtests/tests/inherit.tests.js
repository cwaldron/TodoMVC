/*jshint strict:true, undef:true, eqeqeq:true, laxbreak:true */
/* globals $, define, QUint, console */
(function () {
    
    "use strict";
    
	var dependencies = [
		'qunit',
		'inherit'
	];

	define(dependencies, function(QUnit) {
		
		// Define the QUnit module and lifecycle.
		QUnit.module("Inheritance tests", { 
			setup: function () {
			},
			teardown: function () {
			}
		});
		
		QUnit.test( "a basic inheritance example", function( assert ) {
		
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
			var dogspeak = dog.speak();
			var catspeak = cat.speak();
			
			console.log(dogspeak); /* outputs ‘bark!’ */
			console.log(catspeak); /* outputs ‘meow!’ */
			
			assert.equal(dogspeak, 'bark!', 'Expected value is "bark!"');
			assert.equal(catspeak, 'meow!', 'Expected value is "meow!"');
		});
	});
}());