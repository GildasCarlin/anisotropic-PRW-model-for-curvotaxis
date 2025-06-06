/**
 * File              : shader.vert
 * Original article  : doi: 10.1038/s41598-025-02804-3
 * Authors           : Gildas Carlin, Ian Manifacier and Jean-Louis Milan
 * Date              : 05/05/2025
 * Description       : Color gestion for background sketch.
 */
//

#ifdef GL_ES

precision mediump float;
attribute vec3 aPosition;

void main() {

  // Copy the position data into a vec4, adding 1.0 as the w parameter
  vec4 positionVec4 = vec4(aPosition, 1.0); 

  // Scale to make the output fit the canvas. 
  positionVec4.xy = 2.0*positionVec4.xy-1.0; 

  gl_Position = positionVec4;

}


#endif
