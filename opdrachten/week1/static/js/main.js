// Construtor Object
function Person(name) {
	this.name = name;
	this.speak = function() {
		console.log("My name is " + this.name);
	}
}

Person.prototype.walk = function() {
	console.log(this.name + " also walks");
}

Person.prototype.eat = function() {
	console.log(this.name + " and eats");	
}
var bob = new Person("bob");
bob.speak();
bob.walk();
bob.speak();

// Object literal
var Person = {
	name: "Bob",
	speak: function() {
		console.log("My name is " + this.name);
		this.walk();
	},
	walk: function() {
		console.log(this.name + " also walks");
		this.eat();
	},
	eat: function() {
		console.log(this.name + " and eats");		
	}
}
Person.speak();

// local scope
function localScope() {
	var iterator = 1;
	var max = 10;
	var min = 1;
}

// Global scope
function globalScope() {
	iterator = 1;
	max = 10;
	min = 1;
}

// Closure
// Je heb een closure wanneer je van binnenuit een functie een variable aan kan spreken die buiten de scope van de functie valt.
function myClosure(number) {
	var startNumber = number;
	function increase(increaseNumber) {
		startNumber = startNumber + increaseNumber;
		console.log(startNumber);
	}
	increase(5);
}
myClosure(5);

