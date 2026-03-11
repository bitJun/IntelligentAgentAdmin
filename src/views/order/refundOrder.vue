<template>
    <div class="app-container">
        <div class="refund-detail-page">
            <el-card class="section-card">
                <template #header>
                    <div class="section-header">
                        <div class="section-title">
                            <span class="line"></span>
                            退款单信息
                        </div>
                    </div>
                </template>
                <div class="info-grid">
                    <div class="info-item">
                        <div class="info-label">退款单号</div>
                        <div class="info-value primary">{{ refundDetail.refundOrderNo || '' }}</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">原订单号</div>
                        <div class="info-value">{{ refundDetail.orderNo || '' }}</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">商户</div>
                        <div class="info-value">{{ refundDetail.merchantName || '' }}</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">买家</div>
                        <div class="info-value">{{ refundDetail.buyerName || '' }}</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">金额</div>
                        <div class="info-value price">{{ refundDetail.amount || '' }}</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">当前状态</div>
                        <el-tag type="success" v-if="refundDetail.afterSaleStatus === 0">无售后</el-tag>
                        <el-tag type="danger" v-if="refundDetail.afterSaleStatus === 1">退款中</el-tag>
                        <el-tag type="danger" v-if="refundDetail.afterSaleStatus === 2">已退款</el-tag>
                        <el-tag type="danger" v-if="refundDetail.afterSaleStatus === 3">纠纷中</el-tag>
                    </div>
                </div>

                <div class="reason-item">
                    <div class="info-label">退款原因描述</div>
                    <div class="info-value">{{ refundDetail.remark || '' }}</div>
                </div>
            </el-card>
            <el-card class="section-card">
                <template #header>
                    <div class="section-title">
                        <span class="line"></span>
                        处理操作
                    </div>
                </template>

                <div class="risk-tip">
                    <div class="risk-title">
                        <i class="el-icon-warning"></i> 风险操作提示
                    </div>
                    <div class="risk-desc">
                        强制退款仅超级管理员可用；执行后系统将强制原路退回资金，并永久关闭该订单的核销与分账权限。
                    </div>
                </div>

                <div class="operate-area">
                    <div class="operate-label">处理备注（驳回/强制必填）</div>
                    <el-input v-model="refundReason" placeholder="请输入处理备注..." class="remark-input"></el-input>
                    <div class="operate-buttons">
                        <el-button type="danger" class="dangerBtn" @click="handleRefund(2)">驳回退款</el-button>
                        <el-button type="primary" class="submitBtn" @click="handleRefund(1)">同意退款</el-button>
                    </div>
                </div>
            </el-card>
        </div>
    </div>
</template>
<script setup>
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import {
    queryRefundOrderDetail,
    refundOrder
} from '@/service/orderManage';
const router = useRouter();
const route = useRoute();
const id = ref(null);
const refundDetail = ref({
    refundOrderNo: '',
    orderNo: '',
    merchantName: '',
    buyerName: '',
    amount: '',
    afterSaleStatus: 0,
    remark: '',
});
const refundReason = ref('');

onMounted(()=>{
    console.log('route', route);
    id.value = route.params.id;
    console.log('id', id.value);
    queryInfo();
})

const queryInfo = () => {
    let params = {
        id: id.value
    }
    queryRefundOrderDetail(params)
        .then(res => {
            refundDetail.value = res;
        })
}

const handleRefund = (key) => {
    let params = {
        refundReason: refundReason.value,
        refundStatus: key
    }
    if (key === 2 && !refundReason.value) {
        // this.$message.error('请输入处理备注');
        return;
    }
    refundOrder(params, refundDetail.value.id)
        .then(res => {
            // this.$message.success('处理成功');
            router.back();
        })
}

</script>
<style>
.flex {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    justify-content: space-between;
}

.flex-item {
    padding: 10px;
    box-sizing: border-box;
    border-radius: 20px;
    border: 1px solid #E5E5E5;
    background-color: #F5F5F5;
    width: 32%;
    height: 100px;
    margin-bottom: 20px;
}

.flex-items {
    display: flex;
    align-items: center;
    width: 25%;
    margin-bottom: 20px;
}


.cancelBtn {
    background: #f1f5f9;
    color: #1e293b;
    border: 1.5px solid #eef2f6;
    border-radius: 15px;
}

.submitBtn {
    box-shadow: rgba(59, 130, 246, 0.25) 0px 4.0077px 12.0308px 0px;
    background: linear-gradient(135deg, #3b82f6, #10b981);
    border-radius: 15px;
}

.dangerBtn {
    background: rgba(239, 68, 68, 0.08);
    color: #dc2626;
    background: rgba(239, 68, 68, 0.08);
    border-radius: 15px;
}

.refund-detail-page {
    padding: 16px;
    background-color: #f5f7fa;
    min-height: 100vh;
}

/* 通用卡片样式 */
.section-card {
    border-radius: 12px;
    margin-bottom: 20px;
}

.section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.section-title {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 16px;
    font-weight: 500;
    color: #303133;
}

.line {
    width: 4px;
    height: 16px;
    background: linear-gradient(180deg, #409eff, #67c23a);
    border-radius: 2px;
}

/* 退款单信息区 */
.info-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 16px;
    margin-bottom: 16px;
}

.info-item {
    background-color: #f5f7fa;
    padding: 16px;
    border-radius: 8px;
}

.info-label {
    font-size: 13px;
    color: #909399;
    margin-bottom: 8px;
}

.info-value {
    font-size: 15px;
    color: #303133;
}

.info-value.primary {
    color: #409eff;
    font-weight: 500;
}

.info-value.price {
    font-size: 18px;
    font-weight: 600;
}

.reason-item {
    background-color: #f5f7fa;
    padding: 16px;
    border-radius: 8px;
}

/* 风险提示 */
.risk-tip {
    background-color: #fef0f0;
    border: 1px solid #fde2e2;
    border-radius: 8px;
    padding: 16px;
    margin-bottom: 20px;
}

.risk-title {
    color: #f56c6c;
    font-weight: 500;
    margin-bottom: 8px;
}

.risk-desc {
    color: #909399;
    font-size: 14px;
}

/* 操作区 */
.operate-area {
    display: flex;
    flex-direction: column;
    gap: 16px;
}

.operate-label {
    font-size: 14px;
    color: #606266;
}

.remark-input {
    width: 100%;
    max-width: 400px;
}

.operate-buttons {
    display: flex;
    justify-content: flex-end;
    gap: 12px;
}
</style>
