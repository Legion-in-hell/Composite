uniform float opacity;
uniform vec3 color;
varying float depth;
varying vec4 vLastPosition;

void main(){
    vec4 lastPosition = vLastPosition;
    vec2 position = gl_PointCoord - vec2(.5,.5);
    float r = sqrt(dot(position*2.0, position*2.0));
    float nDepth = abs(depth);
    r = 1.0-r;
    if (r > 0.0){
        gl_FragColor = vec4(1.0,1.0,1.0,1.0);

    } else {
        discard;
    }

    if(lastPosition.y < 0.0) {

        discard;

    }

}
