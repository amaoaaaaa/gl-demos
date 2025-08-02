<template>
    <!-- <div class="grid grid-cols-2 gap-5 p-3">
        <RouterLink v-for="(item, index) in routes" :key="index" :to="item.path">
            <vs-card>
                <template #title>
                    <h3>{{ item.name }}</h3>
                </template>

                <template #img>
                    <img :src="item.thumbnail" alt="thumbnail" />
                </template>

                <template #text>
                    <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit.</p>
                </template>
            </vs-card>
        </RouterLink>
    </div> -->

    <div class="flex items-center flex-wrap">
        <vs-button v-for="(item, index) in routes" :key="index" @click="$router.push(item.path)">
            {{ item.name }}
        </vs-button>
    </div>
</template>

<script lang="ts" setup>
import { sortBy } from "lodash-es";

const routes = sortBy(
    useRouter()
        .getRoutes()
        .filter((route) => route.path.startsWith("/demos"))
        .map((route) => {
            const name = (route.name as string).replace("demos-", "");

            return {
                path: route.path,
                name: name,
                thumbnail: `/demos/thumbnails/${name}.png`,
            };
        }),
    "name"
);
</script>

<style lang="scss" scoped></style>
