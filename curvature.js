// curvature.js is a package writtent by Gildas Carlin
// analytical results for curvature measurements
//

function surface_height(pos){
  let h = 0.0;
  let x = pos.x;
  let y = pos.y;

  if (surface == 'flat'){  
    // do nothing
  } else if (surface == 'right_sinus'){  
    h = a*sin(k*(y+phi0));
  } 
  return h;
}

function substrateDerivative(pos){
  let x = pos.x;
  let y = pos.y;

  // derivees de l'equation du substrat (2D)
  let [fx, fxx, fxxx, fy, fyy, fyyy, fxy, fxxy, fxyy] = [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0];
  
  if (surface == 'flat'){  
    // do nothing
  } else if (surface == 'right_sinus'){  
    fy = a*k*cos(k*y+phi0);
    fyy = -1.0*a*k**2.0*sin(k*y+phi0);
    fyyy = -1.0*a*k**3.0*cos(k*y+phi0);
  }  
  return [fx, fxx, fxxx, fy, fyy, fyyy, fxy, fxxy, fxyy];
}

function curvature_tensor(pos){
  let [hx, hxx, hxxx, hy, hyy, hyyy, hxy, hxxy, hxyy] = substrateDerivative(pos);

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
  let [hx, hxx, hxxx, hy, hyy, hyyy, hxy, hxxy, hxyy] = substrateDerivative(pos);  
  let [g, gxx, gxy, gyy, Kxx, Kxy, Kyy] = curvature_tensor(pos);
  
  // gradient of mean curvature
  let Hx = -1.0*(2.0*hy*hxy*hxx+gyy*hxxx) + 2.0*(gxy*hxxy+hxy*(hxx*hy+hxy*hx)) - (2.0*hx*hyy*hxx+gxx*hxyy);
  Hx = Hx/(2.0*g**(3.0/2.0));
  Hx += 3.0*(hxx*hx+hxy*hy)*(gyy*hxx-2.0*gxy*hxy+gxx*hyy)/(2.0*g**(5.0/2.0));

  let Hy = -1.0*(2.0*hy*hyy*hxx+gyy*hxxy) + 2.0*(gxy*hxyy+hxy*(hxy*hy+hyy*hx)) - (2.0*hx*hxy*hyy+gxx*hyyy);
  Hy = Hx/(2.0*g**(3.0/2.0));
  Hy += 3.0*(hxy*hx+hyy*hy)*(gyy*hxx-2.0*gxy*hxy+gxx*hyy)/(2.0*g**(5.0/2.0));
  return createVector(Hx, Hy);
}







