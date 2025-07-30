<template>
    <canvas ref="canvas" class="border" width="400" height="400"></canvas>

    <div class="text-xs text-white mt-2">
        <p>矩形数量：{{ RECT_COUNT }} 个</p>
        <p>绘制耗时：{{ Math.round(timeUsage) }}ms</p>
    </div>
</template>

<script lang="ts" setup>
import vs from "./shader.vert";
import fs from "./shader.frag";
import { random } from "lodash-es";

useHead({
    title: "05-批量绘制矩形-性能优化",
});

const canvas = useTemplateRef("canvas");

const timeUsage = ref(0);

const RECT_COUNT = 50000;
const VERTICES_PER_RECT = 6;
const COMPONENTS_PER_VERTEX = 2; // x, y
const COLOR_COMPONENTS = 4; // r,g,b,a

onMounted(() => {
    // ----------- 初始化（仅执行一次） -----------

    const gl = canvas.value?.getContext("webgl");
    if (!gl) return;

    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vs);
    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fs);
    if (!vertexShader || !fragmentShader) return;

    const program = createProgram(gl, vertexShader, fragmentShader);
    if (!program) return;

    // 允许全透明
    // gl.enable(gl.BLEND);
    // gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    // 计算耗时
    const start = performance.now();

    const positionBuffer = gl.createBuffer();
    const colorBuffer = gl.createBuffer();

    const positionAttributeLocation = gl.getAttribLocation(program, "a_position");
    const resolutionUniformLocation = gl.getUniformLocation(program, "u_resolution");
    const colorAttributeLocation = gl.getAttribLocation(program, "a_color");

    // 预分配缓冲区
    const positions = new Float32Array(RECT_COUNT * VERTICES_PER_RECT * COMPONENTS_PER_VERTEX);
    const colors = new Float32Array(RECT_COUNT * VERTICES_PER_RECT * COLOR_COMPONENTS);

    function updateBuffers() {
        for (let i = 0; i < RECT_COUNT; i++) {
            const tlX = random(0, 400);
            const tlY = random(0, 400);
            const trX = random(0, 400);
            const trY = tlY;
            const brX = trX;
            const brY = random(0, 400);
            const blX = tlX;
            const blY = brY;

            const offsetPos = i * VERTICES_PER_RECT * COMPONENTS_PER_VERTEX;
            positions.set([tlX, tlY, blX, blY, trX, trY, trX, trY, brX, brY, blX, blY], offsetPos);

            const offsetCol = i * VERTICES_PER_RECT * COLOR_COMPONENTS;
            const color = randomColor();
            // 每个顶点都用相同颜色
            for (let j = 0; j < VERTICES_PER_RECT; j++) {
                colors.set(color, offsetCol + j * COLOR_COMPONENTS);
            }
        }
    }

    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, positions.byteLength, gl.DYNAMIC_DRAW);

    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, colors.byteLength, gl.DYNAMIC_DRAW);

    function render() {
        if (!gl) return;

        updateBuffers();

        gl.useProgram(program);
        gl.uniform2f(resolutionUniformLocation, gl.canvas.width, gl.canvas.height);

        // 上传位置数据
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        gl.bufferSubData(gl.ARRAY_BUFFER, 0, positions);
        gl.enableVertexAttribArray(positionAttributeLocation);
        gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);

        // 上传颜色数据
        gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
        gl.bufferSubData(gl.ARRAY_BUFFER, 0, colors);
        gl.enableVertexAttribArray(colorAttributeLocation);
        gl.vertexAttribPointer(colorAttributeLocation, 4, gl.FLOAT, false, 0, 0);

        // 绘制所有矩形
        gl.drawArrays(gl.TRIANGLES, 0, RECT_COUNT * VERTICES_PER_RECT);
    }

    render();

    timeUsage.value = performance.now() - start;
});
</script>

<style lang="scss" scoped></style>
