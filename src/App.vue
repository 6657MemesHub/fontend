<script setup lang="ts">
import { RouterView, useRouter } from 'vue-router';
import GoToTop from '@/components/GoToTop.vue';
import MainPanel from '@/components/AppView/MainPanel.vue';
import MainTab from '@/components/AppView/MainTab.vue';
import { onMounted, onBeforeMount } from 'vue';
import { useMemesStore } from '@/store/memes';
// 应对github page之类的重定向，实现部署spa能用url查询定向
const redirect = sessionStorage.getItem('redirect');
onBeforeMount(async () => {
    if (redirect) {
        console.log('重定向到', redirect);
        await useRouter().push(redirect);
        sessionStorage.removeItem('redirect');
    }
});

// 初始化的时候加载数据
onMounted(() => useMemesStore().loadTags());
</script>

<template>
    <div class="title">
        <img src="https://gcore.jsdelivr.net/gh/9WiSHao/AnythingStorage/img/6657boom.webp" alt="超级大爆" />
    </div>
    <MainPanel></MainPanel>
    <div class="main">
        <MainTab></MainTab>
        <div class="body">
            <RouterView />
        </div>
    </div>
    <GoToTop></GoToTop>
</template>

<style scoped lang="scss">
* {
    padding: 0;
    margin: 0;
}
.title {
    width: calc(100vw - 16px);
    display: flex;
    justify-content: center;
    align-items: start;
    // max-height: 250px;
    // overflow: hidden;

    img {
        height: auto;
        width: 60vw;
        max-width: 600px;
        object-fit: cover;
    }
}
.main {
    width: calc(100vw - 16px);
    min-width: 300px;
    margin-top: 20px;
    border-radius: 10px 10px 0 0;
    background-color: #e0e0e0;
    .body {
        background-color: #f7f7f7;
        padding-top: 20px;
    }
}

@media (min-width: 768px) {
    .title,
    .main {
        width: calc(100vw - 30px);
    }
}
</style>
