<template>
  <div class="app-container">
    <div class="merchant-header">
      <div class="header-left">
        <!-- <div class="avatar">{{detail.name.substring(0, 1)}}</div> -->
        <div class="profile-avatar" v-if="name">{{ name.substring(0, 1) }}</div>
        <div class="info">
          <div class="name-row">
            <h2>{{ name }}</h2>
            <!-- <el-tag type="success" size="small">正常运营</el-tag> -->
            <el-tag type="success" v-if="detail.status === 0">正常</el-tag>
            <el-tag type="danger" v-if="detail.status === 1">冻结</el-tag>
          </div>
          <div class="meta">
            <span>ID: {{ detail.merchantId }}</span>
            <span>联系电话: {{ detail.phone }}</span>
            <span>入驻时间: {{ detail.createTime }}</span>
          </div>
        </div>
      </div>
      <div class="header-right">
        <!-- <el-button size="small" class="cancelBtn">重置密码</el-button> -->
        <button class="btn btn-danger-soft btn-sm" v-if="detail.status === 0"
          @click="show = true">
          冻结账号
        </button>
        <button class="btn btn-success-soft btn-sm" v-if="detail.status === 1"
          @click="handleChangeStatus(detail)">
          解冻账号
        </button>
      </div>
    </div>

    <!-- 核心数据卡片 -->
    <div class="stats-row">
      <el-card class="stat-card" shadow="hover">
        <div class="stat-content">
          <div class="icon money">💰</div>
          <div>
            <div class="value">¥{{ detail.totalRevenue }}</div>
            <div class="label">累计净营收</div>
          </div>
        </div>
      </el-card>
      <el-card class="stat-card" shadow="hover">
        <div class="stat-content">
          <div class="icon check">✅</div>
          <div>
            <div class="value">{{ detail.totalVerificationOrders }}</div>
            <div class="label">已核销订单</div>
          </div>
        </div>
      </el-card>
      <el-card class="stat-card" shadow="hover">
        <div class="stat-content">
          <div class="icon refund">🔄</div>
          <div>
            <div class="value">{{ detail.refundRate }}%</div>
            <div class="label">退款率 (异常)</div>
          </div>
        </div>
      </el-card>
      <el-card class="stat-card" shadow="hover">
        <div class="stat-content">
          <div class="icon star">⭐</div>
          <div>
            <div class="value">{{ detail.overallRate }}</div>
            <div class="label">综合满意度</div>
          </div>
        </div>
      </el-card>
    </div>

    <!-- 经营档案与设置 -->
    <!-- <el-card class="section-card">
            <template #header>
            <div class="section-title">
                <span class="line"></span>
                经营档案与设置
            </div>
            </template>
<div class="info-grid">
  <div class="info-item">
    <div class="info-label">主要经营类目</div>
    <div class="info-value">美容 / 丽人 / 养生</div>
  </div>
  <div class="info-item">
    <div class="info-label">结算方式</div>
    <div class="info-value">微信支付 (企业认证)</div>
  </div>
  <div class="info-item">
    <div class="info-label">经营门店地址</div>
    <div class="info-value">广东省深圳市南山区某街道某...</div>
  </div>
