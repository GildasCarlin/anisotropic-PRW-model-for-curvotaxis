/**
 * File              : shader.frag
 * Original article  : doi
 * Authors           : Gildas Carlin, Ian Manifacier and Jean-Louis Milan
 * Date              : 05/05/2025
 * Description       : Background sketch.
 */
//

#ifdef GL_ES

precision mediump float;

#endif

uniform vec2 u_resolution;
uniform int surface;
uniform float k;
uniform float window_size;

vec3 hsb2rgb(vec3 c){
    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

float surface_equation(float x, float y){
  float m = 0.0;
  if (surface == 1){  
    m = 0.5*(1.0+sin(-k*(y-window_size/2.0)));
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

  vec3 color_max = vec3(0.976, 0.976, 0.976);  // convex
  vec3 color_min = vec3(0.063, 0.396, 0.671);  // concave
  vec3 color = mix(color_min, color_max, h);
  
  gl_FragColor = vec4(color, alpha);

}
