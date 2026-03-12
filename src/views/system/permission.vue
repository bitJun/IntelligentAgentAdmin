<template>
    <div class="card">
        <div class="card-header">
            <div class="profile-info" style="display:flex; align-items:center; gap:16px;">
                <div class="user-avatar" id="adminInitial" style="width:48px; height:48px; font-size:20px;">
                    {{username.charAt(0)}}
                </div>
                <div>
                    <h3 class="card-title" id="adminNameDisplay">{{username}}</h3>
                    <div class="text-desc" id="adminRoleDisplay">{{roleName}}</div>
                </div>
            </div>
            <div class="card-actions">
                <button class="btn btn-secondary" @click="onCancelBack()">取消并返回</button>
                <button class="btn btn-primary" style="margin-left: 10px;" @click="onSavePermissions()">✧
                    保存权限配置</button>
            </div>
        </div>
        <div class="card-body">
            <div class="permission-grid">
                <!-- 审核管理 -->
                <div class="perm-card">
                    <div class="perm-header">
                        <div class="perm-title"><span>📦</span> 审核管理</div>
                        <el-checkbox v-model="aduitPermission" />
                    </div>
                    <div class="perm-list">
                        <label class="perm-item">
                            <el-checkbox 
                                v-model="productPermission"
                                @change="onChangePermission('platform:product:list')"
                                disabled
                            />
                            <span>商品上架审核</span>
                        </label>
                        <label class="perm-item">
                            <el-checkbox 
                                v-model="businessCardPermission"
                                @change="onChangePermission('platform:business-card:list')"
                            />
                            <span>名片资料审核</span>
                        </label>
                        <!-- <label class="perm-item"><input type="checkbox"> <span>审核记录导出</span></label> -->
                    </div>
                </div>

                <!-- 商户管理 -->
                <div class="perm-card">
                    <div class="perm-header">
                        <div class="perm-title"><span>👤</span> 商户管理</div>
                        <el-checkbox v-model="merchantPermission" />
                    </div>
                    <div class="perm-list">
                        <label class="perm-item">
                            <el-checkbox 
                                v-model="merchantListPermission"
                                @change="onChangePermission('platform:merchant:list')"
                            />
                            <span>商户列表查看</span>
                        </label>
                        <label class="perm-item">
                            <el-checkbox 
                                v-model="merchantStatusPermission"
                                @change="onChangePermission('platform:merchant:updateStatus')"
                            />
                            <span>商户冻结/解冻</span>
                        </label>
                        <!-- <label class="perm-item"><input type="checkbox"> <span>商户档案编辑</span></label> -->
                    </div>
                </div>

                <!-- 订单中心 -->
                <div class="perm-card">
                    <div class="perm-header">
                        <div class="perm-title"><span>💰</span> 订单中心</div>
                        <el-checkbox v-model="orderPermission" />
                    </div>
                    <div class="perm-list">
                        <label class="perm-item">
                            <el-checkbox
                                v-model="orderListPermission"
                                @change="onChangePermission('platform:order:list')"
                            />
                            <span>订单列表查看</span>
                        </label>
                        <label class="perm-item">
                            <el-checkbox 
                                v-model="orderStatusPermission"
                                @change="onChangePermission('platform:order:updateStatus')"
                            />
                            <span>退款申请处理</span>
                        </label>
                        <!-- <label class="perm-item">
                            <span>财务分账操作</span></label> -->
                    </div>
                </div>

                <!-- 系统管理 -->
                <div class="perm-card">
                    <div class="perm-header">
                        <div class="perm-title"><span>⚙️</span> 系统管理</div>
                        <el-checkbox v-model="systemPermission" />
                    </div>
                    <div class="perm-list">
                        <label class="perm-item">
                            <el-checkbox
                                v-model="adminListPermission"
                                @change="onChangePermission('admin:admin:list')"
                            />
                            <span>管理员</span>
                        </label>
                        <label class="perm-item">
                            <el-checkbox 
                                v-model="adminLogPermission"
                                @change="onChangePermission('admin:log:list')"
                            />
                            <span>操作日志查看</span>
                        </label>
                        <!-- <label class="perm-item">
                            <span>系统参数设置</span></label> -->
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { getPermission, updatePermission } from '@/service/role';
import { ElMessage } from 'element-plus';
const router = useRouter();
const route = useRoute();
const id = route.params.id;
const roleName = route.query.roleName;
const username = route.query.username;

