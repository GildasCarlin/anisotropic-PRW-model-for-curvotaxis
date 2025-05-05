/**
 * File              : curvature.js
 * Original article  : doi
 * Authors           : Gildas Carlin, Ian Manifacier and Jean-Louis Milan
 * Date              : 05/05/2025
 * Description       : Surface and curvature description.
 */
//

//  Surface parametrization
//-----------------------------------------------------------------

function substrate(pos){
  let h = 0.0;
  let x = pos.x;
  let y = pos.y;
  
  if (surface == 'right_sinus'){  
    h = a*sin(k*y);
  }

  return h
}

function substrateDerivatives(pos){
  let [fx, fxx, fxxx, fy, fyy, fyyy, fxy, fxxy, fxyy] = new Array(9).fill(0.0);
  let x = pos.x;
  let y = pos.y;

  if (surface == 'right_sinus'){ 
    let shape = k*y;
    fy = a*k * cos(shape);
    fyy = -a*k**2.0 * sin(shape);
    fyyy = -a*k**3.0 * cos(shape);
  } 

  return [fx, fxx, fxxx, fy, fyy, fyyy, fxy, fxxy, fxyy];
}

//  Curvature metrics
//-----------------------------------------------------------------

function metric_tensor(pos){
  let [hx, hxx, hxxx, hy, hyy, hyyy, hxy, hxxy, hxyy] = substrateDerivatives(pos);

  // metric tensor
  let gxx = 1.0+hx**2.0;  
  let gxy = hx*hy;
  let gyy = 1.0+hy**2.0;
  let g = gxx*gyy-gxy**2.0;  // determinant 

  return [g, gxx, gxy, gyy];
}

function curvature_tensor(pos){
  let [hx, hxx, hxxx, hy, hyy, hyyy, hxy, hxxy, hxyy] = substrateDerivatives(pos);
  let [g, gxx, gxy, gyy] = metric_tensor(pos);
 
  let sqrg = sqrt(g);

  // curvature tensor
  let Kxx = hxx/sqrg;  
  let Kxy = hxy/sqrg;
  let Kyy = hyy/sqrg;

  return [Kxx, Kxy, Kyy];
}

function gradCurvature(pos){
  let [hx, hxx, hxxx, hy, hyy, hyyy, hxy, hxxy, hxyy] = substrateDerivatives(pos);  
  let [g, gxx, gxy, gyy] = metric_tensor(pos);

  let u = hxx*gyy + hyy*gxx - 2.0*hxy*gxy;
  let v = 2.0 * g**1.5;

  let ux = gyy*hxxx + gxx*hxyy + 2.0*hxx*(hxy*hy+hyy*hx) - 2.0*(gxy*hxxy+hxy*(hxx*hy+hxy*hx));
  let vx = 6.0 * (hxx*hx+hxy*hy) * g**0.5;

  let uy = gyy*hxxy + gxx*hyyy + 2.0*hyy*(hxx*hy+hxy*hx) - 2.0*(gxy*hxyy+hxy*(hxy*hy+hyy*hx));
  let vy = 6.0 * (hxy*hx+hyy*hy) * g**0.5;

  return createVector(v*ux - u*vx,  v*uy - u*vy).mult(0.25*g**-3.0);
}


//  Vector normalization
//-----------------------------------------------------------------

function Normalize_Vec(vec){
  if (vec.mag()<pow(10.0, -10)){
    return createVector(0.0, 0.0);
  } else {
    return vec.normalize();
  }
}










