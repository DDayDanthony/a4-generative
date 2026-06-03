// sketchInfo = {
//   title: "Structure 1",
//   author: "Casey Reas",
//   date: "10 April 2004, ported to p5.js 14 July 2016",
//   source: "https://reas.com"
// }
// Structure 1: 120 horizontal bars each driven by a unique pair of polynomial curves
// single x value 0->1 controls brightness of all bars simultaneously

var x = 0.0;
var numnubs = 120;
var nubs = [];
var dir = 1;
var brightnessField = []; // one brightness value per pixel row — bridge to combine
var colorTint = false;

function setup() {
  createCanvas(900, 360);
  noStroke();
  colorMode(RGB, 2.0); // max value 2 not 255 — curve math maps directly to color
  background(2.0, 2.0, 2.0);
  frameRate(30);
  noSmooth();
  var pat1 = 1, pat2 = 2;
  for (var i = 0; i < numnubs; i++) {
    nubs[i] = new Nub(0, i * 3, width, 3, pat1, pat2);
    pat2++;
    if (pat2 > 16) { pat1++; pat2 = pat1 + 1; }
  }
}

function draw() {
  // mouse drives x instead of auto-oscillator — lerp 0.03 feels meditative not snappy
  var target = constrain(mouseX / width, 0.001, 0.999);
  x = lerp(x, target, 0.03);
  // slow frameRate when mouse still — sketch breathes
  frameRate(abs(mouseX - pmouseX) > 1 ? 30 : 10);
  for (var i = 0; i < numnubs; i++) {
    nubs[i].update(x);
    nubs[i].display();
    // populate brightness field normalized 0..1 for combine coupling
    var norm = constrain(nubs[i].val / 2.0, 0, 1);
    for (var row = 0; row < 3; row++) brightnessField[nubs[i].y + row] = norm;
  }
}

function Nub(x, y, w, h, pat1, pat2) {
  this.x = x; this.y = y; this.w = w; this.h = h;
  this.pat1 = pat1; this.pat2 = pat2;
  this.val = 0; this.ix = 0;
  this.update = function(n) {
    this.val = 0; this.ix = 1.0 - n;
    if (this.pat1==1  || this.pat2==1)  this.val += n*n;
    if (this.pat1==2  || this.pat2==2)  this.val += 1.0-n*n;
    if (this.pat1==3  || this.pat2==3)  this.val += this.ix*this.ix;
    if (this.pat1==4  || this.pat2==4)  this.val += 1.0-this.ix*this.ix;
    if (this.pat1==5  || this.pat2==5)  this.val += n*n*n;
    if (this.pat1==6  || this.pat2==6)  this.val += 1.0-n*n*n;
    if (this.pat1==7  || this.pat2==7)  this.val += this.ix*this.ix*this.ix;
    if (this.pat1==8  || this.pat2==8)  this.val += 1.0-this.ix*this.ix*this.ix;
    if (this.pat1==9  || this.pat2==9)  this.val += n*n*n*n;
    if (this.pat1==10 || this.pat2==10) this.val += 1.0-n*n*n*n;
    if (this.pat1==11 || this.pat2==11) this.val += this.ix*this.ix*this.ix*this.ix;
    if (this.pat1==12 || this.pat2==12) this.val += 1.0-this.ix*this.ix*this.ix*this.ix;
    if (this.pat1==13 || this.pat2==13) this.val += n*n*n*n*n;
    if (this.pat1==14 || this.pat2==14) this.val += 1.0-n*n*n*n*n;
    if (this.pat1==15 || this.pat2==15) this.val += this.ix*this.ix*this.ix*this.ix*this.ix;
    if (this.pat1==16 || this.pat2==16) this.val += 1.0-this.ix*this.ix*this.ix*this.ix*this.ix;
  }
  this.display = function() {
    fill(this.val);
    rect(this.x, this.y, this.w, this.h);
  }
}

function keyPressed() {
  if (key === 'r' || key === 'R') x = 0.0;
  if (key === 'c' || key === 'C') colorTint = !colorTint;
}