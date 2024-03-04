import { defineStore } from 'pinia';
import { ref } from 'vue';
import { getTags } from '@/apis/getMeme';

export const useMemesStore = defineStore('memes', () => {
    // 所有tag
    const tags = ref(['加载中...']);
    // 当前tag
    const currentTags = ref(['所有烂梗']);
    async function loadTags() {
        tags.value = await getTags();
    }
    // 当前搜索词
    const searchKey = ref('默认一个肯定搜不到的关键词');
    function changeSearchKey(key: string) {
        searchKey.value = key;
    }
    // 此次会话临时记录一下赞过的烂梗
    const likedMemesId = ref<Set<number>>(new Set());

    return { tags, loadTags, currentTags, searchKey, changeSearchKey, likedMemesId };
});