const aduitPermission = ref(false);
const merchantPermission = ref(false);
const orderPermission = ref(false);
const systemPermission = ref(false);
const permissionList = ref([]);
const productPermission = ref(false);
const businessCardPermission = ref(false);
const merchantListPermission = ref(false);
const merchantStatusPermission = ref(false);
const orderListPermission = ref(false);
const orderStatusPermission = ref(false);
const adminListPermission = ref(false);
const adminLogPermission = ref(false);

onMounted(()=>{
    onLoadPermission();
});

const onLoadPermission = () => {
    getPermission({ userId: id }).then(res => {
        permissionList.value = res.curPermissions;
        if(permissionList.value.includes('platform:product:list')) {
            productPermission.value = true;
        }
        if(permissionList.value.includes('platform:business-card:list')) {
            businessCardPermission.value = true;
        }
        if (permissionList.value.includes('platform:product:list') && permissionList.value.includes('platform:business-card:list')) {
            aduitPermission.value = true;
        }
        if(permissionList.value.includes('platform:merchant:list')) {
            merchantListPermission.value = true;
        }
        if(permissionList.value.includes('platform:merchant:updateStatus')) {
            merchantStatusPermission.value = true;
        }
        if (permissionList.value.includes('platform:merchant:list') && permissionList.value.includes('platform:merchant:updateStatus')) {
            merchantPermission.value = true;
        }
        if(permissionList.value.includes('platform:order:list')) {
            orderListPermission.value = true;
        }
        if(permissionList.value.includes('platform:order:updateStatus')) {
            orderStatusPermission.value = true;
        }
        if (permissionList.value.includes('platform:order:list') && permissionList.value.includes('platform:order:updateStatus')) {
            orderPermission.value = true;
        }
        if(permissionList.value.includes('admin:admin:list')) {
            adminListPermission.value = true;
        }
        if(permissionList.value.includes('admin:log:list')) {
            adminLogPermission.value = true;
        }
        if (permissionList.value.includes('admin:admin:list') && permissionList.value.includes('admin:log:list')) {
            systemPermission.value = true;
        }
    })
}

const onCancelBack = () => {
    router.back();
}

const onSavePermissions = () => {
    let params = {
        userId: Number(id),
        permissions: [
            ...(productPermission.value ? ['platform:product:list'] : []),
            ...(businessCardPermission.value ? ['platform:business-card:list'] : []),
            ...(merchantListPermission.value ? ['platform:merchant:list'] : []),
            ...(merchantStatusPermission.value ? ['platform:merchant:updateStatus'] : []),
            ...(orderListPermission.value ? ['platform:order:list'] : []),
            ...(orderStatusPermission.value ? ['platform:order:updateStatus'] : []),
            ...(adminListPermission.value ? ['admin:admin:list'] : []),
            ...(adminLogPermission.value ? ['admin:log:list'] : []),
        ]
    }
    if (params.permissions.includes('platform:order:list')) {
        params.permissions.push('platform:order:detail');
        params.permissions.push('platform:order:refund');
        params.permissions.push('platform:order:getRefundOrderList');
        params.permissions.push('platform:order:getRefundOrderDetail');
    }
    if (params.permissions.includes('platform:product:list')) {
        params.permissions.push('platform:product:audit');
        params.permissions.push('platform:product:getMerchantProductList');
        params.permissions.push('platform:product:detail');
    }
    if (params.permissions.includes('platform:business-card:list')) {
        params.permissions.push('platform:business-card:detail');
        params.permissions.push('platform:business-card:audit');
    }
    if (params.permissions.includes('platform:merchant:list')) {
        params.permissions.push('platform:merchant:batchAdd');
        params.permissions.push('platform:merchant:getMerchantInfo');
    }
    if (params.permissions.includes('admin:admin:list')) {
        params.permissions.push('admin:role:permission:update');
        params.permissions.push('admin:role:permission:get');
        params.permissions.push('admin:role:list');
    }
    updatePermission(params).then(res => {
        ElMessage.success('保存成功');
        router.go(-1);
    })
}
const onChangePermission = () => {

}

