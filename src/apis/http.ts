import axios from 'axios';
import { SERVER_ADDRESS } from '@/apis/backend';
import { throttle } from '@/utils/throttle';
import { createMessage } from '@/components/showMessage';
const errAlert = throttle(() => alert('请求过于频繁\n哥们别刷了，要给服务器刷炸了😭，最多一秒刷一回😭'), 800);

const httpInstance = axios.create({
    baseURL: SERVER_ADDRESS,
    timeout: 6000
});

// 拦截器
// axios请求拦截器
httpInstance.interceptors.request.use(
    (config) => {
        return config;
    },
    (e) => Promise.reject(e)
);

// axios响应拦截器
httpInstance.interceptors.response.use(
    (res) => res.data,
    (err) => {
        console.log('err', err);

        // 点赞的是一天一次，特殊处理下
        if (err.config.headers['X-Forwarded-For'] && err.response.status === 429) {
            createMessage('', '别刷赞了😭一个烂梗一天只能赞一次😭');
            return;
        }

        if (err.response.status === 429) {
            errAlert();
            return;
        }

        alert('出现请求错误： ' + err);
        return Promise.reject(err);
    }
);

export default httpInstance;
