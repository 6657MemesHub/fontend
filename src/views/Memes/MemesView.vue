<script setup lang="ts">
import { computed, ref, type Ref, watch } from 'vue';
import { scrollToTop } from '@/utils/windowBOM';
import { getMemesByTag, getMemesCount, type meme } from '@/apis/getMeme';
import { searchMemeByKey } from '@/apis/searchMeme';
import { createMessage } from '@/components/showMessage';
import { stringArrayComparison } from '@/utils/algorithm';
import { useMemesStore } from '@/store/memes';
import MemeList from '@/components/MemeList.vue';
import MemePagination from '@/components/MemePagination.vue';
import done_icon from '@/assets/icon/done_icon.png';
import x_icon from '@/assets/icon/x.png';
import add_icon from '@/assets/icon/add.png';

// 标签部分逻辑
const currentTags = computed(() => useMemesStore().currentTags);
const moreTags = computed(() => useMemesStore().tags);
const tagSelecting = ref<boolean>(false);
const moreTagsDOM = ref<HTMLElement>() as Ref<HTMLElement>;
function slideList() {
    if (tagSelecting.value) {
        moreTagsDOM.value.style.height = '0px';
    } else {
        moreTagsDOM.value.style.height = `${moreTagsDOM.value.scrollHeight}px`;
    }
    tagSelecting.value = !tagSelecting.value;
}
function removeTag(index: number) {
    if (currentTags.value.length <= 1) {
        createMessage('❌', '至少需要一个标签');
        return;
    }
    moreTags.value.push(currentTags.value[index]);
    currentTags.value.splice(index, 1);
}
function addTag(index: number) {
    currentTags.value.push(moreTags.value[index]);
    moreTags.value.splice(index, 1);
}

// 后端调用部分，此处定义页码，此页要渲染数据的数组
const MEMES_PER_PAGE = 50;
const currentPage = ref(1);
const memesCount = ref(1);
const totalPages = computed(() => Math.ceil(memesCount.value / MEMES_PER_PAGE));
const currentDataList = ref<meme[] | null>(null);

async function updateMemes(tag: string, page: number) {
    if (tag === '所有烂梗') tag = '';
    const res = await searchMemeByKey('', tag, page, MEMES_PER_PAGE);
    currentDataList.value = res;
    console.log('烂梗', res);
}
updateMemes(currentTags.value[0], currentPage.value);
async function updateMemesCount(tag: string) {
    if (tag === '所有烂梗') tag = '';
    const res = await getMemesCount(tag, '');
    memesCount.value = res;
    console.log('烂梗条数', res);
}
updateMemesCount(currentTags.value[0]);
function updateCurrentPage(page: number) {
    currentPage.value = page;
}

// 监听tag和页码变化，更新逻辑统一此处处理
let tagChanging = false;
let previewTags = [...currentTags.value];
watch(currentPage, () => {
    if (tagChanging) return;
    // 翻页回顶部
    scrollToTop();
    updateMemes(currentTags.value[0], currentPage.value);
});
watch(tagSelecting, async (newValue, oldValue) => {
    if (newValue === true || stringArrayComparison(previewTags, currentTags.value)) return;

    tagChanging = true;
    currentPage.value = 1;
    await Promise.all([updateMemes(currentTags.value[0], currentPage.value), updateMemesCount(currentTags.value[0])]);
    previewTags = [...currentTags.value];
    tagChanging = false;
});
</script>

<template>
    <div class="meme-bg1">
        <div class="tags">
            <div class="tag1" v-for="(item, index) in currentTags" :key="index">
                <img class="tag-icon" src="@/assets/icon/tag.svg" alt="" />
                <div>{{ item }}</div>
                <img v-if="tagSelecting" class="click-icon" :src="x_icon" alt="" @click="removeTag(index)" />
            </div>
            <div class="tag-done"><img :src="tagSelecting ? done_icon : add_icon" @click="slideList" alt="" /></div>
        </div>
        <div class="meme-and-tag">
            <div class="more-tags" ref="moreTagsDOM">
                <div class="line"></div>
                <div class="tag1" v-for="(item, index) in moreTags" :key="index">
                    <img class="tag-icon" src="@/assets/icon/tag.svg" alt="" />
                    <div>{{ item }}</div>
                    <img class="click-icon" :src="add_icon" alt="" @click="addTag(index)" />
                </div>
            </div>
            <div class="list-container">
                <img class="handle" src="@/assets/icon/downArrow.png" @click="slideList" :style="tagSelecting ? `transform: rotate(180deg)` : `transform: rotate(0deg)`" />
                <MemeList loadingTips="烂梗加载中..." :currentDataList="currentDataList"></MemeList>
            </div>
            <MemePagination :currentPage="currentPage" :totalPages="totalPages" @change="updateCurrentPage"></MemePagination>
        </div>
    </div>
</template>
<style lang="scss" scoped>
.meme-bg1 {
    border-radius: 30px 30px 0 0;
    background-color: #e0e0e0;
    .tags {
        display: flex;
        flex-wrap: wrap;
        width: calc(100% - 30px);
        margin: 0 15px;
        .tag-done {
            height: 20px;
            width: 20px;
            padding: 4px;
            margin: 5px;
            border-radius: 14px;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-wrap: wrap;
            background-color: #fff;
            img {
                height: 16px;
            }
            &:hover {
                cursor: pointer;
            }
        }
    }
    .tag1 {
        height: 20px;
        display: flex;
        align-items: center;
        gap: 8px;
        border-radius: 14px;
        padding: 4px 8px;
        margin: 5px 5px;
        background-color: #fff;
        transition: all 0.4s;
        .tag-icon {
            height: 12px;
        }
        .click-icon {
            height: 16px;
            &:hover {
                cursor: pointer;
            }
        }
    }
    .meme-and-tag {
        .more-tags {
            height: 0;
            display: flex;
            flex-wrap: wrap;
            width: calc(100% - 30px);
            margin: 0 15px;
            overflow: hidden;
            transition: all 0.6s;
            .line {
                width: 100%;
                height: 1px;
                background-color: #818181;
                margin: 10px 0;
            }
        }
        .list-container {
            width: 100%;
            border-radius: 30px 30px 0 0;
            background-color: #f7f7f7;
            .handle {
                height: 20px;
                margin: 10px 0 0;
                margin-left: calc(50% - 10px);
                transition: all 0.4s;
                transform: rotate(0deg);
                &:hover {
                    cursor: pointer;
                }
            }
        }
    }
}
</style>
