<template>
    <div class="login-wrapper">
        <div class="login-card">
            <div class="login-logo-v">
                <div class="logo-icon-lg">✦</div>
                <div class="logo-text-lg">智能体</div>
                <p class="login-subtitle">运营管理平台 · Phase 1</p>
            </div>

            <form @submit.prevent="handleLogin">
                <div class="form-group">
                    <label>管理员账号</label>
                    <input type="text" class="form-control" placeholder="手机号 / 邮箱" v-model="username">
                </div>
                <div class="form-group" style="margin-bottom: 32px;">
                    <label>安全密码</label>
                    <input type="password" class="form-control" placeholder="请输入您的密码" v-model="password">
                </div>
                
                <button type="submit" class="btn btn-primary">
                    ✧ 开启智能管理
                </button>
            </form>
            <div class="login-footer-text">
                © 2026 智能体运营中心 · MVP 版本
            </div>
        </div>
    </div>
</template>
<script setup>
import { ref, onMounted } from 'vue';
import { loginByUsername, getUserInfo } from '@service/login';
import { setToken } from '@/utils/auth'
import { useStore } from '@/store/user';
import { useRouter } from 'vue-router';

const store = useStore();
const username = ref('');
const password = ref('');
const router = useRouter();
const handleLogin = () => {
    let params = {
        code: '',
        username: username.value,
        password: password.value,
    }
    loginByUsername(params)
        .then(res => {
            localStorage.setItem('token', res.token);
            setToken(res.token);
            getUserInfo(res.token).then(res => {
                console.log('res', res);
                store.setName(res.name);
                store.setPerms(res.perms);
                store.setRoles(res.roles);
                router.push('/');
            })
            
        })
        .catch(err => {
            console.log('err', err);
        })
}
</script>
<style scoped lang="scss">
.login-wrapper {
    min-height: 100vh;
    width: 100vw;
    display: flex;
    align-items: center;
    justify-content: center;
    background: radial-gradient(circle at 20% 20%, rgba(59, 130, 246, 0.15), transparent 40%), radial-gradient(circle at 80% 80%, rgba(16, 185, 129, 0.1), transparent 40%), var(--bg-app);
    padding: 20px;
}
.login-card {
    width: 100%;
    max-width: 420px;
    background: rgba(255, 255, 255, 0.8);
    backdrop-filter: blur(20px);
    border: 1px solid rgba(255, 255, 255, 0.5);
    border-radius: 24px;
    padding: 40px;
    box-shadow: var(--shadow-lg);
    animation: loginAppear 0.6s cubic-bezier(0.16, 1, 0.3, 1);
}
.login-logo-v {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16px;
    margin-bottom: 40px;
}
.logo-icon-lg {
    width: 56px;
    height: 56px;
    background: var(--brand-gradient);
    border-radius: 14px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 28px;
    color: white;
    box-shadow: 0 8px 20px rgba(59, 130, 246, 0.25);
}
.logo-text-lg {
    font-size: 24px;
    font-weight: 800;
    color: var(--text-primary);
    letter-spacing: 2px;
}
.form-group {
    margin-bottom: 20px;
}
.form-group label {
    display: block;
    font-size: 12px;
    color: var(--text-tertiary);
    font-weight: 700;
    margin-bottom: 8px;
    text-transform: uppercase;
}
.form-control {
    width: 100%;
    height: 40px;
    padding: 0 14px;
    border-radius: 10px;
    border: 1.5px solid var(--border-color);
    background: var(--bg-surface);
    color: var(--text-primary);
    transition: all var(--transition-fast);
}

.btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    height: 38px;
    padding: 0 20px;
    border-radius: 10px;
    font-weight: 600;
    font-size: 13px;
    cursor: pointer;
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    border: none;
}
.btn-primary {
    background: var(--brand-gradient);
    color: white !important;
    border: none !important;
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.25);
}
.login-footer-text {
    text-align: center;
    margin-top: 32px;
    color: var(--text-tertiary);
    font-size: 12px;
    font-weight: 500;
}
</style>
