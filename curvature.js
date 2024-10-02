// curvature.js is a package writtent by Gildas Carlin, Ian Manifacier and Jean-Louis Milan
// analytical results for curvature measurements
//

function surface_height(pos){
  let h = 0.0;
  let x = pos.x;
  let y = pos.y;

  if (surface == 'right_sinus'){  
    h = a*sin(k*(y+phi0));
  } 
  return h;
}

function substrateDerivative(pos){
  let x = pos.x;
  let y = pos.y;

  // derivees de l'equation du substrat (2D)
  let [fx, fy, fxx, fxy, fyy, fxxx, fxxy, fyyy, fyyx, fxyx, fxyy] = [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0];
  
  if (surface == 'right_sinus'){  
    fy = a*k*cos(k*y+phi0);
    fyy = -1.0*a*k**2.0*sin(k*y+phi0);
    fyyy = -1.0*a*k**3.0*cos(k*y+phi0);
  }  
  return [fx, fy, fxx, fxy, fyy, fxxx, fxxy, fyyy, fyyx, fxyx, fxyy];
}

function curvature_tensor(pos){
  let [hx, hy, hxx, hxy, hyy, hxxx, hxxy, hyyy, hyyx, hxyx, hxyy] = substrateDerivative(pos);

  let gxx = 1.0+hx**2.0;  
  let gxy = hx*hy;
  let gyy = 1.0+hy**2.0;

  let g = gxx*gyy-gxy**2.0;  

  let Kxx = hxx/sqrt(g);  
  let Kxy = hxy/sqrt(g);
  let Kyy = hyy/sqrt(g);

  return [g, gxx, gxy, gyy, Kxx, Kxy, Kyy];
}

function gradCurvature(pos){
  let [hx, hy, hxx, hxy, hyy, hxxx, hxxy, hyyy, hyyx, hxyx, hxyy] = substrateDerivative(pos);  
  let u = hxx*(1+hy**2.0)+hyy*(1+hx**2.0)-2.0*hxy*hx*hy;
  let v = 2.0*(1.0+hx**2.0+hy**2.0)**1.5;

  // gradient of mean curvature
  let ux = hxxx*(1+hy**2.0)+hyyx*(1+hx**2.0)+2.0*(hxx*hxy*hy+hyy*hxx*hx)-2.0*(hxyx*hx*hy+hxy*(hxx*hy+hx*hxy));
  let vx = 6.0*(hxx*hx+hxy*hy)*(1.0+hx**2.0+hy**2.0)**0.5;
  let Hx = (ux*v - u*vx)/v**2.0;

  let uy = hxxy*(1+hy**2.0)+hyyy*(1+hx**2.0)+2.0*(hxx*hyy*hy+hyy*hxy*hx)-2.0*(hxyy*hx*hy+hxy*(hxy*hy+hx*hyy));
  let vy = 6.0*(hxy*hx+hyy*hy)*(1.0+hx**2.0+hy**2.0)**0.5;
  let Hy = (uy*v - u*vy)/v**2.0;

  return createVector(Hx, Hy);
}







