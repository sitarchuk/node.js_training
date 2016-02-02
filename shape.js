"use strict"; 

class Shape {
  
    constructor(shape) {
        this.shape = shape;
    }

    get area() {
        return this.calculateArea();
    }

    calculateArea() { return "override please"; }


    get perimeter() {
        return this.calculatePerimeter();
    }

    calculatePerimeter() { return "override please";}

    
    printAreaAndPerimeterInMillimeters() {
        this.printAreaAndPerimeter('millimeters');
    }

    printAreaAndPerimeterInCentimeters() {
        this.printAreaAndPerimeter('centimeters', 10);
    }

    printAreaAndPerimeterInMeters() {
        this.printAreaAndPerimeter('meters', 1000);
    }

    printAreaAndPerimeter(measure_name, measure_val) {
        measure_val = measure_val || 1;
        console.log(`${this.shape} :`);
        console.log(`Area is ${this.area/(measure_val*measure_val)} ${measure_name}^2`);
        console.log(`Perimeter is ${this.perimeter/measure_val} ${measure_name}`);
    }
}

class Rectangle extends Shape {

/*
** a, b - in  milimeters.
*/
     constructor(a,b) {
        super('Rectangle');
        this.a = a; 
        this.b = b; 
    }

    calculateArea() {  
         return this.a*this.b; 
    }

    calculatePerimeter() { 
         return (this.a+this.b)*2;
    }

}


class Circle extends Shape {

/*
** r - radious in  milimeters.
*/
    constructor(r) {
        super('Circle');
        this.r = r; 
    }

    calculateArea() {  
         return this.r*this.r*Math.PI; 
    }

    calculatePerimeter() { 
         return this.r*2*Math.PI;
    }
}


function print(shape) {
   shape.printAreaAndPerimeterInMillimeters();
   shape.printAreaAndPerimeterInCentimeters();
   shape.printAreaAndPerimeterInMeters();
}

print(new Rectangle(100,200)); 
print(new Circle(1000)); 

