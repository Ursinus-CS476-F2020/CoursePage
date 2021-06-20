// Attribution: this is based off of Professor Tralie's newton.vert

attribute vec2 a_position;
varying vec2 v_position;

void main() {
  gl_Position = vec4(a_position, 0, 1);
  v_position = a_position;
}