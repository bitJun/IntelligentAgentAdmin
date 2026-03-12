<template>
  <div class="container" v-if="route.path == '/login'"><router-view/></div>
  <div class="container" v-else>
    <aside class="sidebar">
      <div class="sidebar-logo">
        <div class="sidebar-logo-icon">✦</div>
        <h3>智能体</h3>
      </div>
      <ul class="menu">
        <li
          class="menu-item"
          :class="{ active: route.path === '/review' }"
          @click="router.push('/review')"
          v-if="store.perms.includes('/platform/product/audit/list') || store.perms.includes('*')"
        >
          <span class="menu-icon">📦</span>
          <span>审核</span>
        </li>
        <li
          class="menu-item"
          :class="{ active: route.path === '/material' }"
          @click="router.push('/material')"
          v-if="store.perms.includes('/platform/business-card/list') || store.perms.includes('*')"
        >
          <span class="menu-icon">👤</span>
          <span>资料</span>
        </li>
        <li
          class="menu-item"
          :class="{ active: route.path === '/merchant' }"
          @click="router.push('/merchant')"
          v-if="store.perms.includes('/platform/merchant/list') || store.perms.includes('*')"
        >
          <span class="menu-icon">🏪</span>
          <span>商户</span>
        </li>
        <li
          class="menu-item"
          :class="{ active: route.path === '/order' }"
          @click="router.push('/order')"
          v-if="store.perms.includes('/platform/order/list') || store.perms.includes('*')"
        >
          <span class="menu-icon">💰</span>
          <span>订单</span>
        </li>
        <li
          class="menu-item"
          :class="{ active: route.path === '/system' }"
          @click="router.push('/system')"
          v-if="store.perms.includes('/admin/admin/list') || store.perms.includes('*')"
        >
          <span class="menu-icon">⚙️</span>
          <span>系统</span>
        </li>
      </ul>
      <div class="sidebar-bottom">
        <div class="user-avatar">{{store.name.charAt(0)}}</div>
        <div class="user-info-text">
          <div class="user-name">{{store.name}}</div>
          <div class="user-role">{{store.roles}}</div>
        </div>
      </div>
    </aside>
    <div class="main">
      <div class="header">
        <div class="header-title">
          <h2 class="page-title">{{ route.meta.name }}</h2>
          <div class="page-breadcrumb">{{ route.meta.tag }}</div>
        </div>
        <!-- <div class="header-right">
          <button class="btn btn-primary" @click="onLogout">退出登录</button>
        </div> -->
        <div class="header-user">
          <div class="user-info" @click="onLogout">
            <div class="user-avatar">{{store.name.charAt(0)}}</div>
            <span id="userName">{{store.roles}}</span>
            <span style="font-size: 12px; color: var(--text-tertiary); margin-left: 4px;">退出</span>
          </div>
        </div>
      </div>
      <div class="content">
        <router-view/>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted, watch} from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { getToken, removeToken } from '@/utils/auth'
import { logout } from '@service/login';
import { useStore } from '@/store/user';

const route = useRoute();
const router = useRouter();
const store = useStore();


const onLogout = () => {
  logout(getToken()).then(() => {
    removeToken();
    router.replace('/login');
  }).catch(error => {
    reject(error)
  })
}


</script>
<style lang="scss">
.container {
  display: flex;
}
.sidebar {
  width: var(--sidebar-width);
  min-width: var(--sidebar-width);
  background: var(--bg-surface);
  border-right: 1px solid var(--border-color);
  padding: 24px 14px;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
}
.main {
  flex: 1;
  position: static;
}
.header {
  position: sticky;
  top: 0;
  z-index: 1000;
  height: var(--header-height);
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--border-color);
  position: sticky;
  top: 0;
  z-index: 90;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 var(--content-padding);
}
.content {
  height: calc(100vh - 72px);
  padding: 32px;
  box-sizing: border-box;
  overflow-y: scroll;
}
.sidebar-logo {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 20px 10px;
  margin-bottom: 20px;
}
.sidebar-logo::before {
  content: '✦';
  width: 40px;
  height: 40px;
  background: var(--brand-gradient);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  color: white;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.25);
  flex-shrink: 0;
}
.sidebar-logo h3 {
  font-size: 13px;
  font-weight: 600;
  color: var(--text-secondary);
  letter-spacing: 0.5px;
}
.menu {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.menu-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 12px 10px;
  border-radius: 12px;
  color: var(--text-secondary);
  cursor: pointer;
  user-select: none;
  transition: all var(--transition-base);
  text-decoration: none;
  text-align: center;
}
.menu-item.active {
  background: linear-gradient(135deg, #eff6ff, #ecfdf5);
  color: var(--brand-blue-dark);
  font-weight: 700;
}
.menu-item:hover {
  background: var(--bg-hover);
  color: var(--brand-blue);
  transform: none;
}
.menu-item:hover {
  background: var(--bg-hover);
  color: var(--brand-blue);
  transform: none;
}
.menu-icon {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  background: var(--bg-muted);
}
.menu-item.active .menu-icon {
  background: white;
  color: var(--brand-blue);
  box-shadow: var(--shadow-sm);
}
.menu-item span:not(.menu-icon) {
  font-size: 12px;
  white-space: nowrap;
}
.sidebar-bottom {
  margin-top: auto;
  padding: 16px 4px;
  border-top: 1px solid var(--border-color);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  text-align: center;
}
.user-avatar {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: var(--brand-gradient);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 12px;
}
.sidebar-bottom .user-avatar {
  width: 32px;
  height: 32px;
  font-size: 11px;
}
.sidebar-bottom .user-info-text {
  width: 100%;
  overflow: hidden;
}
.sidebar-bottom .user-name {
  font-size: 12px;
  font-weight: 700;
  color: var(--text-primary);
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}
.sidebar-bottom .user-role {
  font-size: 10px;
  color: var(--text-tertiary);
  white-space: nowrap;
}
.header-title .page-title {
  font-size: 20px;
  font-weight: 700;
  color: #1e293b;
  letter-spacing: -0.02em;
}
.header-title .page-breadcrumb {
  font-size: 12px;
  color: var(--text-tertiary);
  font-weight: 500;
}
.user-info {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 6px 14px;
    border-radius: var(--radius-full);
    border: 1px solid var(--border-color);
    background: var(--bg-surface);
    cursor: pointer;
    transition: all var(--transition-fast);
}
.user-avatar {
    width: 28px;
    height: 28px;
    border-radius: 50%;
    background: var(--brand-gradient);
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 700;
    font-size: 12px;
}
</style>