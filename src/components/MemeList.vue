<script setup lang="ts">
import { ref, toRefs, computed } from 'vue';
import { copyToClipboard } from '@/utils/windowBOM';
import { type meme } from '@/apis/getMeme';
import { likeMeme } from '@/apis/likeMeme';
import like_icon from '@/assets/icon/like.png';
import liked_icon from '@/assets/icon/liked.png';
import { useMemesStore } from '@/store/memes';
import { createMessage } from './showMessage';

const likeSet = computed(() => useMemesStore().likedMemesId);

type Props = {
    loadingTips: string;
    currentDataList: meme[] | null;
};
const props = defineProps<Props>();
const { loadingTips, currentDataList } = toRefs(props);
const tempLike = ref<number[]>(new Array(50).fill(0));
async function like(id: number, index: number) {
    console.log('试图点赞烂梗id', id);
    if (likeSet.value.has(id)) {
        createMessage('❌', '你今天已经给这个烂梗点过赞了');
        return;
    }
    const res = await likeMeme(id);

    if (!res) return;

    tempLike.value[index]++;
    likeSet.value.add(id);
}
</script>
<template>
    <div class="list">
        <div v-if="!currentDataList" class="meme-loading">{{ loadingTips }}</div>
        <div class="data" v-for="(item, index) in currentDataList" :key="index">
            <div class="index">{{ item.id }}</div>
            <div class="text" @click="copyToClipboard(item.content)" v-html="item.content"></div>
            <div class="meme-like">
                <img :src="likeSet.has(item.id) ? liked_icon : like_icon" alt="" @click="like(item.id, index)" />
                <div>({{ item.like + tempLike[index] }})</div>
            </div>
            <div class="copy" @click="copyToClipboard(item.content)">复制</div>
        </div>
    </div>
</template>
<style lang="scss" scoped>
.list {
    width: 100%;
    border-radius: 30px 30px 0 0;
    background-color: #f7f7f7;

    .meme-loading {
        margin-left: 20px;
        font-size: 30px;
        color: rgb(71, 71, 71);
    }
    .data {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 4px 0;
        &:nth-child(even) {
            background-color: #e5e5e5;
        }
        &:hover {
            background: #aeaeae;
        }
        .index {
            min-width: 76px;
            font-size: 30px;
            font-style: italic;
            color: gray;
            text-align: center;
            margin-right: 10px;
        }
        .text {
            overflow: hidden;
            word-wrap: break-word;
            word-break: normal;
            flex: 1;
            &:hover {
                cursor: pointer;
            }
        }
        .meme-like {
            display: flex;
            flex-direction: column;
            align-items: center;
            img {
                height: 26px;
                &:hover {
                    cursor: pointer;
                }
            }
            & > div {
                color: #2f343f;
            }
        }
        .copy {
            height: 36px;
            width: 70px;
            border-radius: 20px;
            background-color: #e84444;
            color: #fff;
            font-size: 20px;
            font-weight: bolder;
            text-align: center;
            line-height: 36px;
            margin: 0 10px;
            &:hover {
                background-color: #c93535;
                cursor: pointer;
            }
        }
    }
}
</style>
