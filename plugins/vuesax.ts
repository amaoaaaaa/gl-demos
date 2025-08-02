import { defineNuxtPlugin } from "#app";
import { VsButton, VsCard } from "vuesax-ts";
import "vuesax-ts/style.css";

export default defineNuxtPlugin((nuxtApp) => {
    // nuxtApp.vueApp.use(Vuesax);

    nuxtApp.vueApp.use(VsButton);
    nuxtApp.vueApp.use(VsCard);
});
