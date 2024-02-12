uniform sampler2D tex0;
varying vec4 Vertex_UV;
uniform int wireframe;

void main()
{
  vec4 c = vec4(1.0);
  if (wireframe == 0)
  {
    vec2 uv = Vertex_UV.xy;
    c = texture2D(tex0, uv);
  }
  gl_FragColor = c;
}