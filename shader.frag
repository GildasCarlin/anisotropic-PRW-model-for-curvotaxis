/**
 * File              : shader.frag
 * Original article  : doi: 10.1038/s41598-025-02804-3
 * Authors           : Gildas Carlin, Ian Manifacier and Jean-Louis Milan
 * Date              : 05/05/2025
 * Description       : Background sketch.
 */
//

#ifdef GL_ES

precision mediump float;

#endif

uniform int surface;
uniform float k;
uniform float window_size;

float surface_equation(float x, float y){
  float m = 0.0;
  if (surface == 1){  
    m = 0.5*(1.0+sin(-k*(y-window_size/2.0)));
  }

  return m;
}

void main() {
  // In shaders, the RGB color goes from 0 - 1 instead of 0 - 255
  
  // Use the x position of the pixel to define its hue
  // (with saturation and brightness to 1)
  
  // Color the pixel

  float alpha = 1.0;
  float h = surface_equation(gl_FragCoord.x, gl_FragCoord.y);

  vec3 color_max = vec3(0.976, 0.976, 0.976);  // convex
  vec3 color_min = vec3(0.063, 0.396, 0.671);  // concave
  vec3 color = mix(color_min, color_max, h);
  
  gl_FragColor = vec4(color, alpha);

}
