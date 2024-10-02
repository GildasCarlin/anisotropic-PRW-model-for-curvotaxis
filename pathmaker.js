// pathmaker.js is a package written by Gildas Carlin, Ian Manifacier and Jean-Louis Milan
// draw trajectories
//

// A Path is a list of particles
class Path {
  constructor() {
    this.particles = [];
  }

  add(position){ 
    // Add a new particle with a position
    this.particles.push(new Particle(position));
  }
  
  // Display plath
  update_path() {  
    for (let i = 0; i < this.particles.length; i++) {
      this.particles[i].update_particule();
    }
  }  
  
  // Display path
  display_path() {    
    // Loop through backwards
    for (let i = this.particles.length - 1; i >= 0; i--) {
      // If we shold remove it
      if (this.particles[i].lifespan <= 0) {
        this.particles.splice(i, 1);
      // Otherwise, display it
      } else {
        this.particles[i].display_particule(this.particles[i+1]);
      }
    }
  }  
}

// Particles along the path
class Particle {
  constructor(position){
    this.position = createVector(position.x, position.y);
    this.lifespan = 255;
  }

  update_particule() {
    //this.lifespan--;
  }

  // Draw particle and connect it with a line
  // Draw a line to another
  display_particule(other) {
    push()
    stroke(1,3,38);
    fill(this.lifespan/1.5);  
    ellipse(this.position.x,this.position.y, 2, 2);    
    // If we need to draw a line
    if (other) {
      line(this.position.x, this.position.y, other.position.x, other.position.y);
    }
    pop();
  }
}

function trajectories(){
  if (millis()>next){ //when it is time to draw
    for (let i = 0; i < cells.length; i++) { 
      if (cells[i].isInBorders()){
        painting=true;
        previous.x = cells[i].position.x;
        previous.y = cells[i].position.y;
        paths[i].push(new Path());
      } else {
        painting = false;
      }

      if (painting){
        // schedule next circle
        next = millis() + dt;
        // grab current position      
        current.x = cells[i].position.x;
        current.y = cells[i].position.y;
        // straight line between previous and current positions
        let step_path = p5.Vector.sub(current, previous);
        paths[i][paths[i].length-1].add(current, step_path);
        // store/make the current position as the previous one
        previous.x = current.x;
        previous.y = current.y;
      }
      // draw all paths
      for(let j = 0; j < paths[i].length; j++) {
        paths[i][j].update_path();
        paths[i][j].display_path();
      }   
    }
  } 
}
