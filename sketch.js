/**
 * File              : sketch.js
 * Original article  : doi
 * Authors           : Gildas Carlin, Ian Manifacier and Jean-Louis Milan
 * Date              : 05/05/2025
 * Description       : Main file performing simulation and simulation sketch.
 */
//

// Variables initialization
//-------------------------------------------------------------------------------------------------------

// I. Surface 
//-------------------------------------------------------------------------------------------------------

// a surface is defined by an explicit string 'flat' or 'right_sinus' or by an index 0 or 1 respectively
let surface_index = 0;
if (surface=='right_sinus'){
  surface_index = 1;
}  

// wave number
let k = 2.0*Math.PI/lambda;  

// minimal and maximal curvature
Kmax = 0.5*a*k**2.0;
Kmin = -1.0*Kmax;


// II. Cell 
//-------------------------------------------------------------------------------------------------------

// trajectories are stored in a table
let cellID = 0;
let cells = [];

// persistence and speed parameters are stored in a table
let param_values;


// III. Model integration 
//-------------------------------------------------------------------------------------------------------

// integrative step time
let dt = dt_mesure/100.0; 
let it_mesure = dt_mesure/dt;

// total number of iterations
let iTmax = Tmax/dt;

// chronometer init
let t = 0; 

// trajectories sampling parameters
let it_sauv=0;
let t_last_mesure = 0;


// IV. Others
//-------------------------------------------------------------------------------------------------------

// drawing trajectories
let current;
let previous;
let painting = false;
let paths = [];
let next = 0.0;

// background sketch
let theShader;

// font
let inconsolata;

// table to export init
let row = []; 
let table_data = initTable();

// screenshot video
let capturer = new CCapture({
  frameRate: 60,
  format: "webm",
});


// Functions definition
//-------------------------------------------------------------------------------------------------------

function preload(){

  // persistence and speed parameters init
  param_values = loadTable('assets/generated_PSsig_flat.csv', 'ssv', 'header');
  if (surface=='right_sinus'){
    if (lambda==20.0){
      param_values = loadTable('assets/generated_PSsig_sin20.csv', 'ssv', 'header');
    } else if (lambda==40.0){
      param_values = loadTable('assets/generated_PSsig_sin40.csv', 'ssv', 'header');
    } else if (lambda==80.0){
      param_values = loadTable('assets/generated_PSsig_sin80.csv', 'ssv', 'header');
    } else if (lambda==160.0){
      param_values = loadTable('assets/generated_PSsig_sin160.csv', 'ssv', 'header');
    } 
  }
  
  inconsolata = loadFont('assets/Inconsolata.otf');
  
  theShader = loadShader('shader.vert', 'shader.frag'); 
  current = createVector(0,0);
  previous = createVector(0,0); 

}

// sketch window and cells initialization
function setup() {
  createCanvas(800, 800, WEBGL);
  noStroke();
  shaderGraphics = createGraphics(width, height, WEBGL);
  shaderGraphics.noStroke();

  for (let i = 0; i < nbCell; i++) {
    cells[i] = new Cell(param_values, i+1);
    cells[i].sauvegarde();
    paths.push([]);
  }
  it_sauv = it_sauv+1;
}

function drawScaleBar(font, txt) {
  push();
  stroke(0)
  fill('black');
  rect(-0.47*width, -300.0, 115.0, 50.0);
  textFont(font, 22);
  fill('white');
  text('80µm', -0.428*width, -280.0, 10.0);
  fill('white');
  rect(-0.445*width,-270.0,80,10.0);
  pop();
}

function drawTimer(font, txt) {
  push();
  fill('black');
  textFont(font, 22);
  rect(-0.47*width, -0.425*height,115.0,27);
  fill('white');
  text(txt, -0.45*width, -0.4*height, 800);
  pop();
}

function drawParameters(font, txt1, txt2, txt3) {
  push();
  fill('black');
  rect(-0.46*width, -0.33*height, 115.0, 155.0);
  textFont(font, 22);
  fill('white');
  text(txt1, -0.45*width, -0.3*height, 800);
  text(txt2, -0.45*width, -0.25*height, 800);
  text(txt3, -0.45*width, -0.20*height, 800);
  pop();
}

function initBackground(){
  background(240);
  
  push(); 
  shaderGraphics.shader(theShader);
  // Set the resolution as a uniform
  theShader.setUniform('u_resolution', [width, height]);
  theShader.setUniform('surface', surface_index);
  theShader.setUniform('k', k);
  theShader.setUniform('window_size', height);
  shaderGraphics.rect(0.0,0.0, height,width);
  image(shaderGraphics, -width/2.0, -height/2.0, width, height);
  pop();

}

function initTable(){
  let table_data = [];
  
  let row0  = ['time'];
  row0.push(['sauvegarde']);
  row0.push(['time_interval']);
  row0.push(['cell']);
  row0.push(['Px']);
  row0.push(['Py']);
  row0.push(['Sx']);
  row0.push(['Sy']);
  row0.push(['gamma']);
  row0.push(['alpha']);
  row0.push(['x']);
  row0.push(['y']);
  row0.push(['vx']);
  row0.push(['vy']);
  table_data.push(row0);
  
  return table_data;
}


// MAIN
//-------------------------------------------------------------------------------------------------------

function draw() {

  if (screen){
    //start record video
    if (frameCount == 1) {
      capturer.start();
    }
  }
  
  // background
  initBackground();

  if (draw_traj){
    trajectories();
  }
  
  // cell update
  for (let i = 0; i<cells.length; i++){
    cells[i].run();
  }
  t += 1;
  t_last_mesure += 1;

  let timer_sec = t*dt; 
  let minutes = Math.floor(timer_sec/60.0).toString();
  let seconds = (timer_sec % 60.0).toFixed(0).toString();
  drawScaleBar(inconsolata, lambda.toString()+'\0µm');
  drawTimer(inconsolata, minutes+'min '+seconds+'s');

  if (screen){
    //stop capturing 
    if (frameCount < captureLength) {
      capturer.capture(canvas);
    } else if (frameCount === captureLength) {
      capturer.save();
      capturer.stop();
    }
  }
  

  // data 
  export_the_data();
}



















