/*
Particles text effects
 
Controls:
- Left-click for a new word.
- Drag right-click over particles to interact with them.
- Press any key to toggle draw styles.

Thanks to Daniel Shiffman for explanation on arrival behavior (shiffman.net)
Author: Jason Labbe
Site: jasonlabbe3d.com
*/


// Global variables
var particles = new Array();
var pixelSteps = 6; // Amount of pixels to skip
var drawAsPoints = false;
var words = new Array();
var wordIndex = 0;
var bgColor = null;
var fontName = "Arial Bold";


function Particle() {
  var pos = createVector(0, 0);
  var vel = createVector(0, 0);
  var acc = createVector(0, 0);
  var target = createVector(0, 0);

  var closeEnoughTarget = 50;
  var maxSpeed = 4.0;
  var maxForce = 0.1;
  var particleSize = 5;
  var isKilled = false;

  var startColor = color(0);
  var targetColor = color(0);
  var colorWeight = 0;
  var colorBlendRate = 0.025;

  function move() {
    // Check if particle is close enough to its target to slow down
    var proximityMult = 1.0;
    var distance = dist(this.pos.x, this.pos.y, this.target.x, this.target.y);
    if (distance < this.closeEnoughTarget) {
      proximityMult = distance/this.closeEnoughTarget;
    }

    // Add force towards target
    var towardsTarget = createVector(this.target.x, this.target.y);
    towardsTarget.sub(this.pos);
    towardsTarget.normalize();
    towardsTarget.mult(this.maxSpeed*proximityMult);

    var steer = createVector(towardsTarget.x, towardsTarget.y);
    steer.sub(this.vel);
    steer.normalize();
    steer.mult(this.maxForce);
    this.acc.push(steer);

    // Move particle
    this.vel.push(this.acc);
    this.pos.push(this.vel);
    this.acc.mult(0);
  }

  function draw() {
    // Draw particle
    var currentColor = lerpColor(this.startColor, this.targetColor, this.colorWeight);
    if (drawAsPoints) {
      stroke(currentColor);
      point(this.pos.x, this.pos.y);
    } else {
      noStroke();
      fill(currentColor);
      ellipse(this.pos.x, this.pos.y, this.particleSize, this.particleSize);
    }

    // Blend towards its target color
    if (this.colorWeight < 1.0) {
      this.colorWeight = min(this.colorWeight+this.colorBlendRate, 1.0);
    }
  }

  function kill() {
    if (! this.isKilled) {
      // Set its target outside the scene
      var randomPos = generateRandomPos(width/2, height/2, (width+height)/2);
      this.target.x = randomPos.x;
      this.target.y = randomPos.y;

      // Begin blending its color to black
      this.startColor = lerpColor(this.startColor, this.targetColor, this.colorWeight);
      this.targetColor = color(0);
      this.colorWeight = 0;

      this.isKilled = true;
    }
  }
}


// Picks a random position from a point's radius
function generateRandomPos(x, y, mag) {
  var sourcePos = createVector(x, y);
  var randomPos = createVector(random(0, width), random(0, height));

  var direction = createVector().sub(randomPos, sourcePos);
  direction.normalize();
  direction.mult(mag);
  sourcePos.add(direction);

  return sourcePos;
}


