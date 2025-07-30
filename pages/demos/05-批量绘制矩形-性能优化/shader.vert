attribute vec2 a_position;
attribute vec4 a_color;

// 传给片元着色器的颜色
varying vec4 v_color;

// 画布的分辨率
uniform vec2 u_resolution;

void main() {
    // 像素坐标转裁剪空间（-1~1）
    vec2 clipSpace = (a_position / u_resolution) * 2.0 - 1.0;

    // 翻转 Y 轴，让原点位于左上角
    clipSpace.y = -clipSpace.y;

    gl_Position = vec4(clipSpace, 0.0, 1.0);

    // 传给片元着色器的颜色
    v_color = a_color;
}