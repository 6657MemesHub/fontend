import httpInstance from '@/apis/http';
import { API } from './backend';

export async function likeMeme(id: number) {
    console.log('调用点赞接口，烂梗ID', id);

    const res = await httpInstance({
        url: API.LIKE_MEME,
        method: 'PUT',
        headers: {
            'X-Forwarded-For': `${id}`,
            'X-Like-Error': true
        },
        data: {
            id: id
        }
    });

    console.log('点赞烂梗ID接口', res);
    return res;
}
