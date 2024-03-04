export function shuffleArray<T>(array: T[]): T[] {
    // Fisher-Yates洗牌算法
    let current: number = array.length;
    let temp: T, random: number;

    while (current !== 0) {
        random = Math.floor(Math.random() * current);
        current--;

        temp = array[current];
        array[current] = array[random];
        array[random] = temp;
    }

    return array;
}
// 这个是排序后比较，只顺序不同不算
export function stringArrayComparison(arr1: string[], arr2: string[]) {
    const a1 = [...arr1].sort();
    const a2 = [...arr2].sort();
    return a1.length === a2.length && a1.every((e, i) => e === a2[i]);
}
