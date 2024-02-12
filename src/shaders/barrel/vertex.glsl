varying vec4 Vertex_UV;
uniform mat4 gxl3d_ModelViewProjectionMatrix;
uniform float BarrelPower;

vec4 Distort(vec4 p)
{
    vec2 v = p.xy / p.w;
    // Convert to polar coords:
    float radius = length(v);
    if (radius > 0)
    {
      float theta = atan(v.y,v.x);
      
      // Distort:
      radius = pow(radius, BarrelPower);

      // Convert back to Cartesian:
      v.x = radius * cos(theta);
      v.y = radius * sin(theta);
      p.xy = v.xy * p.w;
    }
    return p;
}

void main()
{
  vec4 P = gxl3d_ModelViewProjectionMatrix * gl_Vertex;
  gl_Position = Distort(P);
  Vertex_UV = gl_MultiTexCoord0;
}