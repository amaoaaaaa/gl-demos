import { defineNuxtPlugin } from "#app";
import Vuesax from "vuesax-ts";
import "vuesax-ts/style.css";

export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.vueApp.use(Vuesax);
});
