<template>
    <canvas ref="canvas" class="border" width="400" height="400"></canvas>
</template>

<script lang="ts" setup>
import vs from "./shader.vert";
import fs from "./shader.frag";

useHead({
    title: "02-使用像素坐标",
});

const canvas = useTemplateRef("canvas");

onMounted(() => {
    // ----------- 初始化（仅执行一次） -----------

    const gl = canvas.value?.getContext("webgl");
    if (!gl) return;

    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vs);
    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fs);
    if (!vertexShader || !fragmentShader) return;

    const program = createProgram(gl, vertexShader, fragmentShader);
    if (!program) return;

    const positionAttributeLocation = gl.getAttribLocation(program, "a_position");
    const resolutionUniformLocation = gl.getUniformLocation(program, "u_resolution");

    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    const positions = [40, 80, 40, 240, 280, 80];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

    // ----------- 渲染准备（每帧或每次 draw 前执行） -----------

    // gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    // gl.clearColor(0, 0, 0, 0); // 可选：设置背景色
    // gl.clear(gl.COLOR_BUFFER_BIT);

    gl.useProgram(program);

    gl.uniform2f(resolutionUniformLocation, gl.canvas.width, gl.canvas.height);

    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.enableVertexAttribArray(positionAttributeLocation);
    gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);

    // ----------- 执行渲染 -----------

    gl.drawArrays(gl.TRIANGLES, 0, 3);
});
</script>

<style lang="scss" scoped></style>
