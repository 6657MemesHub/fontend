import httpInstance from '@/apis/http';
import { API } from '@/apis/backend';

export interface meme {
    content: string;
    id: number;
    like: number;
    review: boolean;
    tags: string;
}

export function getMemesByTag(tag: string, page: number, pageSize: number): Promise<meme[]> {
    return httpInstance({
        url: API.GET_MEMES_BY_TAG,
        method: 'GET',
        params: {
            tag: tag,
            page: page,
            page_size: pageSize
        }
    });
}

type countRes = { count: number };
export async function getMemesCount(tag: string, content: string): Promise<number> {
    const res: countRes = await httpInstance({
        url: API.GET_MEMES_COUNT,
        method: 'GET',
        params: {
            tag: tag,
            content: content
        }
    });
    return res.count;
}

type tagsRes = Array<{ tag: string; id: number }>;
export async function getTags(): Promise<string[]> {
    const res: tagsRes = await httpInstance({ url: API.GET_TAGS, method: 'GET' });
    return res.map((item) => item.tag);
}

export async function randomMeme(): Promise<string> {
    const res: meme = await httpInstance({
        url: API.GET_RANDOM_MEME,
        method: 'GET',
        params: {
            tag: ''
        }
    });
    console.log(res);

    return res.content;
}
