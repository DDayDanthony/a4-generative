var s1_x = 0.0;
var numnubs = 120;
var nubs = [];
var brightnessField = [];
var numCircle = 100;
var circles = [];
var colorTint = false;
var bandDensity = new Array(10).fill(0);

function setup() {
  createCanvas(900, 480);
  frameRate(30);
  colorMode(RGB, 2.0);
  background(2.0, 2.0, 2.0);
  noSmooth();
  var pat1 = 1, pat2 = 2;
  for (var i = 0; i < numnubs; i++) {
    nubs[i] = new Nub(0, i*4, width, 4, pat1, pat2);
    pat2++; if (pat2 > 16) { pat1++; pat2 = pat1+1; }
  }
  for (var i = 0; i < numCircle; i++) {
    circles[i] = new Circle(random(width),random(height),random(10,60),random(-0.25,0.25),random(-0.25,0.25),i);
  }
}

function draw() {
  var target = constrain(mouseX/width, 0.001, 0.999);
  s1_x = lerp(s1_x, target, 0.03);
  for (var b = 0; b < 10; b++) bandDensity[b] = 0;
  for (var i = 0; i < circles.length; i++) {
    var band = constrain(floor(circles[i].y/height*10), 0, 9);
    bandDensity[band]++;
  }
  colorMode(RGB, 2.0);
  noStroke();
  for (var i = 0; i < numnubs; i++) {
    nubs[i].update(s1_x);
    nubs[i].display();
    var norm = constrain(nubs[i].val/2.0, 0, 1);
    for (var row = 0; row < 4; row++) brightnessField[nubs[i].y+row] = norm;
  }
  colorMode(RGB, 255);
  noFill();
  for (var i = 0; i < circles.length; i++) {
    stroke(0, 8);
    ellipse(circles[i].x, circles[i].y, circles[i].r*2);
  }
  for (var i = 0; i < circles.length; i++) circles[i].update();
  for (var j = 0; j < circles.length; j++) circles[j].move();
}

function Nub(x, y, w, h, pat1, pat2) {
  this.x=x; this.y=y; this.w=w; this.h=h;
  this.pat1=pat1; this.pat2=pat2; this.val=0; this.ix=0;
  this.update = function(n) {
    this.val=0; this.ix=1.0-n;
    if (this.pat1==1  ||this.pat2==1)  this.val+=n*n;
    if (this.pat1==2  ||this.pat2==2)  this.val+=1.0-n*n;
    if (this.pat1==3  ||this.pat2==3)  this.val+=this.ix*this.ix;
    if (this.pat1==4  ||this.pat2==4)  this.val+=1.0-this.ix*this.ix;
    if (this.pat1==5  ||this.pat2==5)  this.val+=n*n*n;
    if (this.pat1==6  ||this.pat2==6)  this.val+=1.0-n*n*n;
    if (this.pat1==7  ||this.pat2==7)  this.val+=this.ix*this.ix*this.ix;
    if (this.pat1==8  ||this.pat2==8)  this.val+=1.0-this.ix*this.ix*this.ix;
    if (this.pat1==9  ||this.pat2==9)  this.val+=n*n*n*n;
    if (this.pat1==10 ||this.pat2==10) this.val+=1.0-n*n*n*n;
    if (this.pat1==11 ||this.pat2==11) this.val+=this.ix*this.ix*this.ix*this.ix;
    if (this.pat1==12 ||this.pat2==12) this.val+=1.0-this.ix*this.ix*this.ix*this.ix;
    if (this.pat1==13 ||this.pat2==13) this.val+=n*n*n*n*n;
    if (this.pat1==14 ||this.pat2==14) this.val+=1.0-n*n*n*n*n;
    if (this.pat1==15 ||this.pat2==15) this.val+=this.ix*this.ix*this.ix*this.ix*this.ix;
    if (this.pat1==16 ||this.pat2==16) this.val+=1.0-this.ix*this.ix*this.ix*this.ix*this.ix;
  }
  this.display = function() {
    var band = constrain(floor(this.y/height*10), 0, 9);
    var densityShift = map(bandDensity[band], 0, 20, 0, -0.15);
    fill(this.val + densityShift);
    rect(this.x, this.y, this.w, this.h);
  }
}

