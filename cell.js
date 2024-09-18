// cell.js is a package writtent by Gildas Carlin
// class cell
//

class Cell {
  constructor() { 
    this.OU_Xvelocity = 0.0;
    this.OU_Yvelocity = 0.0;
    this.Xvelocity = this.OU_Xvelocity;
    this.Yvelocity = this.OU_Yvelocity;
    this.velocity = createVector(this.Xvelocity, this.Yvelocity);
    this.position = createVector(0.0, 0.0);
  }
  
  run(cellID){
    let Px = param_values.getNum(cellID-1, 'Px');
    let Py = param_values.getNum(cellID-1, 'Py');
    let Sx = param_values.getNum(cellID-1, 'Sx');
    let Sy = param_values.getNum(cellID-1, 'Sy');

    // update cell position
    this.update(Px, Py, Sx, Sy);

    // if the cell leaves the screen, it is put back in it 
    this.borders();
    
    // visualization
    this.render(Px, Py, Sx, Sy);    
  }
  
  get_random_vector() { 
     // Box-Muller transform to generate a random vector
      let u = 0, v = 0; 
      while(u === 0) u = Math.random();  // Converting [0,1) to (0,1)
      while(v === 0) v = Math.random();
      let num1 = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
      let num2 = Math.sqrt(-2.0 * Math.log(u)) * Math.sin(2.0 * Math.PI * v);
      return createVector(num1, num2);
  }
  
  update(Px, Py, Sx, Sy){
    ///////////
    // I. velocity is generated following an anisotropic OU process
    let random_vector = this.get_random_vector();  
    let Xrandom = random_vector.x * sqrt(pow(Sx, 2.0) * dt/Px); 
    let Yrandom = random_vector.y * sqrt(pow(Sy, 2.0) * dt/Py); 

    this.OU_Xvelocity += Xrandom - this.OU_Xvelocity * dt/Px;  
    this.OU_Yvelocity += Yrandom - this.OU_Yvelocity * dt/Py;

    this.Xvelocity = this.OU_Xvelocity;
    this.Yvelocity = this.OU_Yvelocity;

    this.velocity = createVector(this.Xvelocity, this.Yvelocity);

    ///////////
    // II. Curvature action, velocity reassessing 
    let [g, gxx, gxy, gyy, Kxx, Kxy, Kyy] = curvature_tensor(this.position.copy());  
    let gradH = gradCurvature(this.position.copy()); 
    let gradH_perp = createVector(gradH.y, -1.0*gradH.x);
      
    let n = this.velocity.copy().normalize();
    let kappa = Kxx*n.x**2.0 + Kyy*n.y**2.0 + 2.0*Kxy*n.x*n.y;

    let test;
    if (kappa<0.0){
      this.velocity.mult(1.0+gamma*abs(kappa));
    } else if (kappa>0.0){
      test = this.velocity.dot(gradH_perp)>=0.0;
      if (!test){
        gradH_perp.mult(-1.0);
      }
      let Dtheta = this.velocity.angleBetween(gradH_perp) * alpha; 
      this.velocity = createVector(n.x*cos(Dtheta) - n.y*sin(Dtheta), n.y*cos(Dtheta)+sin(Dtheta)*n.x).mult(this.velocity.mag());
    }

    ///////////
    // III. modified velocity integration to get cell position
    this.position.add(this.velocity.copy().mult(dt));
  }
   
  borders() {
    if (this.position.x < -width/2 -cell_radius_min) this.position.x = width/2 + cell_radius_min;
    if (this.position.y < -height/2 -cell_radius_min) this.position.y = height/2 + cell_radius_min;
    if (this.position.x > width/2 + cell_radius_min) this.position.x = -cell_radius_min -width/2;
    if (this.position.y > height/2 + cell_radius_min) this.position.y = -cell_radius_min -height/2;
  }
  
  render(Px, Py, Sx, Sy){
    let velocity_copy = this.velocity.copy();

    let a = cell_radius_min+cell_radius_max*(1.0-exp(-velocity_copy.mag()/(0.5*(Sx+Sy))));
    let b = 0.5*a;
    if (b<cell_radius_min){
      b = cell_radius_min;
    }

    // ellipse for cytoplasm
    push();
    fill(215, 95, 76);
    stroke(0);
    translate(this.position.x, this.position.y);
    rotate(createVector(1.0, 0.0).angleBetween(createVector(this.velocity.x, this.velocity.y)));
    ellipse(0, 0, 2.0*a, 2.0*b);
    pop();
    
    // nucleus
    push();
    fill(242, 142, 19);
    stroke(0);
    translate(this.position.x, this.position.y);
    ellipse(0, 0, cell_radius_min, cell_radius_min);
    pop();

    // velocity vector
    velocity_copy.mult(10.0);
    drawVector(this.position.x, this.position.y, createVector(velocity_copy.x, velocity_copy.y).mult(5.0), color(1,3,38));
  }
  
  isInBorders() { //is the cell inside the screen?
    if (this.position.x < -width/2 || this.position.y < -height/2 || this.position.x >  width/2 || this.position.y >  height/2){
      return false;
    } else {
      return true;
    }
  }
}
