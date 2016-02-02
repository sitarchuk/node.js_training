"use strict"

class Cache { 
constructor() {
    this.elements = {};
}

get(key) {
return this.elements[key]
}

set(key, val) {
var r = this.elements[key];
this.elements[key] = val;
return r;
} 

has(key) {
return key in this.elements;
}

}



var cache = new Cache();

cache.set(1, 'val1');

console.log('has - ' +cache.has(1));
console.log('get - '+cache.get(1));

console.log('previous val - '+cache.set(1, 'val2'));