</div>
</el-card> -->

    <!-- 上架商品/服务明细 -->
    <el-card class="section-card">
      <template #header>
        <div class="section-title">
          <span class="line"></span>
          上架商品/服务明细
        </div>
      </template>
      <el-table :data="list" stripe style="width: 100%">
        <el-table-column prop="id" label="商品ID"></el-table-column>
        <el-table-column prop="name" label="商品/服务名称">
        </el-table-column>
        <el-table-column prop="price" label="售卖价格">
          <template #default="scope">
            ¥{{ scope.row.price }}
          </template>
        </el-table-column>
        <el-table-column prop="soldCount" label="累计销量">
        </el-table-column>
        <el-table-column prop="onSale" label="当前状态">
          <template #default="scope">
            <el-tag type="success" v-if="scope.row.onSale === 0">下架</el-tag>
            <el-tag type="danger" v-if="scope.row.onSale === 1">上架</el-tag>
          </template>
        </el-table-column>
        <!-- <el-table-column prop="onSale" label="管理">
          <template #default="scope">
            <button class="btn btn-secondary btn-sm"
              style="padding: 0 12px; height: 30px; display: inline-flex; align-items: center; gap: 4px; border-radius: 8px;"
              @click="handleDetail(scope.row)"
            >
              管理详情
            </button>
          </template>
        </el-table-column> -->
      </el-table>
      <el-pagination background layout="total, sizes, prev, pager, next, jumper" :current-page="current"
        :page-size="limit" :total="goodsTotal" :page-sizes="[10, 20, 50, 100]" @size-change="handleChangeSize"
        @current-change="handleChangeCurrent" style="margin-top:20px;text-align:right" />
    </el-card>
    <el-dialog v-model="show" title="操作确认" width="480" align-center>
      <div class="risk-panel" style="margin-bottom: 0;">
        <div class="risk-title">⚠️ 风险操作提示</div>
        <div class="risk-desc">
          确定要冻结吗？冻结后，该商户所有展示中的商品将同步下架。
        </div>
      </div>
      <template #footer>
        <div class="dialog-footer">
          <button class="btn btn-secondary btn-sm" style="margin-right: 12px;" @click="handleCancel">
            取消
          </button>
          <button class="btn btn-danger-soft btn-sm" @click="handleChangeStatus(detail)">
            确定冻结
          </button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>
<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import {
  updateMerchantStatus,
  queryMerchantInfo,
  queryMerchantProductList
} from '@/service/merchant';

const route = useRoute();
const router = useRouter();
const show = ref(false);
const id = ref(null);
const detail = ref({});
const list = ref([]);
const goodsTotal = ref(0);
const current = ref(1);
const limit = ref(10);
const name = ref('');

onMounted(() => {
  id.value = route.params.id;
  name.value = route.query.name || '';
  queryInfo();
});

const queryInfo = () => {
  queryMerchantInfo({ merchantId: id.value })
    .then(res => {
      detail.value = res;
    })
  queryGoodList(id.value);
}

const handleChangeSize = (size) => {
  limit.value = size;
  queryGoodList(detail.value.merchantId);
}
const handleChangeCurrent = (key) => {
  current.value = current;
  queryGoodList(detail.value.merchantId);
}
const queryGoodList = (merchantId) => {
  let params = {
    limit: limit.value,
    page: current.value,
    merchantId: merchantId
  }
  queryMerchantProductList(params)
    .then(res => {
      console.log('res', res);
      self.list = res.records;
    })
}
const handleChangeStatus = () => {
  updateMerchantStatus({ merchantId: id.value, status: detail.value.status === 1 ? 0 : 1 })
    .then(res => {
      queryInfo();
    })
}

const handleCancel = () => {
  show.value = false;
}

const handleDetail = (row) => {
  // router.push({
  //   path: '/detail/' + row.id
  // });
}
</script>
<style scoped lang="scss">
/* 商户头部 */
.merchant-header {
  background: #fff;
  border-radius: 12px;
  padding: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.avatar {
  width: 64px;
  height: 64px;
  border-radius: 12px;
  background: linear-gradient(135deg, #409eff, #67c23a);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  font-weight: bold;
}

.name-row {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 8px;
}

.name-row h2 {
  margin: 0;
  font-size: 20px;
  color: #303133;
}

.meta {
  display: flex;
  gap: 24px;
  color: #909399;
  font-size: 14px;
}

/* 核心数据卡片 */
.stats-row {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  margin-bottom: 20px;
}

.stat-card {
  border-radius: 12px;
}

.stat-content {
  display: flex;
  align-items: center;
  gap: 16px;
}

.icon {
  font-size: 28px;
}

.value {
  font-size: 24px;
  font-weight: 600;
  color: #303133;
}

.label {
  font-size: 14px;
  color: #909399;
  margin-top: 4px;
}

/* 通用卡片 */
.section-card {
  border-radius: 12px;
  margin-bottom: 20px;
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

/* 经营档案信息 */
.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 16px;
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

/* 表格 */
.el-table {
  --el-table-border-color: #ebeef5;
}

.profile-avatar {
  width: 64px;
  height: 64px;
  background: linear-gradient(135deg, #3b82f6, #10b981);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 24px;
  font-weight: 800;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.2);
  flex-shrink: 0;
}
</style>