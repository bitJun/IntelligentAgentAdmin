<template>
    <div class="card">
        <div class="card-header">
            <div class="profile-info" style="display:flex; align-items:center; gap:16px;">
                <div class="user-avatar" id="adminInitial" style="width:48px; height:48px; font-size:20px;">A</div>
                <div>
                    <h3 class="card-title" id="adminNameDisplay">Audit01</h3>
                    <div class="text-desc" id="adminRoleDisplay">审核专员</div>
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
                        <input type="checkbox" checked="" onchange="toggleGroup(this)">
                    </div>
                    <div class="perm-list">
                        <label class="perm-item"><input type="checkbox" checked=""> <span>商品上架审核</span></label>
                        <label class="perm-item"><input type="checkbox" checked=""> <span>名片资料审核</span></label>
                        <label class="perm-item"><input type="checkbox"> <span>审核记录导出</span></label>
                    </div>
                </div>

                <!-- 商户管理 -->
                <div class="perm-card">
                    <div class="perm-header">
                        <div class="perm-title"><span>👤</span> 商户管理</div>
                        <input type="checkbox" checked="" onchange="toggleGroup(this)">
                    </div>
                    <div class="perm-list">
                        <label class="perm-item"><input type="checkbox" checked=""> <span>商户列表查看</span></label>
                        <label class="perm-item"><input type="checkbox" checked=""> <span>商户冻结/解冻</span></label>
                        <label class="perm-item"><input type="checkbox"> <span>商户档案编辑</span></label>
                    </div>
                </div>

                <!-- 订单中心 -->
                <div class="perm-card">
                    <div class="perm-header">
                        <div class="perm-title"><span>💰</span> 订单中心</div>
                        <input type="checkbox" onchange="toggleGroup(this)">
                    </div>
                    <div class="perm-list">
                        <label class="perm-item"><input type="checkbox"> <span>订单列表查看</span></label>
                        <label class="perm-item"><input type="checkbox"> <span>退款申请处理</span></label>
                        <label class="perm-item"><input type="checkbox"> <span>财务分账操作</span></label>
                    </div>
                </div>

                <!-- 系统管理 -->
                <div class="perm-card">
                    <div class="perm-header">
                        <div class="perm-title"><span>⚙️</span> 系统管理</div>
                        <input type="checkbox" onchange="toggleGroup(this)">
                    </div>
                    <div class="perm-list">
                        <label class="perm-item"><input type="checkbox"> <span>管理员增删改</span></label>
                        <label class="perm-item"><input type="checkbox"> <span>操作日志查看</span></label>
                        <label class="perm-item"><input type="checkbox"> <span>系统参数设置</span></label>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup>
import { ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
const router = useRouter();
const route = useRoute();
const id = route.params.id;

const onCancelBack = () => {
    router.back();
}

const onSavePermissions = () => {
    console.log('onSavePermissions', id);
}
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