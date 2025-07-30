<template>
    <div class="flex flex-col p-3 w-72">
        <RouterLink
            v-for="(item, index) in routes"
            :key="index"
            :to="item.path"
            class="py-1 hover:text-violet-500"
        >
            {{ item.name.replace("demos-", "") }}
        </RouterLink>
    </div>
</template>

<script lang="ts" setup>
import { sortBy } from "lodash-es";

const routes = sortBy(
    useRouter()
        .getRoutes()
        .map((route) => ({
            path: route.path,
            name: route.name as string,
        })),
    "name"
);
</script>

<style lang="scss" scoped></style>
