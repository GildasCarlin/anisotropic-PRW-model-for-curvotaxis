#ifdef GL_ES

precision mediump float;

#endif

uniform vec2 u_resolution;

// surface parameters
uniform int surface_index;
uniform float a;
uniform float lambda;
uniform float k;
uniform float phi0;

// time (seconds)
uniform float t;

// screen size (square sxs)
uniform float s;

vec3 hsb2rgb(vec3 c){
    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

float surface_equation(float x, float y){
  float m = 0.0;

  if (surface_index == 0){  // flat surface
    // do nothing 
  } else if (surface_index == 1){  // right sinus
    // frame change between the shader frame and the .js frame. 
    x = x + 0.5*s;
    y = -1.0*y + 0.5*s ;

    m = 0.5 * (1.0 + sin(k*(y+phi0)));  // surface must comprise between 0 and 1
  } 
  return m;
}


void main() {
  // The .xy notation applies the same operation on both x and y components
  vec2 st = gl_FragCoord.xy/u_resolution.xy; 
  
  // Make a blue color. In shaders, the RGB color goes from 0 - 1 instead of 0 - 255
  
  // Use the x position of the pixel to define its hue
  // (with saturation and brightness to 1)
  // Then convert the HSB color to RGB
  // vec3 color = hsb2rgb(vec3(st.x, 1, 1));
  
  // Color the pixel

  float alpha = 1.0;
  float h = surface_equation(gl_FragCoord.x, gl_FragCoord.y);
  vec3 color = vec3(h, h, 1.0);
  
  gl_FragColor = vec4(color, alpha);
}