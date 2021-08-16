precision highp float;

uniform vec2 u_window;

void main() {
    vec2 z = ((gl_FragCoord.xy / u_window) - vec2(0.5)) * 5.0;
    vec2 c = vec2(-0.4, 0.6);
    z.x *= u_window.x / u_window.y;
    float n = 0.0;
    for (int i = 0; i < 1000; i ++) {
        z = vec2(z.x * z.x - z.y * z.y, 2.0 * z.x * z.y) + c;
        if (dot(z, z) > 4.0) {
            break;
        }
        n += 1.0;
    }
    n = n - log2(log2(dot(z, z))) + 4.0;
    gl_FragColor = vec4(n / 100.0, n / 50.0, n / 25.0, 1.0);
}