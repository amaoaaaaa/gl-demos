<template>
    <canvas ref="canvas" class="border" width="400" height="400"></canvas>

    <div class="text-xs text-white mt-2">
        <p>矩形数量：{{ RECT_COUNT }} 个</p>
        <p>绘制耗时：{{ Math.round(timeUsage) }}ms</p>
    </div>
</template>

<script lang="ts" setup>
import vs from "./shader.vert?raw";
import fs from "./shader.frag?raw";
import { random } from "lodash-es";

useHead({
    title: "04-批量绘制矩形",
});

const canvas = useTemplateRef("canvas");

const RECT_COUNT = 50000;
const timeUsage = ref(0);

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

    const positionAttributeLocation = gl.getAttribLocation(program, "a_position");
    const resolutionUniformLocation = gl.getUniformLocation(program, "u_resolution");
    const colorUniformLocation = gl.getUniformLocation(program, "u_color");

    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

    gl.useProgram(program);
    gl.uniform2f(resolutionUniformLocation, gl.canvas.width, gl.canvas.height);

    for (let index = 0; index < RECT_COUNT; index++) {
        // ----------- 渲染准备（每帧或每次 draw 前执行） -----------

        const tlX = random(0, 400);
        const tlY = random(0, 400);
        const trX = random(0, 400);
        const trY = tlY;
        const brX = trX;
        const brY = random(0, 400);
        const blX = tlX;
        const blY = brY;

        const positions = [
            // 三角形1
            tlX,
            tlY,
            blX,
            blY,
            trX,
            trY,
            // 三角形2
            trX,
            trY,
            brX,
            brY,
            blX,
            blY,
        ];
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        gl.enableVertexAttribArray(positionAttributeLocation);
        gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);

        gl.uniform4f(colorUniformLocation, ...randomColor());

        // ----------- 执行渲染 -----------

        // 绘制两个三角形拼成矩形，共6个点
        gl.drawArrays(gl.TRIANGLES, 0, 6);
    }

    timeUsage.value = performance.now() - start;
});
</script>

<style lang="scss" scoped></style>
