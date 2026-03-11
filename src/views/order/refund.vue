<template>
    <div class="tabs">
        <div class="tab-list">
            <div class="tab-item" @click="router.push('/order')">订单列表</div>
            <div class="tab-item" :class="{ active: route.path === '/refund' }">退款管理</div>
        </div>
    </div>
    <div class="filter-panel">
        <div class="filter-form">
            <div class="filter-item">
                <label>单号查询</label>
                <el-input type="text" v-model="keyword" placeholder="搜索订单号..." />
            </div>
            <div class="filter-item">
                <label>售后状态</label>
                <el-select
                    style="width: 180px;"
                    v-model="status"
                    placeholder="请选择状态"
                    clearable
                >
                    <el-option
                        v-for="item in options"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                    />
                </el-select>
            </div>
        </div>
        <div class="filter-item" style="margin-left: auto;">
            <button class="btn btn-primary" @click="handleSearch">✧ 开始查询</button>
        </div>
    </div>
    <div class="card">
        <el-table
            :data="list"
            stripe
            style="width: 100%"
            :header-cell-style="headerCellStyle"
        >
            <el-table-column
                prop="refundOrderNo"
                label="退款单号"
            ></el-table-column>
            <el-table-column
                prop="orderNo"
                label="原订单号"
            >
            </el-table-column>
            <el-table-column
                prop="merchantName"
                label="商户"
            >
            </el-table-column>
            <el-table-column
                prop="amount"
                label="金额"
            >
                <template #default="scope">
                    ¥{{scope.row.amount}}
                </template>
            </el-table-column>
            <el-table-column
                prop="remark"
                label="原因"
            >
            </el-table-column>
            <el-table-column
                prop="status"
                label="状态"
            >
                <template #default="scope">
                    <el-tag type="success" v-if="scope.row.afterSaleStatus === 0">无售后</el-tag>
                    <el-tag type="danger" v-if="scope.row.afterSaleStatus === 1">退款中</el-tag>
                    <el-tag type="danger" v-if="scope.row.afterSaleStatus === 2">已退款</el-tag>
                    <el-tag type="danger" v-if="scope.row.afterSaleStatus === 3">纠纷中</el-tag>
                </template>
            </el-table-column>
            <el-table-column
                prop="address"
                label="操作"
            >
                <template #default="scope">
                    <button class="btn btn-secondary btn-sm"
                        style="padding: 0 12px; height: 30px; display: inline-flex; align-items: center; gap: 4px; border-radius: 8px;"
                        @click="handleRefundDetail(scope.row)">
                        管理详情
                    </button>
                </template>
            </el-table-column>
        </el-table>
        <div class="pagination-container" v-if="total > 0">
            <el-pagination
                v-model:current-page="pageNum"
                v-model:page-size="pageSize"
                :page-sizes="[10, 20, 50]"
                size="default"
                :background="false"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
            />
        </div>
    </div>
</template>
<script setup>
import { reactive, ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import {
    queryRefundOrderList,
} from '@/service/orderManage';
const router = useRouter();
const route = useRoute();

const pageNum = ref(1);
const pageSize = ref(10);
const list = ref([]);
const total = ref(0);
const status = ref(null);
const keyword = ref('');
const options = ref(
    [
        {
            value: '',
            label: '全部状态'
        },
        {
            value: '0',
            label: '纠纷中'
        }, {
            value: '1',
            label: '已退款'
        }
    ]
)

const headerCellStyle = {
    background: '#f3f6fb',
    color: '#91a0b9',
    fontWeight: 600,
    height: '50px',
}

const handleSizeChange = (val) => {
    console.log('val', val);
    pageSize.value = val;
    queryList();
}
const handleCurrentChange = (val) => {
    console.log('val', val);
    pageNum.value = val;
    queryList();
}

const handleSearch = () => {
    pageNum.value = 1;
    queryList();
}

const queryList = () => {
    let params = {
        page: pageNum.value,
        limit: pageSize.value,
    }
    if (status.value) {
        params.status = status.value;
    }
    if (keyword.value) {
        params.keyword = keyword.value;
    }
    queryRefundOrderList(params)
        .then(res => {
            console.log('response', res);
            list.value = res.records;
            total.value = res.total;
        })
}

const handleRefundDetail = (row) => {
    router.push({
        path: `/refundDetail/${row.id}`,
    });
}

const handleDetail = (row) => {
    router.push({
        path: '/detail/' + row.id
    });
}

onMounted(()=>{
    document.title = '退款管理 | 平台管理后台';
    queryList(); 
})
</script>
<style scoped lang="scss">
.filter-panel {
    padding: 32px 48px 28px;
}

.filter-form {
    display: grid;
    grid-template-columns: 344px 208px 208px 1fr;
    gap: 0 32px;
    align-items: end;
}

.filter-item {
    margin-bottom: 0;
}

.filter-action {
    display: flex;
    justify-content: flex-end;
    align-items: flex-end;
    height: 100%;
}

.query-btn {
    width: 220px;
    height: 76px;
    border-radius: 20px;
    border: none;
    background: linear-gradient(135deg, #3b82f6, #10b981);
    font-size: 16px;
    font-weight: 700;
    color: #fff;
}

.query-btn:hover,
.query-btn:focus {
    background: linear-gradient(135deg, #2563eb, #059669);
    color: #fff;
}

.query-btn-icon {
    margin-right: 8px;
    font-size: 18px;
    line-height: 1;
}
@media (max-width: 1400px) {
    .filter-form {
        grid-template-columns: repeat(3, minmax(0, 1fr));
        row-gap: 16px;
    }

    .filter-action {
        grid-column: 1 / -1;
        justify-content: flex-start;
    }
}

@media (max-width: 900px) {
    .filter-panel {
        padding: 20px;
    }

    .filter-form {
        grid-template-columns: 1fr;
    }

    .query-btn {
        width: 100%;
        height: 52px;
        border-radius: 14px;
    }
}
.filter-panel {
    display: flex;
    gap: 16px;
    align-items: flex-end;
    padding: 18px 24px;
    background: var(--bg-surface);
    border: 1px solid var(--border-color);
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-sm);
    margin-bottom: 24px;
}
.filter-item label {
    font-size: 11px;
    color: var(--text-tertiary);
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    margin-bottom: 6px;
    display: block;
}
:deep(.filter-item .el-input__wrapper) {
    padding: 0;
    border-radius: 10px;
    
}
:deep(.filter-item .el-select__wrapper){
    padding: 0;
    border-radius: 10px;
    height: 38px;
    // border: 1.5px solid var(--border-color);
    border-radius: 10px;
    padding: 0 12px;
    font-size: 14px;
    transition: all var(--transition-fast);
}
:deep(.filter-item .el-input__inner) {
    height: 38px;
    border: 1.5px solid var(--border-color);
    border-radius: 10px;
    padding: 0 12px;
    font-size: 14px;
    transition: all var(--transition-fast);
}
</style>