const trails_frag = /* glsl */`

#define ATTENUATION 0.007;

uniform sampler2D prevFrame;
varying vec2 vUv;

void main() 
{    
    vec4 prevFrameCol = texture2D(prevFrame, vUv); 
    prevFrameCol -= ATTENUATION;
    gl_FragColor = prevFrameCol;
}`;
export default trails_frag; 