watch(aduitPermission, (newVal) => {
    if (newVal) {
        productPermission.value = true;
        businessCardPermission.value = true;
    }
});

watch(
  [productPermission, businessCardPermission],
  (newValues, oldValues) => {
    const [newProductPermission, newBusinessCardPermission] = newValues;
    if (newProductPermission && newBusinessCardPermission) {
        aduitPermission.value = true;
    } else {
        aduitPermission.value = false;
    }
  }
)

watch(merchantPermission, (newVal) => {
    if (newVal) {
        merchantListPermission.value = true;
        merchantStatusPermission.value = true;
    }
});

watch(
  [merchantListPermission, merchantStatusPermission],
  (newValues, oldValues) => {
    const [newMerchantListPermission, newMerchantStatusPermission] = newValues;
    if (newMerchantListPermission && newMerchantStatusPermission) {
        merchantPermission.value = true;
    } else {
        merchantPermission.value = false;
    }
  }
)

watch(orderPermission, (newVal) => {
    if (newVal) {
        orderListPermission.value = true;
        orderStatusPermission.value = true;
    }
});

watch(
  [orderListPermission, orderStatusPermission],
  (newValues, oldValues) => {
    const [newOrderListPermission, newOrderStatusPermission] = newValues;
    if (newOrderListPermission && newOrderStatusPermission) {
        orderPermission.value = true;
    } else {
        orderPermission.value = false;
    }
  }
)

watch(systemPermission, (newVal) => {
    if (newVal) {
        adminListPermission.value = true;
        adminLogPermission.value = true;
    }
});

watch(
  [adminListPermission, adminLogPermission],
  (newValues, oldValues) => {
    const [newAdminListPermission, newAdminLogPermission] = newValues;
    if (newAdminListPermission && newAdminLogPermission) {
        systemPermission.value = true;
    } else {
        systemPermission.value = false;
    }
  }
)



</script>
<style scoped lang="scss">
.card-header {
    padding: 20px 24px;
    border-bottom: 1px solid var(--border-color);
    display: flex;
    justify-content: flex-start;
    align-items: center;
}

.card-header::before {
    content: '';
    width: 4px;
    height: 16px;
    background: var(--brand-gradient);
    border-radius: 2px;
    margin-right: 10px;
    display: inline-block;
    vertical-align: middle;
}

.profile-info {
    flex: 1;
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

.card-title {
    font-size: 16px;
    font-weight: 700;
    color: var(--text-primary);
    text-align: left;
    margin-right: auto;
}

.text-desc {
    font-size: 13px;
    color: var(--text-secondary);
}
.permission-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 20px;
    margin-top: 20px;
}
.perm-card {
    background: var(--bg-surface);
    border: 1.5px solid var(--border-color);
    border-radius: var(--radius-lg);
    padding: 20px;
    transition: all var(--transition-base);
}
.perm-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 16px;
    padding-bottom: 12px;
    border-bottom: 1px solid var(--border-color);
}
.perm-title {
    font-weight: 800;
    color: var(--text-primary);
    display: flex;
    align-items: center;
    gap: 8px;
}
.perm-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
}
.perm-item {
    display: flex;
    align-items: center;
    gap: 10px;
    cursor: pointer;
    user-select: none;
}
.perm-item span {
    font-size: 14px;
    color: var(--text-secondary);
}
</style>