// Attribution: this is based off of Professor Tralie's newton.frag

precision highp float;

// The maximum number of iterations before escape should be
// included here (You can change this)
#define MAX_ITERS 100

// Uniforms set from Javascript that are constant
// over all fragments
uniform vec2 uCenter; // Where the origin (0, 0) is on the canvas
uniform float uScale; // Scale of fractal
uniform float uTime; // Time

// The 2D position of the pixel in this fragment, interpolated via
// barycentric coordinates from positions of triangle vertices
varying vec2 v_position;

/*
 * Raise a complex number z to a power, clamping at MAX_DEGREE
 * @param z Complex number to which to raise to a power
 * @param n Power to which to raise
 */
vec2 pow(vec2 z, int n) {
    if (n == 0)
        return vec2(1.0, 0.0);
    else {
        vec2 zret = vec2(1.0, 1.0);
        for (int i = 0; i < 8; ++i) {
            if (i >= n)
                break;
            
            float zx = zret.x;
            zret.x = zret.x * z.x - zret.y * z.y;
            zret.y = zx * z.y + zret.y * z.x;
        }

        return zret;
    }
}

/*
 * Perform the complex-number division between two numbers
 * @param z1 The numerator
 * @param z2 The denominator
 */
vec2 complexDiv(vec2 v1, vec2 v2) {
    float xnum = v1.x * v2.x + v1.y * v2.y;
    float ynum = v1.y * v2.x - v1.x * v2.y;
    float den = v2.x * v2.x + v2.y * v2.y;
    return vec2(xnum / den, ynum / den);
}

void main() {
    mat2 rot = mat2(cos(uTime / 5.0), -sin(uTime / 5.0), sin(uTime / 5.0), cos(uTime / 5.0));
    vec2 z = rot * (uScale * v_position - uCenter);
    for (int i = 0; i < MAX_ITERS; ++i) {
        z -= complexDiv(pow(z, 8), complexDiv(vec2(cos(z.x), cos(z.y)), vec2(-sin(z.x), -sin(z.y))));
    }

    vec2 dist = abs(z - (rot * (uScale * v_position - uCenter)));
    gl_FragColor = vec4(exp(-((pow(dist.x, 2.0) + pow(dist.y, 2.0)) / 0.25)),
        exp(-((pow(dist.x, 2.0) + pow(dist.y, 2.0)) / 0.005)) - exp(-((pow(dist.x, 2.0) + pow(dist.y, 2.0)) / 0.00000000001)),
        1.0 - exp(-((pow(dist.x, 2.0) + pow(dist.y, 2.0)) / 0.05)), 1.0);
}
