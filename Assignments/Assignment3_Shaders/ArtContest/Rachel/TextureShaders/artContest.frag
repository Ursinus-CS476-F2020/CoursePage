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

/*
* Squares the given parameter
*/
float toPower2(float base)
{
    return base*base;
}

vec2 redCircle(float remainder)
{
    float x,y;
    if( sin(remainder) >= 0.0 && sin(remainder) <= 1.0)
    {
         x = -cos(remainder);
         y = sin(remainder);
         
         
    } 
    else
    {
        x =  cos(remainder);
        y =  -sin(remainder);
        
    }

    return vec2(x,y);
}

vec2 blueCircle(float remainder)
{
    float x,y;
    if( sin(remainder) >= 0.0 && sin(remainder) <= 1.0)
    {
         x = cos(remainder);
         y = -sin(remainder);
         
         
    } 
    else
    {
        x =  -cos(remainder);
        y =  sin(remainder);
        
    }

    return vec2(x,y);
}

float getColor(vec2 coor)
{
    float tempx = coor[0] - v_position[0];
    float tempy = coor[1] - v_position[1];
    float dr = toPower2(tempx) + toPower2(tempy);
    return exp( (-1.0 * dr) / toPower2(uRadius));
}

vec2 childCircle(float time)
{
    float x,y;
    
    x = v_position[0]*2.0;
    y = v_position[1]*2.0;
   
    return vec2(x,y);
}

void main() {
    //TODO: Fill this in.  The center should be blurry, and it should
    //move in an arc from the left of the screen to the right of the screen.
    //The red channel should be proportional to its height
    float rem = uTime;
    float red, blue, green;
    
    vec2 xy = redCircle(rem);
    red = xy[1];
    green = getColor(xy);
    // circle works without glFrag color mods, with the mods circle disappears.
    vec2 xy2 = blueCircle(rem);
    blue = getColor(xy2);

    vec2 cc = childCircle(rem);
    red += getColor(cc);
    
    gl_FragColor = vec4(red, green, blue,  1.0);
    
}


