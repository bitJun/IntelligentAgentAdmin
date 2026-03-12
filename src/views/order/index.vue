<template>
    <div class="tabs">
        <div class="tab-list">
            <div class="tab-item" :class="{ active: route.path === '/order' }">订单列表</div>
            <div class="tab-item" @click="router.push('/refund')">退款管理</div>
        </div>
    </div>
    <div class="filter-panel">
        <div class="filter-form">
            <div class="filter-item">
                <label>订单号</label>
                <el-input v-model="orderNo" type="text" placeholder="搜索订单号..." clearable />
            </div>
            <div class="filter-item">
                <label>商户筛选</label>
                <el-input v-model="merchantName" type="text" placeholder="搜索订单号..." clearable />
            </div>
            <div class="filter-item">
                <label>当前状态</label>
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
                prop="orderNo"
                label="订单号"
            >
                <template #default="scope">
                    <span style="font-weight: 700;color: var(--brand-blue-dark);">{{ scope.row.orderNo }}</span>
                </template>
            </el-table-column>
            <el-table-column
                prop="payTime"
                label="支付时间"
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
                    ¥{{ scope.row.amount }}
                </template>
            </el-table-column>
            <el-table-column
                prop="status"
                label="支付状态"
            >
                <template #default="scope">
                    <el-tag type="success" v-if="scope.row.status === 0">待支付</el-tag>
                    <el-tag type="success" v-if="scope.row.status === 1">支付成功</el-tag>
                    <el-tag type="success" v-if="scope.row.status === 2">已关闭</el-tag>
                    <el-tag type="success" v-if="scope.row.status === 3">已取消</el-tag>
                    <el-tag type="success" v-if="scope.row.status === 4">已退款</el-tag>
                </template>
            </el-table-column>
            <el-table-column
                prop="verificationStatus"
                label="核销状态"
            >
                <template #default="scope">
                    <el-tag type="warning" v-if="scope.row.verificationStatus === 0">待核销</el-tag>
                    <el-tag type="success" v-if="scope.row.verificationStatus === 1">已核销</el-tag>
                </template>
            </el-table-column>
            <el-table-column
                prop="profitStatus"
                label="分账状态"
            >
                <template #default="scope">
                    <el-tag type="warning" v-if="scope.row.profitStatus === 0">待分账</el-tag>
                    <el-tag type="success" v-if="scope.row.profitStatus === 1">已分账</el-tag>
                    <!-- <el-tag type="success" v-if="scope.row.profitStatus === 1">分账关闭</el-tag>
                    <el-tag type="danger" v-if="scope.row.profitStatus === 2">分账失败</el-tag> -->
                </template>
            </el-table-column>
            <el-table-column
                prop="address"
                label="操作"
            >
                <template #default="scope">
                    <button class="btn btn-secondary btn-sm"
                        style="padding: 0 12px; height: 30px; display: inline-flex; align-items: center; gap: 4px; border-radius: 8px;"
                        @click="handleDetail(scope.row)">
                        管理详情
                    </button>
                </template>
            </el-table-column>
        </el-table>
        <div class="pagination-container" v-if="total > 0">
            <el-pagination
                v-model:current-page="pageNum"
                v-model:page-size="pageSize"
                size="default"
                :background="false"
                layout="total, prev, pager, next, jumper"
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
  queryOrderList,
} from '@/service/orderManage';
const router = useRouter();
const route = useRoute();

const pageNum = ref(1);
const pageSize = ref(10);
const list = ref([]);
const total = ref(0);
const status = ref(null);
const orderNo = ref('');
const merchantName = ref('');

const options = ref(
    [
        {
            value: '',
            label: '全部状态'
        },
        {
            value: '0',
            label: '待支付'
        }, {
            value: '1',
            label: '支付成功'
        }, {
            value: '2',
            label: '已关闭'
        }, {
            value: '3',
            label: '已取消'
        }
    ]
)

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

const queryList = () => {
    let params = {
        page: pageNum.value,
        limit: pageSize.value,
        orderNo: orderNo.value,
        merchantName: merchantName.value,
    }
    if (status.value) {
        params.status = status.value;
    }
    queryOrderList(params)
        .then(res => {
            console.log('response', res);
            list.value = res.records;
            total.value = res.total;
        })
}

const handleDetail = (row) => {
    router.push({
        path: `/orderDetail/${row.id}`,
        query: {
            orderNo: row.orderNo
        }
    });
}

const handleSearch = () => {
    queryList();
}

const headerCellStyle = {
    background: '#f3f6fb',
    color: '#91a0b9',
    fontWeight: 600,
    height: '50px',
}

onMounted(()=>{
    document.title = '订单中心 | 平台管理后台';
    queryList(); 
})
</script>
<style scoped lang="scss">

.filter-panel {
    padding: 32px 48px 28px;
}

.filter-form {
    // display: grid;
    // grid-template-columns: 344px 208px 208px 1fr;
    // gap: 0 32px;
    // align-items: end;
    display: flex;
    align-items: flex-end;
    gap: 32px
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
