precision mediump float;

// PI is not included by default in GLSL
#define M_PI 3.1415926535897932384626433832795

// Uniforms set from Javascript that are constant
// over all fragments
uniform float uTime; // Time elapsed since beginning of simulation
uniform float uRadius; // Radius of blob
uniform vec2 uRandomCenter; 

// The 2D position of the pixel in this fragment, interpolated via
// barycentric coordinates from positions of triangle vertices
varying vec2 v_position;

void main() {
    //TODO: Fill this in.  The center should move in an arc from the left of the screen
    //to the right of the screen
    
    float myTime = uTime - M_PI*(floor(uTime/M_PI));
    float x = uRandomCenter[0] + v_position.x + cos(uTime);
    float y = uRandomCenter[1] + v_position.y + sin(uTime);
    float nx = (M_PI/-2.0) * (uRandomCenter[0] + v_position.x + cos(uTime * (M_PI/-2.0)));
    float ny = (M_PI/-2.0) * (uRandomCenter[1] + v_position.y + sin(uTime * (M_PI/-2.0)));
    float red = cos((uTime + (M_PI / 2.0)));
    float green = cos((uTime + (M_PI / 2.0 * abs(uRandomCenter[0]))) );
    float blue = cos((uTime * uRandomCenter[1] + (M_PI / 2.0 )) );

    
    float redBall1 = exp(-((x-abs(uRandomCenter[0]))*(x-abs(uRandomCenter[0])) + y*y) / (2.0 * uRadius * uRadius)); // just kidding it's green
    float redBall2 = exp(-(nx*nx + ny*ny) / (uRadius * uRadius));
    float redBall3 = exp(-((x+abs(uRandomCenter[1]))*(x+abs(uRandomCenter[1])) + ny*ny) / (0.5 * uRadius * uRadius)); // lol it's actually blue
    
    gl_FragColor = vec4(red + redBall2, green + redBall1, blue + redBall3, 1.0);
    
}
