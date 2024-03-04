<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useRoute } from 'vue-router';
import { searchMemeByKey } from '@/apis/searchMeme';
import { getMemesCount } from '@/apis/getMeme';
import { type meme } from '@/apis/getMeme';
import { scrollToTop } from '@/utils/windowBOM';
import MemeList from '@/components/MemeList.vue';
import MemePagination from '@/components/MemePagination.vue';
import { useMemesStore } from '@/store/memes';

const route = useRoute();
const searchQuery = computed(() => {
    if (typeof route.query.s !== 'string') return useMemesStore().searchKey;
    return route.query.s;
});

const MEMES_PER_PAGE = 50;
const currentPage = ref(1);
const memesCount = ref(1);
const totalPages = computed(() => Math.ceil(memesCount.value / MEMES_PER_PAGE));
const currentDataList = ref<meme[] | null>(null);

async function updateMemes(key: string, page: number) {
    useMemesStore().changeSearchKey(key);
    const res = await searchMemeByKey(key, '', page, MEMES_PER_PAGE);
    currentDataList.value = res;
    console.log('烂梗', res);
}
if (searchQuery.value !== '默认一个肯定搜不到的关键词') updateMemes(searchQuery.value, currentPage.value);

async function updateMemesCount(key: string) {
    const res = await getMemesCount('', key);
    memesCount.value = res;
    console.log('烂梗条数', res);
}
if (searchQuery.value !== '默认一个肯定搜不到的关键词') updateMemesCount(searchQuery.value);

function updateCurrentPage(page: number) {
    currentPage.value = page;
}

let searchingFlag = false;
watch(currentPage, () => {
    if (searchingFlag) return;
    // 翻页回顶部
    scrollToTop();
    updateMemes(searchQuery.value, currentPage.value);
});
watch(searchQuery, async () => {
    searchingFlag = true;
    currentPage.value = 1;
    await Promise.all([updateMemes(searchQuery.value, currentPage.value), updateMemesCount(searchQuery.value)]);
    searchingFlag = false;
});
// 转义特殊字符串正则
function escapeRegExp(string: string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
// 高亮搜索关键字
const hightLightData = computed(() => {
    if (currentDataList.value === null) return [];
    // 以搜索词做正则匹配，不区分大小写
    const regex = new RegExp(escapeRegExp(searchQuery.value), 'gi');
    // 把之前搜索完成后的数组，加上高亮
    return currentDataList.value.map((item) => {
        const newTtem = { ...item };
        newTtem.content = item.content.replace(regex, (match) => `<span style="background-color: yellow">${match}</span>`);
        return newTtem;
    });
});
</script>

<template>
    <template v-if="hightLightData && hightLightData.length > 0">
        <div class="tip">搜索结果:</div>
        <MemeList loadingTips="搜索结果加载中..." :currentDataList="hightLightData"></MemeList>
        <MemePagination :currentPage="currentPage" :totalPages="totalPages" @change="updateCurrentPage"></MemePagination>
    </template>
    <div class="cant" v-else>没有找到搜索结果。想要补充更多烂梗？到投稿页投稿！</div>
</template>

<style scoped lang="scss">
.tip {
    margin-left: 10px;
    font-size: 30px;
    color: rgb(71, 71, 71);
}
.cant {
    margin: 20px;
    padding-bottom: 40px;
}
</style>
