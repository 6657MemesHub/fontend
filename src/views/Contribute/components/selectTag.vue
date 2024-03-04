<script setup lang="ts">
import { ref, toRefs } from 'vue';
import x_icon from '@/assets/icon/x.png';
import add_icon from '@/assets/icon/add.png';
const props = defineProps<{
    currentTags: string[];
    moreTags: string[];
}>();
const { currentTags, moreTags } = toRefs(props);
const emit = defineEmits(['removeTag', 'addTag', 'createTag']);
const newTag = ref('');
function createTag(tag: string) {
    emit('createTag', tag);
    newTag.value = '';
}
</script>
<template>
    <div class="tags-box">
        <div class="current-tags-container">
            <div class="tips">已选标签:</div>
            <div class="current-tags">
                <div class="tag1" v-for="(item, index) in currentTags" :key="index">
                    <img class="tag-icon" src="@/assets/icon/tag.svg" alt="" />
                    <div>{{ item }}</div>
                    <img class="click-icon" :src="x_icon" alt="" @click="emit('removeTag', index)" />
                </div>
            </div>
        </div>
        <div class="line"></div>
        <div class="more-tags-container">
            <div class="tips">可选标签:</div>
            <div class="more-tags">
                <div class="tag1" v-for="(item, index) in moreTags" :key="index">
                    <img class="tag-icon" src="@/assets/icon/tag.svg" alt="" />
                    <div>{{ item }}</div>
                    <img class="click-icon" :src="add_icon" alt="" @click="emit('addTag', index)" />
                </div>
            </div>
        </div>
        <div class="new-tags">
            <input type="text" placeholder="没有想要的标签？这里输入新创建一个标签！" v-model="newTag" />
            <img class="click-icon" :src="add_icon" alt="" @click="createTag(newTag)" />
        </div>
    </div>
</template>
<style lang="scss" scoped>
.tags-box {
    background-color: #e0e0e0;
    padding: 10px;
    border-radius: 20px;
    .current-tags,
    .more-tags {
        display: flex;
        flex-wrap: wrap;
        margin: 0 15px;
    }
    .line {
        width: 100%;
        height: 1px;
        background-color: #818181;
        margin: 5px 0;
    }
    .new-tags {
        width: 290px;
        height: 20px;
        display: flex;
        align-items: center;
        gap: 8px;
        border-radius: 14px;
        padding: 4px 8px;
        margin: 5px 5px;
        background-color: #fff;
        input {
            width: 260px;
            background-color: transparent;
            border: none;
            outline: none;
        }
        img {
            height: 16px;
            &:hover {
                cursor: pointer;
            }
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
</style>
