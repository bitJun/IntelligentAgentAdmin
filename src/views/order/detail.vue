<template>
    <div class="tabs">
        <div class="tab-list">
            <div
                class="tab-item"
                :class="{ active: currentTab === 1 }"
                @click="handleTabChange(1)"
            >
                订单信息
            </div>
            <div
                class="tab-item"
                :class="{ active: currentTab === 2 }"
                @click="handleTabChange(2)"
            >
                分账记录
            </div>
            <div
                class="tab-item"
                :class="{ active: currentTab === 3 }"
                @click="handleTabChange(3)"
            >
                退款记录
            </div>
        </div>
    </div>
    <div class="card" v-if="currentTab === 1">
        <div class="card-header" style="display: flex; justify-content: space-between; align-items: center;">
            <h3 class="card-title">核心业务数据</h3>
            <button class="btn btn-secondary btn-sm" @click="router.go(-1)">
                返回列表
            </button>
        </div>
        <div class="card-body">
            <div class="info-grid">
                <div class="info-block">
                    <div class="info-block-title">订单编号</div>
                    <div id="od-id" style="font-weight:800; color:var(--brand-blue-dark); font-size:16px;">{{detail.orderNo}}</div>
                </div>
                <div class="info-block">
                    <div class="info-block-title">实付金额</div>
                    <div id="od-amount" style="font-weight:900; font-size:20px; color:var(--text-primary);">¥{{detail.amount}}</div>
                </div>
                <div class="info-block">
                    <div class="info-block-title">支付时间</div>
                    <div id="od-payTime" style="font-weight:600;">{{detail.payTime || '--'}}</div>
                </div>
                <div class="info-block">
                    <div class="info-block-title">归属商户</div>
                    <div id="od-merchant" style="font-weight:700;">{{detail.merchantName}}</div>
                </div>
                <div class="info-block">
                    <div class="info-block-title">买家账号</div>
                    <div id="od-buyer" style="font-weight:600;"></div>
                </div>
                <div class="info-block">
                    <div class="info-block-title">履约状态</div>
                    <div id="od-verifyStatus"><span class="tag tag-warning">{{detail.verificationStatusText}}</span></div>
                </div>
                <div class="info-block">
                    <div class="info-block-title">支付状态</div>
                    <div id="od-payStatus"><span class="tag tag-success">{{detail.statusText}}</span></div>
                </div>
                <div class="info-block">
                    <div class="info-block-title">分账状态</div>
                    <div id="od-profitStatus"><span class="tag tag-default">{{ detail.profitStatus }}</span></div>
                </div>
            </div>
        </div>
    </div>
    <div class="card" v-if="currentTab === 2">
        <div class="card-header" style="display: flex; justify-content: space-between; align-items: center;">
            <h3 class="card-title">分账流水明细</h3>
        </div>
        <el-table
            :data="list"
            stripe
            style="width: 100%"
            :header-cell-style="headerCellStyle"
        >
            <el-table-column
                prop="orderNo"
                label="分账时间"
            ></el-table-column>
            <el-table-column
                prop="payTime"
                label="金额"
            >
            </el-table-column>
            <el-table-column
                prop="name"
                label="分账状态"
            >
            </el-table-column>
            <el-table-column
                prop="amount"
                label="异常/错误码"
            >
                <template #default="scope">
                    ¥{{ scope.row.amount }}
                </template>
            </el-table-column>
            <el-table-column
                prop="address"
                label="操作"
            >
                <template #default="scope">
                </template>
            </el-table-column>
        </el-table>
        <div class="pagination-container">
            <el-pagination
                v-model:current-page="pageNum"
                v-model:page-size="pageSize"
                size="default"
                :background="false"
                layout="total, prev, pager, next, jumper"
                :total="total"
                @current-change="handleCurrentChange"
            />
        </div>
    </div>
    <div class="card" v-if="currentTab === 3">
        <div class="card-header" style="display: flex; justify-content: space-between; align-items: center;">
            <h3 class="card-title">关联退款记录</h3>
        </div>
        <el-table
            :data="refundlist"
            stripe
            style="width: 100%"
            :header-cell-style="headerCellStyle"
        >
            <el-table-column
                prop="refundOrderNo"
                label="退款单号"
            ></el-table-column>
            <el-table-column
                prop="payTime"
                label="发起时间"
            >
            </el-table-column>
            <el-table-column
                prop="amount"
                label="退款金额"
            >
                <template #default="scope">
                    ¥{{scope.row.amount}}
                </template>
            </el-table-column>
            <el-table-column
                prop="amount"
                label="退款原因"
            ></el-table-column>
            <el-table-column
                prop="amount"
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
                    <button class="btn btn-secondary btn-sm" @click="handleRefundDetail(scope.row)">
                        管理详情
                    </button>
                </template>
            </el-table-column>
        </el-table>
        <div class="pagination-container">
            <el-pagination
                v-model:current-page="refundpageNum"
                v-model:page-size="refundpageSize"
                size="default"
                :background="false"
                layout="total, prev, pager, next, jumper"
                :total="refundtotal"
                @current-change="handleRefundCurrentChange"
            />
        </div>
    </div>
</template>
<script setup>
import {
  queryOrderDetail,
  queryRefundOrderList
} from '@/service/orderManage';
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
const router = useRouter();
const route = useRoute();
const currentTab = ref(1);
const id = ref(null);
const detail = ref({});
const pageNum = ref(1);
const pageSize = ref(10);
const list = ref([]);
const total = ref(0);
const refundlist = ref([]);
const refundtotal = ref(0);
const refundpageNum = ref(1);
const refundpageSize = ref(10);
const orderNo = ref(null);

onMounted(()=>{
    id.value = route.params.id;
    orderNo.value = route.query.orderNo;
    queryInfo();
    onLoadRefundList();
});

const headerCellStyle = {
    background: '#f3f6fb',
    color: '#91a0b9',
    fontWeight: 600,
    height: '50px',
}

const queryInfo = () => {
    let params = {
        id: id.value
    }
    queryOrderDetail(params)
        .then(res => {
        detail.value = res;
    })
}

const handleTabChange = (key) => {
    currentTab.value = key;
}

const handleCurrentChange = (val) => {
    console.log('val', val);
    pageNum.value = val;
}

const handleRefundCurrentChange = (val) => {
    console.log('val', val);
    refundpageNum.value = val;
}

const onLoadRefundList = () => {
    let params = {
        page: refundpageNum.value,
        limit: refundpageSize.value,
        keyword: orderNo.value,
    }
    queryRefundOrderList(params)
        .then(res => {
            console.log('response', res);
            refundlist.value = res.records;
            refundtotal.value = res.total;
        })
}

const handleRefundDetail = (row) => {
    router.push({
        path: `/refundDetail/${row.id}`,
    });
}
</script>
<style scoped lang="scss">
.info-block {
    background: var(--bg-muted);
    border: 1px solid var(--border-color);
    border-radius: 12px;
    padding: 16px;
    transition: all 0.2s ease;
}
.info-block-title {
    font-size: 11px;
    font-weight: 800;
    color: var(--text-tertiary);
    text-transform: uppercase;
    margin-bottom: 8px;
}
</style>