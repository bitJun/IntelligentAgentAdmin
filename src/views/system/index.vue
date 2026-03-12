<template>
    <div class="card">
        <div class="card-header">
            <h3 class="card-title">管理团队账号</h3>
            <div class="card-actions">
                <button class="btn btn-primary" @click="router.push('/system/add')">✧ 新增管理员</button>
            </div>
        </div>
        <el-table
            :data="list"
            class="audit-table"
            row-key="id"
            :header-cell-style="headerCellStyle"
        >
            <el-table-column prop="id" label="ID">
            </el-table-column>
            <el-table-column prop="username" label="姓名">
            </el-table-column>
            <el-table-column prop="phone" label="手机号">
            </el-table-column>
            <el-table-column prop="role" label="系统角色">
                <template #default="scope">
                    {{roleInfo[scope.row.roleIds[0]]}}
                </template>
            </el-table-column>
            <el-table-column prop="addTime" label="创建时间">
            </el-table-column>
            <el-table-column prop="status" label="状态">
                <template #default="scope">
                    <el-tag type="success">正常</el-tag>
                </template>
            </el-table-column>
            <el-table-column prop="action" label="操作">
                <template #default="scope">
                    <button
                        @click="handlePermission(scope.row)"
                        class="btn btn-secondary btn-sm"
                        style="padding: 0 12px; height: 30px; display: inline-flex; align-items: center; gap: 4px; border-radius: 8px;"
                    >
                        <span style="font-size: 14px; margin-top: -2px;">⚙️</span>
                        <span>配置权限</span>
                    </button>
                </template>
            </el-table-column>
        </el-table>
        <div class="pagination-container">
            <el-pagination
                v-model:current-page="params.pageNum"
                v-model:page-size="params.pageSize"
                size="default"
                :background="false"
                layout="total, prev, pager, next, jumper"
                :total="total"
                @current-change="handlePageNumChange"
            />
        </div>
    </div>
    <div class="card" v-if="store.perms.includes('/admin/log/list')">
        <div class="card-header">
            <h3 class="card-title">全站操作审计日志 (Audit Log)</h3>
        </div>
        <el-table
            :data="logList"
            class="audit-table"
            row-key="id"
            :header-cell-style="headerCellStyle"
        >
            <el-table-column prop="addTime" label="操作时间">
            </el-table-column>
            <el-table-column prop="admin" label="执行人">
            </el-table-column>
            <el-table-column prop="action" label="业务模块">
            </el-table-column>
            <el-table-column prop="action" label="动作">
            </el-table-column>
            <el-table-column prop="action" label="执行详情">
            </el-table-column>
        </el-table>
        <div class="pagination-container">
            <el-pagination
                v-model:current-page="logParams.page"
                v-model:page-size="logParams.limit"
                size="default"
                :background="false"
                layout="total, prev, pager, next, jumper"
                :total="logTotal"
                @current-change="handleCurrentChange"
            />
        </div>
    </div>
</template>
<script setup>
import { ref, onMounted, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { listAdmin } from '@/service/admin';
import { listLog } from '@/service/log';
import {
    listRole
} from '@/service/role';
import { useStore } from '@/store/user';
const store = useStore();
const router = useRouter();
const params = ref({
    pageNum: 1,
    pageSize: 10,
});
const total = ref(0);
const list = ref([]);
const logList = ref([]);
const logTotal= ref(0);
const logParams = reactive({
    page: 1,
    limit: 10,
    name: undefined,
    sort: 'add_time',
    order: 'desc'
})
const typeMap = {
    0: '一般操作',
    1: '安全操作',
    2: '订单操作',
    3: '其他操作'
}

const headerCellStyle = {
    background: '#f3f6fb',
    color: '#91a0b9',
    fontWeight: 600,
    height: '50px',
}

const roleInfo = ref({});

const getRoleList = () => {
    const params = {
        page: 1,
        limit: 20,
        name: undefined,
        sort: 'add_time',
        order: 'desc'
    }
    listRole(params).then(res => {
        res.list.forEach(item => {
            roleInfo.value[item.id] = item.name;
        });
    })
}

const onLoadData = () => {
    listAdmin(params.value)
        .then(response => {
            list.value = response.list
            total.value = response.total
        });
}

const handlePageSizeChange = (val) => {
    params.value.pageSize = val;
    onLoadData();
}

const handlePageNumChange = (val) => {
    params.value.pageNum = val;
    onLoadData();
}

const handleSizeChange = (val) => {
    console.log('val', val);
    logParams.limit = val;
    onLoadLogList();
}

const handleCurrentChange = (val) => {
    console.log('val', val);
    logParams.page = val;
    onLoadLogList();
}

const onLoadLogList = () => {
    listLog(logParams)
        .then(response => {
            console.log('response', response);
            logList.value = response.list
            logTotal.value = response.total;
        })
}

const handlePermission = (row) => {
    router.push({
        path: `/system/permission/${row.id}`,
        query: {
            roleName: roleInfo.value[row.roleIds[0]],
            username: row.username,
        }
    })
}

onMounted(() => {
    getRoleList();
    onLoadData();
    if (store.perms.includes('/admin/log/list')) {
        onLoadLogList();
    }
});

</script>
<style scoped lang="scss"></style>