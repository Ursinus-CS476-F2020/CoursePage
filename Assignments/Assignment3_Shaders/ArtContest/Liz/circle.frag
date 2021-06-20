precision mediump float;

// PI is not included by default in GLSL
#define M_PI 3.1415926535897932384626433832795

// Uniforms set from Javascript that are constant
// over all fragments
uniform float uTime; // Time elapsed since beginning of simulation
uniform float uRadius; // Radius of blob

// The 2D position of the pixel in this fragment, interpolated via
// barycentric coordinates from positions of triangle vertices
varying vec2 v_position;

void main() {
    //TODO: Fill this in.  The center should be blurry, and it should
    //move in an arc from the left of the screen to the right of the screen.
    //The red channel should be proportional to its height
    float t = uTime;
    vec2 center = vec2(v_position.x + 0.02*cos(5.0*uTime+20.0*v_position.y), cos(t));

    vec2 dR = v_position - center;
    float rSqr = dot(dR,dR);

    float blue = exp(-rSqr/ pow(uRadius, 2.0));
    if(sin(uTime) > 0.5){
        blue = 0.7;
    }
    gl_FragColor = vec4(v_position.x + 0.5*cos(10.0*uTime+40.0*v_position.y), blue, v_position.x + 0.75*cos(1.0*uTime+20.0*v_position.y)+blue, 1.0);
}
