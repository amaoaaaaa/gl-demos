/**
 * 创建着色器
 * @param gl 渲染上下文
 * @param type 着色器类型
 * @param source 数据源
 */
export function createShader(gl: WebGLRenderingContext, type: GLenum, source: string) {
    // 创建着色器对象
    const shader = gl.createShader(type);

    if (!shader) {
        return null;
    }

    // 设置数据源
    gl.shaderSource(shader, source);
    // 编译
    gl.compileShader(shader);

    // 获取编译状态
    const success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);

    // 编译失败
    if (!success) {
        console.error("着色器编译失败", gl.getShaderInfoLog(shader));

        // 删除创建的着色器对象
        gl.deleteShader(shader);

        return null;
    }

    // 返回着色器对象
    return shader;
}

/**
 * 创建着色程序
 * @param gl 渲染上下文
 * @param vertexShader 顶点着色器对象
 * @param fragmentShader 片段着色器对象
 */
export function createProgram(
    gl: WebGLRenderingContext,
    vertexShader: WebGLShader,
    fragmentShader: WebGLShader
) {
    // 创建程序
    const program = gl.createProgram();

    // 链接着色器
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    // 获取链接状态
    const success = gl.getProgramParameter(program, gl.LINK_STATUS);

    // 链接失败
    if (!success) {
        console.error("程序链接着色器失败", gl.getProgramInfoLog(program));

        // 删除创建的着色程序对象
        gl.deleteProgram(program);

        return null;
    }

    // 返回着色程序对象
    return program;
}

/**
 * 生成随机的归一化 RGBA 颜色值
 *
 * @param alpha 透明度，默认：1
 * @returns 返回颜色值数组：[r, g, b, a]
 */
export function randomColor(alpha = 1): [number, number, number, number] {
    return [Math.random(), Math.random(), Math.random(), alpha];
}
