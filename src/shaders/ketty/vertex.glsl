
uniform sampler2D uTexture;
uniform vec2 uOffset;
varying vec2 vUv;

#define M_PI 3.1415926535897932384626433832795
/*
vec3 deformationCurve(vec3 position, vec2 uv, vec2 offset) {
   position.x = position.x + (sin(uv.y * M_PI) * offset.x);
   position.y = position.y + (sin(uv.x * M_PI) * offset.y ) ;
   return position;
}

void main() {
   vUv = uv;
   vec3 newPosition = deformationCurve(position, uv, uOffset);
   gl_Position = projectionMatrix * modelViewMatrix * vec4( newPosition, 1.0 );
}*/

/*
vec3 barrelDistortion(vec3 position, float strength) {
    // Coordonnées polaires
    float radius = length(position.xy);
    float theta = atan(position.y, position.x);

    // Appliquer la distorsion de baril
   // radius = pow(radius, 1.0 + strength * 0.05);
   radius = pow(radius, 1.0 + strength * 0.1); // Augmenter le facteur d'accentuation ici
    
    
    // Conversion des coordonnées polaires en coordonnées cartésiennes
    position.x = radius * cos(theta);
    position.y = radius * sin(theta);
    
    return position;
} */
vec3 barrelDistortion(vec3 position, float strengthY) {
    // Coordonnées polaires
    float radius = length(position.xy);
    float theta = atan(position.y, position.x);

    // Appliquer la distorsion de baril
    radius = pow(radius, 1.0 + strengthY * 10.0); // Force de distorsion sur l'axe Y
    
    // Conversion des coordonnées polaires en coordonnées cartésiennes
    position.x = radius * cos(theta);
    position.y = radius * sin(theta);
    
    return position;
}


void main() {
    vUv = uv;
     float distortionStrength = 100.0 * length(uOffset);
    // Appliquer la distorsion de baril à la position
    vec3 newPosition = barrelDistortion(position, distortionStrength);
    
    gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
}