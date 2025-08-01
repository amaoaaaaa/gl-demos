attribute vec2 a_position;

// 画布的分辨率
uniform vec2 u_resolution;

// 偏移变量
uniform vec2 u_translation;

void main() {
    // 像素坐标转裁剪空间（-1~1）
    vec2 clipSpace = ((a_position + u_translation) / u_resolution) * 2.0 - 1.0;

    // 翻转 Y 轴，让原点位于左上角
    clipSpace.y = -clipSpace.y;

    gl_Position = vec4(clipSpace, 0.0, 1.0);
}