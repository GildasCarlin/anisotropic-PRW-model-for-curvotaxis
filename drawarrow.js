/**
 * File              : drawarrow.js
 * Original article  : doi
 * Authors           : Gildas Carlin, Ian Manifacier and Jean-Louis Milan
 * Date              : 05/05/2025
 * Description       : Draw arrow for vector sketch.
 */
//

function drawArrow(x0, y0, x1, y1, c = color('rgba(236,90,43,0.8)')){
  let L = sqrt((x1-x0)**2+(y1-y0)**2);
  let theta = atan2(y1-y0, x1-x0);
  
  fill(c);
  push();
  translate(x0,y0);
  rotate(-(0.5*PI-theta));
  strokeWeight(1);
  stroke(c);
  noFill();
  line(0.0, 0.0, 0.0, L);
  line(0.0, L, 0.1*L, 0.8*L);
  line(0.0, L, -0.1*L, 0.8*L);
  pop();
}


// arguments : origine + coordonnées 
function drawVector(x,y, v, c = color('rgba(236,90,43,0.8)')) {
  drawArrow(x,y,x+v.x, y+v.y, c);
}
