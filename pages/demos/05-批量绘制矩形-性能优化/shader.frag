precision mediump float;

// 从顶点着色器传入的颜色
varying vec4 v_color;

void main() {
    gl_FragColor = v_color;
}