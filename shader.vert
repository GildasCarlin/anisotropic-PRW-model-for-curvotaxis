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