// sketch.js is a package writtent by Gildas Carlin, Ian Manifacier and Jean-Louis Milan
// Main
//


//-----------------------------------------------------------------------------------
// variables initialization

///////////////////////////////
// I. surface definition

let surface_index = 0;

if (surface=='flat'){
  // do nothing
} else if (surface=='right_sinus'){
  surface_index = 1;
} 

// wavenumber (µm^-1)
let k = 2.0*Math.PI/lambda;

///////////////////////////////
// II. cell parameters

let cellID = 0;
let cells = [];

let param_values;

///////////////////////////////
// III. integration parameters

// integration time step (seconds) 
let dt = dt_mesure/100.0; 
let it_mesure = dt_mesure/dt;
let iTmax = Tmax/dt;

let t_i = 0; 

let it_sauv=0;
let t_last_mesure = 0;

///////////////////////////////
// IV. other parameters

let current;
let previous;

let painting = false;
let paths = [];
let next = 0.0;

let theShader;
let inconsolata;
let row = []; 

//-----------------------------------------------------------------------------------
// functions definition

function preload(){
  if (surface=='flat'){
    param_values = loadTable('assets/PxySxy_flat.csv', 'ssv', 'header');
  } else if (surface=='right_sinus' && lambda == 20.0){
    param_values = loadTable('assets/PxySxy_sin20.csv', 'ssv', 'header');
  } else if (surface=='right_sinus' && lambda == 40.0){
    param_values = loadTable('assets/PxySxy_sin40.csv', 'ssv', 'header');
  } else if (surface=='right_sinus' && lambda == 80.0){
    param_values = loadTable('assets/PxySxy_sin80.csv', 'ssv', 'header');
  } else if (surface=='right_sinus' && lambda == 160.0){
    param_values = loadTable('assets/PxySxy_sin160.csv', 'ssv', 'header');
  }
  inconsolata = loadFont('assets/Inconsolata.otf');
  
  theShader = loadShader('shader.vert', 'shader.frag'); 
  current = createVector(0,0);
  previous = createVector(0,0); 
}

function setup() {
  createCanvas(800, 800, WEBGL);
  noStroke();
  shaderGraphics = createGraphics(width, height, WEBGL);
  shaderGraphics.noStroke();

  for (let i = 0; i < nbCell; i++){
    cells[i] = new Cell; 
    cellID = i+1;
    paths.push([]);
  }
  it_sauv = it_sauv+1;
}

function drawScaleBar(font, txt) {
  push();
  stroke(0)
  fill('black');
  rect(-0.46*width,-100.0,115.0,50.0);
  textFont(font, 22);
  fill('white');
  text(txt, -0.425*width, -80.0, 10.0);
  fill('white');
  rect(-0.44*width,-70.0,80.0,10.0);
  pop();
}

function drawTimer(font, txt) {
  push();
  fill('black');
  textFont(font, 22);
  rect(-0.46*width, -0.425*height,115.0,27);
  fill('white');
  text(txt, -0.45*width, -0.4*height, 800);
  pop();
}

function drawParameters(font, txt1, txt2, txt3, txt4) {
  push();
  fill('black');
  rect(-0.46*width, -0.33*height, 115.0, 155.0);
  textFont(font, 22);
  fill('white');
  text(txt1, -0.45*width, -0.3*height, 800);
  text(txt2, -0.45*width, -0.25*height, 800);
  text(txt3, -0.45*width, -0.2*height, 800);
  text(txt4, -0.45*width, -0.15*height, 800);
  pop();
}

function initBackground(iteration){
  // time in seconds or minutes
  let ts = iteration*dt; 
  let tm = Math.round(100.0*ts/60.0)/100.0;

  // affichage du fond
  background(240);
  
  push(); 
  shaderGraphics.shader(theShader);
  // Set the resolution as a uniform
  theShader.setUniform('u_resolution', [width, height]);
  theShader.setUniform('surface_index', surface_index);
  theShader.setUniform('a', a);
  theShader.setUniform('lambda', lambda);
  theShader.setUniform('k', k);
  theShader.setUniform('phi0', phi0);
  theShader.setUniform('t', ts);
  theShader.setUniform('s', height);

  shaderGraphics.rect(0.0,0.0, height,width);
  image(shaderGraphics, -width/2.0, -height/2.0, width, height);
  pop();
  
  drawScaleBar(inconsolata, '80µm');
  drawTimer(inconsolata, tm.toFixed(2).toString()+' min');
  drawParameters(inconsolata, 
                 'a='+a.toString(), 
                 'lambda='+lambda.toString(),
                 'gamma='+gamma.toString(),
                 'alpha='+alpha.toString());
}

// Fonction principale
// -------------------

function draw() {

  initBackground(t_i);
  
  // cell update
  for (let i = 0; i<cells.length; i++){
    cellID = i+1;
    cells[i].run(cellID);
  }
  t_i += 1;
  t_last_mesure += 1;

  if (draw_traj==true){
    trajectories();
  }
} 
