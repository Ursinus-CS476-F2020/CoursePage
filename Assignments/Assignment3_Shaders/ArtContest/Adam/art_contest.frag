precision mediump float;

// PI is not included by default in GLSL
#define M_PI 3.1415926535897932384626433832795

// Uniforms set from Javascript that are constant
// over all fragments
uniform float uTime; // Time elapsed since beginning of simulation
uniform float uRadius; // Radius of blob

varying vec2 v_position;

void main() { 
    float x = v_position.x * 0.5*cos(uTime);
    float y = v_position.y * 0.5*sin(uTime);
    float xSquared = pow(x, 2.0);
    float ySquared = pow(y, 2.0);
    float uRadiusSquared = pow(uRadius, 2.0);
    float green = exp(-(xSquared + ySquared) / uRadiusSquared) - (0.5*cos(uTime) * 0.5*sin(uTime));
    float red = 0.3*exp(sin(-(xSquared + ySquared) / green));
    float blue = 2.0*pow(sin(uTime) * cos(uTime), 2.0);

    if ((x*x / cos(uTime)) + (y*y / sin(uTime)) <= uRadius) {
        gl_FragColor = vec4(red , green, 0.0, 1.0);
    }
    else {
        gl_FragColor = vec4(red, 0.0, blue, 1.0);
    }
}