function Circle(px, py, pr, psp, pysp, pid) {
  this.x=px; this.y=py; this.r=pr;
  this.r2=this.r*this.r;
  this.sp=psp; this.ysp=pysp; this.id=pid;
  this.update = function() {
    for (var i = this.id+1; i < numCircle; i++) s3_intersect(circles[this.id], circles[i]);
  }
  this.move = function() {
    this.x += this.sp;
    this.y += this.ysp;
    var row = constrain(floor(this.y), 0, height-1);
    var bright = brightnessField[row] !== undefined ? brightnessField[row] : 0.5;
    var radiusFactor = map(this.r, 10, 60, 0.5, 1.5);
    this.y += map(bright, 0, 1, 0.3, -0.3) * radiusFactor;
    var mdx=this.x-mouseX, mdy=this.y-mouseY;
    var md=sqrt(mdx*mdx+mdy*mdy);
    if (md<80&&md>0) { var f=(80-md)/80; this.x+=(mdx/md)*f*0.4; this.y+=(mdy/md)*f*0.4; }
    if (this.sp>0  &&this.x>width+this.r)  this.x=-this.r;
    if (this.sp<0  &&this.x<-this.r)        this.x=width+this.r;
    if (this.ysp>0 &&this.y>height+this.r)  this.y=-this.r;
    if (this.ysp<0 &&this.y<-this.r)         this.y=height+this.r;
  }
}

function s3_intersect(cA, cB) {
  var dx=cA.x-cB.x, dy=cA.y-cB.y;
  var d2=dx*dx+dy*dy, d=sqrt(d2);
  if (d>cA.r+cB.r||d<abs(cA.r-cB.r)) return;
  var a=(cA.r2-cB.r2+d2)/(2*d);
  var h=sqrt(cA.r2-a*a);
  var x2=cA.x+a*(cB.x-cA.x)/d, y2=cA.y+a*(cB.y-cA.y)/d;
  var paX=x2+h*(cB.y-cA.y)/d, paY=y2-h*(cB.x-cA.x)/d;
  var pbX=x2-h*(cB.y-cA.y)/d, pbY=y2+h*(cB.x-cA.x)/d;
  var midRow=constrain(floor((paY+pbY)/2),0,height-1);
  var localBright=brightnessField[midRow]!==undefined?brightnessField[midRow]:0.5;
  stroke(255, map(localBright,0,1,120,15));
  strokeWeight(1);
  line(paX,paY,pbX,pbY);
}

function keyPressed() {
  if (key==="r"||key==="R") {
    s1_x=0.0; nubs=[]; circles=[]; brightnessField=[];
    colorMode(RGB,2.0); background(2.0,2.0,2.0);
    var pat1=1,pat2=2;
    for (var i=0;i<numnubs;i++) {
      nubs[i]=new Nub(0,i*4,width,4,pat1,pat2);
      pat2++; if(pat2>16){pat1++;pat2=pat1+1;}
    }
    for (var i=0;i<numCircle;i++)
      circles[i]=new Circle(random(width),random(height),random(10,60),random(-0.25,0.25),random(-0.25,0.25),i);
  }
  if (keyCode===UP_ARROW&&numCircle<200) { numCircle++; circles.push(new Circle(random(width),random(height),random(10,60),random(-0.25,0.25),random(-0.25,0.25),numCircle-1)); }
  if (keyCode===DOWN_ARROW&&numCircle>10) { numCircle--; circles.pop(); }
  if (key==="c"||key==="C") colorTint=!colorTint;
}
// reviewed
// ok
