<script setup lang="ts">
import { ref } from 'vue';
import { submitMeme } from '@/apis/submit';
import { createMessage } from '@/components/showMessage';
import { useMemesStore } from '@/store/memes';
import selectTag from './components/selectTag.vue';

const currentTags = ref<string[]>([]);
const moreTags = ref([...useMemesStore().tags]);
function removeTag(index: number) {
    moreTags.value.push(currentTags.value[index]);
    currentTags.value.splice(index, 1);
}
function addTag(index: number) {
    currentTags.value.push(moreTags.value[index]);
    moreTags.value.splice(index, 1);
}
function createTag(tag: string) {
    if (tag === '') return;
    moreTags.value.push(tag);
}
const meme = ref('');
async function submit() {
    if (meme.value === '') {
        createMessage('❌', '提交内容不能为空');
        return;
    }
    if (currentTags.value.length < 1) {
        createMessage('❌', '至少需要1个标签');
        return;
    }
    if (currentTags.value.length > 5) {
        createMessage('❌', '不要超过5个标签');
        return;
    }
    const res = await submitMeme(meme.value, currentTags.value);
    if (res === 'Submit Success!') {
        createMessage('✅', '烂梗提交成功');
    } else {
        createMessage('❌', '烂梗提交失败，请联系作者汇报bug');
    }
    meme.value = '';
}
</script>
<template>
    <div class="contribute">
        <div class="title">烂梗投稿</div>
        <div class="container-box">
            <div class="input-container">
                <div class="tips">请输入你的烂梗:</div>
                <textarea placeholder="文本输入区域" v-model="meme"></textarea>
            </div>
            <div class="tag-container">
                <div class="tips">
                    <div class="tips1">烂梗归类标签:</div>
                    <div class="tips2">至少1个,不超过5个</div>
                </div>
                <selectTag :currentTags="currentTags" :moreTags="moreTags" @removeTag="removeTag" @addTag="addTag" @createTag="createTag"></selectTag>
            </div>
            <div class="submit-button" @click="submit">确认提交</div>
        </div>
    </div>
</template>
<style lang="scss" scoped>
.contribute {
    .title {
        margin-left: 10px;
        margin-bottom: 10px;
        font-size: 30px;
        color: rgb(71, 71, 71);
    }
    .container-box {
        display: flex;
        flex-direction: column;
        align-items: center;
        width: calc(100% - 40px);
        margin: 0 20px;
        .input-container {
            width: 100%;
            margin-bottom: 10px;
            .tips {
                font-size: 20px;
                font-weight: bold;
                margin-bottom: 10px;
            }
            textarea {
                width: 100%;
                height: 120px;
                border: none;
                outline: none;
                resize: none;
                font-size: 16px;
                font-family: Arial, sans-serif;
            }
        }
        .tag-container {
            width: 100%;
            & > .tips {
                display: flex;
                gap: 20px;
                margin-bottom: 10px;
                .tips1 {
                    font-size: 20px;
                    font-weight: bold;
                }
                .tips2 {
                    font-size: 20px;
                    color: #bdbdbd;
                }
            }
        }
        .submit-button {
            height: 36px;
            width: 200px;
            border-radius: 20px;
            background-color: #e84444;
            color: #fff;
            font-size: 20px;
            font-weight: bolder;
            text-align: center;
            line-height: 36px;
            margin: 10px 10px;
            &:hover {
                background-color: #c93535;
                cursor: pointer;
            }
        }
    }
}
</style>
