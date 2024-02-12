/*varying vec2 vUv;
void main()	{
	// vec2 newUV = (vUv - vec2(0.5))*resolution.zw + vec2(0.5);
	gl_FragColor = vec4(vUv,0.0,1.);
} */

/*
uniform float time;
uniform float progress;
uniform vec2 uTextureSize; 
uniform sampler2D uTexture; //tdiffuse

varying vec2 vUv;

varying vec2 vSize;

vec2 getUV(vec2 uv, vec2 textureSize, vec2 quadSize){
    vec2 tempUV = uv - vec2(0.5);

    float quadAspect = quadSize.x/quadSize.y;
    float textureAspect = textureSize.x/textureSize.y;
    if(quadAspect<textureAspect){
        tempUV = tempUV*vec2(quadAspect/textureAspect,1.);
    } else{
        tempUV = tempUV*vec2(1.,textureAspect/quadAspect);
    }

    tempUV += vec2(0.5);
    return tempUV;
}

void main() {
     vec2 correctUV = getUV(vUv,uTextureSize,vSize);
     
     vec4 image = texture(uTexture,correctUV);


     gl_FragColor = image;
     //gl_FragColor = vec4(vUv,0.,1.);

} 
*/
 uniform sampler2D uTexture;
 uniform float uAlpha;
 uniform vec2 uOffset;
 varying vec2 vUv;

vec3 rgbShift(sampler2D textureImage, vec2 uv, vec2 offset) {
   float r = texture2D(textureImage,uv + offset).r;
   vec2 gb = texture2D(textureImage,uv).gb;
   return vec3(r,gb);
 }

void main() {
   vec3 color = rgbShift(uTexture,vUv,uOffset);
   gl_FragColor = vec4(color,uAlpha);
 }