import glsl from "vite-plugin-glsl";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    compatibilityDate: "2025-07-15",
    devtools: { enabled: false },
    css: ["~/assets/styles/main.scss"],
    postcss: {
        plugins: {
            tailwindcss: {},
            autoprefixer: {},
        },
    },
    vite: {
        plugins: [
            glsl({
                include: ["**/*.vert", "**/*.frag"],
                exclude: ["node_modules", ".git"],
            }),
        ],
    },
    app: {
        head: {
            title: "GL Demos",
            titleTemplate: "%s - GL Demos",
            meta: [
                {
                    name: "description",
                    content: "A collection of WebGL / OpenGL demos and experiments",
                },
            ],
        },
    },
});
