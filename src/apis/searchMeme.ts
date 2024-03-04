import httpInstance from '@/apis/http';
import { API } from '@/apis/backend';

export interface meme {
    content: string;
    id: number;
    like: number;
    review: boolean;
    tags: string;
}
export function searchMemeByKey(key: string, tag: string, page: number, pageSize: number): Promise<meme[]> {
    return httpInstance({
        url: API.SEARCH_MEME,
        method: 'GET',
        params: {
            content: key,
            tag: tag,
            page: page,
            page_size: pageSize
        }
    });
}
