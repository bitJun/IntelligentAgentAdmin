import axios from 'axios';
import { getToken } from '@/utils/auth';
import { ElMessage } from 'element-plus';
import router from '@/router';

axios.defaults.withCredentials = true

// create an axios instance
const service = axios.create({
  // 走 vite 代理，避免本地开发时跨域
  // baseURL: window.location.port == 3000 ? '/api' : 'https://dev.wxapi.pangniu.pangguimi.com/admin_dev',
  baseURL: '/api',
  timeout: 15000, // request timeout
})

// request interceptor
service.interceptors.request.use(
  (config) => {
    // Do something before request is sent
    const isLoginApi = config.url?.includes('/admin/auth/login')
    if (getToken() && !isLoginApi) {
      // 让每个请求携带token-- ['X-Litemall-Admin-Token']为自定义key 请根据实际情况自行修改
      config.headers['X-Litemall-Admin-Token'] = getToken()
    }
    return config
  },
  (error) => {
    // Do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  },
)

// response interceptor
service.interceptors.response.use(
  (response) => {
    const res = response.data;
    let code;
    if (res.code) {
      code = res.code
    }
    if (res.errno) {
      code = res.errno
    }
    if (code === 501) {
      ElMessage.error('系统未登录，请重新登录');
      router.replace('/login');
      return Promise.reject('error');
    } else if (code === 502) {
      ElMessage.error('系统内部错误，请联系管理员维护');
      return Promise.reject('error');
    } else if (code === 503) {
      ElMessage.error('请求业务目前未支持');
      return Promise.reject('error');
    } else if (code === 504) {
      ElMessage.error('更新数据已经失效，请刷新页面重新操作');
      return Promise.reject('error');
    } else if (code === 505) {
      ElMessage.error('更新失败，请再尝试一次');
      return Promise.reject('error');
    } else if (code === 506) {
      router.replace('/login');
      return Promise.reject('error')
    } else if (code !== 1) {
      return Promise.reject(res.data)
    } else {
      return response.data.data
    }
  },
  (error) => {
    return Promise.reject(error)
  },
)

export default service
