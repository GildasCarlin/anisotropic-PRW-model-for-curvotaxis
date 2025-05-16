
/**
 * File              : cell.js
 * Original article  : doi
 * Authors           : Gildas Carlin, Ian Manifacier and Jean-Louis Milan
 * Date              : 05/05/2025
 * Description       : Cell class for simulation.
 */
//



class Cell {
  constructor(param_values, cellID) {
    this.cellID = cellID; 
    this.Px = param_values.getNum(this.cellID, 'Px');
    this.Py = param_values.getNum(this.cellID, 'Py');
    this.Sx = param_values.getNum(this.cellID, 'Sx');
    this.Sy = param_values.getNum(this.cellID, 'Sy');

    this.polarityX = 0.0, 
    this.polarityY = 0.0;
    this.velocity = createVector(this.polarityX, this.polarityY);
    this.window_position = createVector(0.0, 0.0);
    this.real_position = this.window_position.copy();
  }
  
  run(){
  
    // 1.trajectory recording
    this.sauvegarde_interval();

    // 2.update cell velocity and position 
    this.update();

    // 3.cell is restrained in the window (visual only)
    //this.borders();

    // 4.sketch
    this.render();    
  }

  // 2.update cell velocity and position
  update(){

    // noise
    let noise = this.get_random_vector();  
    let Xrandom = noise.x * sqrt(pow(this.Sx, 2.0) * dt/this.Px); 
    let Yrandom = noise.y * sqrt(pow(this.Sy, 2.0) * dt/this.Py); 

    // OU process
    this.polarityX += Xrandom - this.polarityX * dt/this.Px;  
    this.polarityY += Yrandom - this.polarityY * dt/this.Py;
    
    this.velocity = createVector(this.polarityX, this.polarityY);

    // curvature effect
    let [Kxx, Kxy, Kyy] = curvature_tensor(this.real_position.copy());  
    let gradH = gradCurvature(this.real_position.copy());
    let gradH_perp = createVector(gradH.y, -1.0*gradH.x);
      
    let n = Normalize_Vec(this.velocity.copy());
    let kappa = Kxx*n.x**2.0 + Kyy*n.y**2.0 + 2.0*Kxy*n.x*n.y;  // directional curvature

    let test;
    if (kappa>=0.0){     // cell is in concave
      test = this.velocity.dot(gradH_perp)>=0.0
      if (!test){
        gradH_perp.mult(-1.0);
      } 
      let Dtheta = this.velocity.angleBetween(gradH_perp) * alpha; 
      let normalized_velocity = Normalize_Vec(this.velocity.copy());
      let costheta = normalized_velocity.x;
      let sintheta = normalized_velocity.y;
      this.velocity = createVector(costheta*cos(Dtheta) - sintheta*sin(Dtheta), sintheta*cos(Dtheta)+sin(Dtheta)*costheta).mult(this.velocity.mag());
    } else if (kappa<0.0){  // cell is on convex
      this.velocity.mult(1.0+gamma*Math.abs(kappa));
    }

    // velocity integration
    this.window_position.add(this.velocity.copy().mult(dt));
    this.real_position.add(this.velocity.copy().mult(dt));
  }
  

  get_random_vector() {   // Box-Muller transform 
    let u = 0.0, v = 0.0; 
    while(u === 0.0) u = Math.random();  // Converting [0,1) to (0,1)
    while(v === 0.0) v = Math.random();
    let num1 = Math.sqrt(-2.0*Math.log(u)) * Math.cos(2.0*Math.PI*v);
    let num2 = Math.sqrt(-2.0*Math.log(u)) * Math.sin(2.0*Math.PI*v);
    
    return createVector(num1, num2);
  }
  
  // 3.cell is restrained in the window
  borders() {
    if (this.window_position.x < -width/2 -cell_radius_min) this.window_position.x = width/2 + cell_radius_min;
    if (this.window_position.y < -height/2 -cell_radius_min) this.window_position.y = height/2 + cell_radius_min;
    if (this.window_position.x > width/2 + cell_radius_min) this.window_position.x = -cell_radius_min -width/2;
    if (this.window_position.y > height/2 + cell_radius_min) this.window_position.y = -cell_radius_min -height/2;
  }

  isInBorders() { //is the cell inside the window?
    if (this.window_position.x < -width/2 || this.window_position.y < -height/2 || this.window_position.x >  width/2 || this.window_position.y >  height/2){
      return false;
    } else {
      return true;
    }
  }
  
  // 4.sketch
  render(){
    let velocity_copy = this.velocity.copy();
    
    // cytoplasm
    push();
    fill(215, 95, 76);
    stroke(0);
    translate(this.window_position.x, this.window_position.y);
    rotate(createVector(1.0, 0.0).angleBetween(createVector(this.velocity.x, this.velocity.y)));

    let a = cell_radius_min+cell_radius_max*(1.0-exp(-velocity_copy.mag()/(0.5*(this.Sx+this.Sy))));
    let b = 0.5*a;
    if (b<cell_radius_min){
      b = cell_radius_min;
    }
    ellipse(0, 0, 2.0*a, 2.0*b);
    pop();
    
    // nucleus
    if (nbCell<50){
      push();
      fill(242, 142, 19);
      stroke(0);
      translate(this.window_position.x, this.window_position.y);
      ellipse(0, 0, cell_radius_min, cell_radius_min);
      pop();
    }
    
    // direction of migration
    if (nbCell<50){
      velocity_copy.mult(10.0);
      drawVector(this.window_position.x, this.window_position.y, createVector(velocity_copy.x, velocity_copy.y).mult(5.0), color(1,3,38));
    }
  }
  
  // 1.trajectory recording
  sauvegarde_interval(){
    if (t_last_mesure>=it_mesure){
      this.sauvegarde();
      if (this.cellID == nbCell){ 
        t_last_mesure = 0;
        it_sauv = it_sauv+1;
      }
    }
  }
  
  sauvegarde(){
    row = [t*dt];
    row.push([it_sauv]);
    row.push([dt_mesure]);
    row.push(this.cellID);
    row.push(this.Px);
    row.push(this.Py);
    row.push(this.Sx);
    row.push(this.Sy);
    row.push(gamma);
    row.push(alpha);
    row.push([this.real_position.x]);
    row.push([this.real_position.y]);
    row.push([this.velocity.x]);
    row.push([this.velocity.y]);
    table_data.push(row);
    row = [];
  }
}
