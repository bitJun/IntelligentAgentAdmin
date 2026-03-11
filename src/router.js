import { createRouter, createWebHistory } from 'vue-router'

import ReviewView from '@views/review/index.vue';
import MaterialView from '@views/material/index.vue';
import OrderView from '@views/order/index.vue';
import RefundOrderView from '@views/order/refundOrder.vue';
import RefundView from '@views/order/refund.vue';
import OrderDetailView from '@views/order/detail.vue';
import SystemView from '@views/system/index.vue';
import PermissionView from '@views/system/permission.vue';
import AddView from '@views/system/add.vue';
import MerchantView from '@views/merchant/index.vue';
import MerchantDetailView from '@views/merchant/detail.vue';
import LoginView from '@views/login/index.vue';

const routes = [
    {
        path: '/',
        redirect: '/review',
    },
    {
        path: '/login',
        component: LoginView,
    },
    {
        path: '/review',
        component: ReviewView,
        meta: {
            title: '审核',
            name: '商品审核',
            tag: '首页 / 审核管理 / 商品'
        }
    },
    {
        path: '/material',
        component: MaterialView,
        meta: {
            title: '资料',
            name: '名片/形象审核',
            tag: '首页 / 审核管理 / 资料'
        }
    },
    {
        path: '/merchant',
        component: MerchantView,
        meta: {
            title: '商户',
            name: '商户管理',
            tag: '首页 / 商户管理'
        }
    },
    {
        path: '/merchant/:id',
        component: MerchantDetailView,
        meta: {
            title: '商户',
            name: '商户管理详情',
            tag: '首页 / 商户管理 / 详情'
        }
    },
    {
        path: '/order',
        component: OrderView,
        meta: {
            title: '订单',
            name: '订单与财务',
            tag: '首页 / 订单中心'
        }
    },
    {
        path: '/refund',
        component: RefundView,
        meta: {
            title: '订单',
            name: '退款与售后',
            tag: '首页 / 订单 / 退款管理'
        }
    },
    {
        path: '/orderDetail/:id',
        component: OrderDetailView,
        meta: {
            title: '订单',
            name: '订单详情',
            tag: '首页 / 订单 / 详情'
        }
    },
    {
        path: '/refundDetail/:id',
        component: RefundOrderView,
        meta: {
            title: '订单',
            name: '退款详情',
            tag: '首页 / 订单 / 退款 / 详情'
        }
    },
    {
        path: '/system',
        component: SystemView,
        meta: {
            title: '系统',
            name: '系统管理与设置',
            tag: '首页 / 系统 / 设置'
        }
    },
    {
        path: '/system/permission/:id',
        component: PermissionView,
        meta: {
            title: '系统',
            name: '配置管理员权限',
            tag: '首页 / 系统 / 管理员管理 / 配置权限'
        }
    },
    {
        path: '/system/add',
        component: AddView,
        meta: {
            title: '系统',
            name: '新增管理员',
            tag: '首页 / 系统 / 管理员管理 / 新增管理员'
        }
    },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
