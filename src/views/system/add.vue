<template>
    <div class="card">
        <div class="card-header">
            <h3 class="card-title">创建账号</h3>
            <div class="card-actions">
                <button class="btn btn-secondary" @click="router.go(-1)">返回列表</button>
            </div>
        </div>
        <div class="card-body">
            <div class="info-grid" style="grid-template-columns: 1fr 1fr;">
                <div class="form-group">
                    <label>管理员姓名</label>
                    <el-input
                        class="form-control"
                        id="adminName"
                        placeholder="请输入姓名"
                        v-model="params.username"
                    />
                </div>
                <div class="form-group">
                    <label>手机号</label>
                    <el-input
                        class="form-control"
                        id="adminPhone"
                        placeholder="请输入手机号"
                        v-model="params.phone"
                    />
                </div>
                <div class="form-group">
                    <label>系统角色</label>
                    <el-select
                        class="form-control"
                        id="adminRole"
                        placeholder="请选择系统角色"
                        v-model="params.roleIds"
                    >
                        <el-option
                            v-for="item in options"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                        />
                    </el-select>
                </div>
                <div class="form-group">
                    <label>初始密码</label>
                    <el-input
                        class="form-control"
                        id="adminPwd"
                        placeholder="自动生成或手动设置"
                        v-model="params.password"
                    />
                </div>
            </div>
            <div class="flexEnd">
                <button class="btn btn-secondary" @click="resetForm()">重置</button>
                <button class="btn btn-primary" @click="onAddAdmin()">✧ 创建管理员</button>
            </div>
        </div>
    </div>
</template>
<script setup>
import {
    createAdmin
} from '@/service/admin';
import { ref } from 'vue';
const options = ref(
    [
        {
            value: '0',
            label: '超级管理员'
        }, {
            value: '1',
            label: '审核专员'
        }, {
            value: '2',
            label: '财务'
        }
    ]
)
const params = ref({
    username: '',
    password: '',
    roleIds: '',
    phone: ''
})

const onAddAdmin = () => {
    let data = {...params.value, roleIds: [params.value.roleIds]};
    createAdmin(data)
        .then(res => {
            console.log('res', res);
        })
}
    
</script>
<style scoped lang="scss">
.info-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 20px;
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

:deep(.form-control .el-input__wrapper) {
    padding: 0;
    border-radius: 10px;
    
}
:deep(.form-control .el-select__wrapper){
    padding: 0;
    border-radius: 10px;
    height: 38px;
    // border: 1.5px solid var(--border-color);
    border-radius: 10px;
    padding: 0 12px;
    font-size: 14px;
    transition: all var(--transition-fast);
}
:deep(.form-control .el-input__inner) {
    height: 38px;
    border: 1.5px solid var(--border-color);
    border-radius: 10px;
    padding: 0 12px;
    font-size: 14px;
    transition: all var(--transition-fast);
}
.flexEnd {
    display: flex;
    justify-content: flex-end;
    gap: 12px;
    margin-top: 18px;
}
</style>