<template>
    <canvas ref="canvas" class="border" :width="CANVAS_WIDTH" :height="CANVAS_HEIGHT"></canvas>

    <div :style="{ width: CANVAS_WIDTH + 'px' }" class="px-3 mt-4">
        <div class="flex items-center gap-x-6">
            <span>X</span>

            <el-slider
                v-model="translation.x"
                :min="0"
                :max="CANVAS_WIDTH - RECT_WIDTH"
                @input="drawScene"
            ></el-slider>
        </div>

        <div class="flex items-center gap-x-6 mt-2">
            <span>Y</span>

            <el-slider
                v-model="translation.y"
                :min="0"
                :max="CANVAS_HEIGHT - RECT_HEIGHT"
                @input="drawScene"
            ></el-slider>
        </div>
    </div>
</template>

<script lang="ts" setup>
import vs from "./shader.vert";
import fs from "./shader.frag";

useHead({
    title: "06-二维平移",
});

const CANVAS_WIDTH = 400;
const CANVAS_HEIGHT = 400;
const canvas = useTemplateRef("canvas");

const RECT_WIDTH = 120;
const RECT_HEIGHT = 50;

const translation = reactive({
    x: 50,
    y: 40,
});

let gl: WebGLRenderingContext | undefined | null;
const drawScene = () => {
    if (!gl) return;

    gl.clear(gl.COLOR_BUFFER_BIT);

    const { x, y } = translation;

    const positions = [
        // 三角形1
        x,
        y,
        x,
        y + RECT_HEIGHT,
        x + RECT_WIDTH,
        y,
        // 三角形2
        x + RECT_WIDTH,
        y,
        x + RECT_WIDTH,
        y + RECT_HEIGHT,
        x,
        y + RECT_HEIGHT,
    ];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

    // 绘制两个三角形拼成矩形，共6个点
    gl.drawArrays(gl.TRIANGLES, 0, 6);
};

onMounted(() => {
    // ----------- 初始化（仅执行一次） -----------

    gl = canvas.value?.getContext("webgl");
    if (!gl) return;

    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vs);
    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fs);
    if (!vertexShader || !fragmentShader) return;

    const program = createProgram(gl, vertexShader, fragmentShader);
    if (!program) return;

    const positionAttributeLocation = gl.getAttribLocation(program, "a_position");
    const resolutionUniformLocation = gl.getUniformLocation(program, "u_resolution");
    const colorUniformLocation = gl.getUniformLocation(program, "u_color");

    gl.useProgram(program);

    gl.uniform2f(resolutionUniformLocation, gl.canvas.width, gl.canvas.height);
    gl.uniform4f(colorUniformLocation, 0.2, 0.6, 1.0, 1.0);

    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.enableVertexAttribArray(positionAttributeLocation);
    gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);

    drawScene();
});
</script>

<style lang="scss" scoped></style>
