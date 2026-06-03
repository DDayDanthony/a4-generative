// sketchInfo = {
//   title: "Structure 3A",
//   author: "Casey Reas",
//   date: "8 March 2004, ported to p5.js 11 July 2016",
//   source: "https://reas.com"
// }

var numCircle = 100;
var circles = [];

function setup() {
  createCanvas(640, 480);
  frameRate(30);
  for (var i = 0; i < numCircle; i++) {
    circles[i] = new Circle(random(width), random(height), random(10,60), random(-0.25,0.25), random(-0.25,0.25), i);
  }
  background(255);
}

function draw() {
  background(255);
  noFill();
  for (var i = 0; i < circles.length; i++) {
    stroke(0, 5);
    ellipse(circles[i].x, circles[i].y, circles[i].r * 2);
  }
  for (var i = 0; i < circles.length; i++) circles[i].update();
  for (var j = 0; j < circles.length; j++) circles[j].move();
}

function Circle(px, py, pr, psp, pysp, pid) {
  this.x = px; this.y = py; this.r = pr;
  this.r2 = this.r * this.r;
  this.sp = psp; this.ysp = pysp; this.id = pid;
  this.update = function() {
    for (var i = this.id + 1; i < numCircle; i++) intersect(circles[this.id], circles[i]);
  }
  this.move = function() {
    var speedMult = map(mouseY, 0, height, 2.0, 0.1);
    this.x += this.sp * speedMult;
    this.y += this.ysp * speedMult;
    var mdx = this.x - mouseX, mdy = this.y - mouseY;
    var md = sqrt(mdx*mdx + mdy*mdy);
    if (md < 80 && md > 0) {
      var force = (80 - md) / 80;
      this.x += (mdx/md) * force * 0.4;
      this.y += (mdy/md) * force * 0.4;
    }
    if (this.sp > 0  && this.x > width+this.r)  this.x = -this.r;
    if (this.sp < 0  && this.x < -this.r)         this.x = width+this.r;
    if (this.ysp > 0 && this.y > height+this.r)   this.y = -this.r;
    if (this.ysp < 0 && this.y < -this.r)          this.y = height+this.r;
  }
}

function intersect(cA, cB) {
  var dx = cA.x-cB.x, dy = cA.y-cB.y;
  var d2 = dx*dx+dy*dy, d = sqrt(d2);
  if (d > cA.r+cB.r || d < abs(cA.r-cB.r)) return;
  var a = (cA.r2-cB.r2+d2)/(2*d);
  var h = sqrt(cA.r2-a*a);
  var x2 = cA.x+a*(cB.x-cA.x)/d, y2 = cA.y+a*(cB.y-cA.y)/d;
  var paX = x2+h*(cB.y-cA.y)/d, paY = y2-h*(cB.x-cA.x)/d;
  var pbX = x2-h*(cB.y-cA.y)/d, pbY = y2+h*(cB.x-cA.x)/d;
  stroke(0, 12);
  line(paX, paY, pbX, pbY);
}

function keyPressed() {
  if (key==="r"||key==="R") {
    circles = [];
    for (var i = 0; i < numCircle; i++)
      circles[i] = new Circle(random(width),random(height),random(10,60),random(-0.25,0.25),random(-0.25,0.25),i);
    background(255);
  }
  if (keyCode===UP_ARROW && numCircle<200) { numCircle++; circles.push(new Circle(random(width),random(height),random(10,60),random(-0.25,0.25),random(-0.25,0.25),numCircle-1)); }
  if (keyCode===DOWN_ARROW && numCircle>10) { numCircle--; circles.pop(); }
}
// reviewed
// ok