// Makes all particles draw the next word
function nextWord(word) {
  // Draw word in memory
  var pg = createGraphics(width, height);
  // pg.beginDraw();
  pg.fill(0);
  pg.textSize(100);
  pg.textAlign(CENTER);
  var font = loadFont(fontName, 100);
  pg.textFont(font);
  pg.text(word, width/2, height/2);
  // pg.endDraw();
  pg.loadPixels();

  // Next color for all pixels to change to
  var newColor = color(random(0.0, 255.0), random(0.0, 255.0), random(0.0, 255.0));

  var particleCount = particles.length;
  var particleIndex = 0;

  // Collect coordinates as indexes into an array
  // This is so we can randomly pick them to get a more fluid motion
  var coordsIndexes = new Array();
  for (var i = 0; i < (width*height)-1; i+= pixelSteps) {
    coordsIndexes.push(i);
  }

  for (var i = 0; i < coordsIndexes.length; i++) {
    // Pick a random coordinate
    var randomIndex = Math.round(random(0, coordsIndexes.length));
    var coordIndex = coordsIndexes[randomIndex];
    coordsIndexes.splice(randomIndex, 1);
    
    // Only continue if the pixel is not blank
    if (pg.pixels[coordIndex] != 0) {
      // Convert index to its coordinates
      var x = coordIndex % width;
      var y = coordIndex / width;

      var newParticle;

      if (particleIndex < particleCount) {
        // Use a particle that's already on the screen 
        newParticle = particles[particleIndex];
        newParticle.isKilled = false;
        particleIndex += 1;
      } else {
        // Create a new particle
        newParticle = new Particle();
        
        var randomPos = generateRandomPos(width/2, height/2, (width+height)/2);
        newParticle.pos.x = randomPos.x;
        newParticle.pos.y = randomPos.y;
        
        newParticle.maxSpeed = random(2.0, 5.0);
        newParticle.maxForce = newParticle.maxSpeed*0.025;
        newParticle.particleSize = random(3, 6);
        newParticle.colorBlendRate = random(0.0025, 0.03);
        
        particles.push(newParticle);
      }
      
      // Blend it from its current color
      newParticle.startColor = lerpColor(newParticle.startColor, newParticle.targetColor, newParticle.colorWeight);
      newParticle.targetColor = newColor;
      newParticle.colorWeight = 0;
      
      // Assign the particle's new target to seek
      newParticle.target.x = x;
      newParticle.target.y = y;
    }
  }

  // Kill off any left over particles
  if (particleIndex < particleCount) {
    for (var i = particleIndex; i < particleCount; i++) {
      var particle = particles[i];
      particle.kill();
    }
  }
}


function setup() {
  createCanvas(700, 300)
  background(255);
  bgColor = color(255, 100)

  words.push("JAVA");
  words.push("Python <3");
  words.push("C++");
  words.push("Bye :-)");
  words.push("");

  nextWord(words[wordIndex]);
}


function draw() {
  // Background & motion blur
  fill(bgColor);
  noStroke();
  rect(0, 0, width*2, height*2);

  for (var x = particles.length -1; x > -1; x--) {
    // Simulate and draw pixels
    var particle = particles[x];
    particle.move();
    particle.draw();

    // Remove any dead pixels out of bounds
    if (particle.isKilled) {
      if (particle.pos.x < 0 || particle.pos.x > width || particle.pos.y < 0 || particle.pos.y > height) {
        particles.splice(x, 1);
      }
    }
  }

  // Display control tips
  fill(255-red(bgColor));
  textSize(9);
  var tipText = "Left-click for a new word.";
  tipText += "\nDrag right-click over particles to interact with them.";
  tipText += "\nPress any key to toggle draw styles.";
  text(tipText, 10, height-40);
}


// Show next word
function mousePressed() {
  if (mouseButton == LEFT) {
    wordIndex += 1;
    if (wordIndex > words.length-1) { 
      wordIndex = 0;
    }
    nextWord(words[wordIndex]);
  }
}


// Kill pixels that are in range
function mouseDragged() {
  if (mouseButton == RIGHT) {
    for (var particle in particles) {
      if (dist(particle.pos.x, particle.pos.y, mouseX, mouseY) < 50) {
        particle.kill();
      }
    }
  }
}


// Toggle draw modes
function keyPressed() {
  drawAsPoints = (! drawAsPoints);
  if (drawAsPoints) {
    background(0);
    bgColor = color(0, 40);
  } else {
    background(255);
    bgColor = color(255, 100);
  }
}











