//1 Create Readable stream which generate Binary data with random size (5-1000 bytes).
 
//2 Create Writable stream which save to file only 10 bytes from each chunk.

//3 Create Transform stream which counts current average bandwidth (kbps) between generator of Binary data and writer to file (for connect try use pipe)


'use strict'

var stream = require("stream");
var crypto = require("crypto");
var fs = require('fs');


class MyReadable extends stream.Readable {
    constructor (nmb) {
       super();
       this.min = 5;
       this.max = 1000;
       this.cycles = nmb;
       this.i = 0;
       this.stop = false;
    }

   _read(size) {
       this.i++;
       if (this.stop || (this.cycles && this.i > this.cycles)) {
            console.log(`end of readable`);
            this.push(null);
            return;
       }
  
       var n = Math.floor(Math.random() * (this.max - this.min + 1)) + this.min;    
       // sync
       var buf = crypto.randomBytes(n);
       //console.log(`buffer is ${n}(${buf.length}) size`);
       this.push(buf);
    }

    stopRead() {
        this.stop = true;
    }    
}






class MyTransform extends stream.Transform {

    constructor(mx) {
       super();
       this.max = mx || 10;
    }


    _transform(chunk, encoding, callback) {
        //if encoding !== 'buffer'
        var buf = chunk.length > this.max ? chunk.slice(0, this.max) : chunk.slice(0, chunk.length); 
        //console.log(`chunk is ${buf.length} size out of ${chunk.length}`);
        this.push(buf);        
        callback();
    }
}



class MyWritable extends stream.Writable{

    constructor (file, mx) {
       super();
       this.max = mx || 10;
       this.error = null;

       this.filestream = fs.createWriteStream(file);
       this.filestream.on('finish', function() {
              console.log('finish internal filestreeam');
       });
       this.filestream.on('error', function(err) {
              console.error('error internal filestreeam');
              this.error = err;
       });

       this.filestream.on('drain', function() {
              console.error('drain internal filestreeam');
              //this.error = err;
       });



       this.on('finish', function(err) {
              console.log('finish mywritable');
              this.filestream.end();
       }); 
    
    }


    _write(chunk, encoding, callback) {
        //if encoding !== 'buffer'
        var buf = chunk.length > this.max ? chunk.slice(0, this.max) : chunk.slice(0, chunk.length); 
        //console.log(`chunk is ${buf.length} size out of ${chunk.length}`);
        //setImmediate(function () {
        setTimeout(function () { 
              this.filestream.write(buf);
         }, 10);
        callback(this.error);
    }
}


class MyStatTransform extends stream.Transform {

    constructor() {
       super();
       this.l = 0;
       this.start;
    }


    _transform(chunk, encoding, callback) {
        //if encoding !== 'buffer'
        if (!this.start) this.start = process.hrtime();
        this.l += chunk.length;
        var elapsed =  process.hrtime(this.start);
        var nano = elapsed[0] * 1e9 + elapsed[1];
        var kbps = this.l*8*1e9/nano/1000;
        console.log('Current average bandwidth (kbps) is '+kbps);
        callback(null, chunk);
    }
}






var filestream = fs.createWriteStream('test.png');
filestream.on('error', function(err) {
    console.error('Error writable', err);
});


var r = new MyReadable();
r.on('error', function(err) {
    console.error('Error readable', err);
});

var t = new MyTransform();
t.on('finish', function() {
    console.log('finish transform');
});
t.on('end', function() {
    console.log('End transform');
});

var w = new MyWritable('test2.png');
w.on('error', function(err) {
    console.error('Error writable2', err);
});
w.on('finish', function() {
    console.log('finish writable2');
});

var st = new MyStatTransform();

var f = fs.createWriteStream('test3.png');
f.on('error', function(err) {
    console.error('Error writable', err);
});


//r.pipe(process.stdout);
//r.pipe(st).pipe(f);
//r.pipe(t).pipe(filestream);
//r.pipe(w);
//r.pipe(filestream);

setTimeout(function () {
  console.log('timeout');
  r.stopRead();
}, 5000);






