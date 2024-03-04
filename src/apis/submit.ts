import httpInstance from '@/apis/http';
import { API } from '@/apis/backend';
// import { stringToUnicode } from '@/utils/unicode';

export async function submitMeme(meme: string, tags: string[]) {
    console.log('试图提交：', meme, tags);
    const res = (await httpInstance({
        url: API.SUBMIT_MEME,
        method: 'POST',
        data: {
            content: meme,
            tags: tags.join() + ',',
            like: 0,
            review: false
        }
    })) as string;
    console.log('烂梗投稿接口返回', res);
    return res;
}
