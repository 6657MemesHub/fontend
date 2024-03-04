<script setup lang="ts">
import { ref, type Ref, computed, toRefs } from 'vue';
interface Props {
    currentPage: number;
    totalPages: number;
}
const props = defineProps<Props>();
const { currentPage, totalPages } = toRefs(props);
// 这个change由父组件定义，用来改currentPage
const emit = defineEmits(['change']);

const gotoPage = ref<number>(1);
// 翻页函数
function goToPage(page: number | string) {
    if (typeof page !== 'number' || page === currentPage.value) return;
    if (page < 1 || page > totalPages.value) {
        alert('请输入合理页码');
        return;
    }
    emit('change', page);
}
function nextPage() {
    if (currentPage.value < totalPages.value) emit('change', currentPage.value + 1);
}
function prevPage() {
    if (currentPage.value > 1) emit('change', currentPage.value - 1);
}
function usePagination(currentPage: Ref<number>, totalPages: Ref<number>) {
    return computed(() => {
        const wingSize = 2; // 当前页码两侧显示的页码数量
        let pages: (number | string)[] = [];

        pages.push(1); // 始终显示第一页

        let startPage = Math.max(2, currentPage.value - wingSize);
        let endPage = Math.min(totalPages.value - 1, currentPage.value + wingSize);
        // 如果当前页码靠近起始页
        if (startPage > 2) {
            pages.push('...');
        }
        // 生成中间页码
        for (let i = startPage; i <= endPage; i++) {
            pages.push(i);
        }
        // 如果当前页码靠近末尾页
        if (endPage < totalPages.value - 1) {
            pages.push('...');
        }
        // 始终显示最后一页
        pages.push(totalPages.value);

        return pages;
    });
}
const pagination = usePagination(currentPage, totalPages);
</script>

<template>
    <div class="pagination" v-if="totalPages > 1">
        <div class="page-jump">
            <div @click="prevPage">&lt;</div>
            <template v-for="(page, index) in pagination" :key="index">
                <div v-if="page !== '...'" :class="{ active: page === currentPage }" @click="goToPage(page)">
                    {{ page }}
                </div>
                <span v-else>{{ page }}</span>
            </template>
            <div @click="nextPage">&gt;</div>
        </div>
        <div class="goto">
            <input type="text" v-model.number="gotoPage" placeholder="跳转到" @keydown.enter="goToPage(gotoPage)" />
            <div @click="goToPage(gotoPage)">跳转</div>
        </div>
    </div>
</template>
<style lang="scss" scoped>
.pagination {
    width: 100%;
    display: flex;
    justify-content: center;
    margin-top: 20px;
    .page-jump {
        display: flex;
        div {
            height: 30px;
            width: 30px;
            margin-left: 6px;
            text-align: center;
            line-height: 30px;
            background-color: #f5f7fa;
            color: #808080;
            font-weight: bolder;
            &:hover {
                cursor: pointer;
                color: #c2c2c2;
            }
        }
        .active {
            background-color: #9c9c9c;
            color: #fff;
            &:hover {
                cursor: default;
                color: #fff;
            }
        }
    }
    .goto {
        display: flex;
        input {
            width: 42px;
            outline: none;
            border: none;
            background-color: transparent;
            border-bottom: #9c9c9c solid 1px;
        }
        div {
            height: 30px;
            padding: 0 6px;
            line-height: 30px;
            &:hover {
                cursor: pointer;
                color: #c2c2c2;
            }
        }
    }
}
</style>
