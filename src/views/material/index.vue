<template>
  <div class="tabs">
    <div class="tab-list">
      <div class="tab-item" :class="{ active: params.processed === 0 }" @click="handleTabChange(0)">待审核资料</div>
      <div class="tab-item" :class="{ active: params.processed === 1 }" @click="handleTabChange(1)">已审核资料</div>
    </div>
  </div>
  <div class="card">
    <div class="card-header">
      <h3 class="card-title">{{ params.processed === 0 ? '待审核资料队列' : '已审核资料队列' }}</h3>
    </div>
    <el-table :data="list" class="audit-table" row-key="id" :header-cell-style="headerCellStyle">
      <el-table-column prop="submitTime" label="提交时间"></el-table-column>
      <el-table-column prop="name" label="商户名称">
      </el-table-column>
      <el-table-column prop="modifyType" label="修改类型">
        <template #default="scope">
          <el-tag type="success" v-if="scope.row.modifyType === 0">名称</el-tag>
          <el-tag type="danger" v-if="scope.row.modifyType === 1">头像</el-tag>
        </template>
      </el-table-column>
      <!-- <el-table-column
      prop="phone"
      label="内容预览"
      >
      <template #default="scope">
          <el-button type="text" @click="handleDetail(scope.row)">
          复核
          </el-button>
      </template>
      </el-table-column> -->
      <el-table-column prop="aiResult" label="AI预审">
        <template #default="scope">
          <el-tag type="success" v-if="scope.row.aiResult === 0">低风险</el-tag>
          <el-tag type="danger" v-if="scope.row.aiResult === 1">疑似</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="status" label="状态">
        <template #default="scope">
          <el-tag type="warning" v-if="scope.row.status === 0">待人工审核</el-tag>
          <el-tag type="success" v-if="scope.row.status === 1">系统已通过</el-tag>
          <el-tag type="danger" v-if="scope.row.status === 2">人工驳回</el-tag>
          <el-tag type="success" v-if="scope.row.status === 4">人工已通过</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="address" label="操作">
        <template #default="scope">
          <el-button type="text" @click="handleDetail(scope.row)">
            详情
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination-container" v-if="total > 0">
      <el-pagination v-model:current-page="params.pageNum" v-model:page-size="params.pageSize"
        :page-sizes="[10, 20, 50]" size="default" :background="false" layout="total, sizes, prev, pager, next, jumper"
        :total="total" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
    </div>
    <el-dialog title="商品上架复核" custom-class="modal-box" width="600px" v-model="drawer">
      <div class="ai-result aiPass">
        <div class="ai-left">
          <i class="el-icon-success"></i>
          <span class="ai-title">AI 智能质检</span>
          <span class="ai-status">合规通过</span>
        </div>
        <div class="ai-suggestion">AI 建议：快速放行</div>
      </div>

      <!-- 信息卡片区 -->
      <div class="info-row">
        <div class="info-card" shadow="never">
          <div class="card-label">提审商户</div>
          <div class="card-value" style="font-weight: 700;">{{ detail.merchantName }}</div>
        </div>
        <div class="info-card" shadow="never">
          <div class="card-label">售卖价格</div>
          <div class="card-value price">¥{{ detail.price }}</div>
        </div>
      </div>

      <!-- 商品信息区 -->
      <div class="product-info">
        <div class="info-item">
          <div class="info-label">商品名称</div>
          <div class="info-value" style="font-size: 18px; font-weight: bold;">{{ detail.name }}</div>
        </div>
        <div class="info-item">
          <div class="info-label">详细描述</div>
          <div class="info-value">{{ detail.description }}</div>
        </div>
        <div class="info-item">
          <div class="info-label">主图预览</div>
          <div class="preview-box">
            <img :src="detail.imgUrl" class="img" />
          </div>
        </div>
      </div>

      <!-- 审核意见 -->
      <div class="opinion-item">
        <div class="info-label">审核意见批注</div>
        <el-input type="textarea" :rows="3" placeholder="请输入审核意见" v-model="auditRemarks" />
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button class="cancelBtn" @click="handleClose">取消</el-button>
        <div>
          <el-button type="danger" class="dangerBtn" @click="handleAudit(2)">驳回上架</el-button>
          <el-button type="primary" class="submitBtn" @click="handleAudit(1)">确认通过</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script setup>
import { ref, onMounted } from 'vue';
import {
  queryMaterialList,
  queryMaterialDetail,
  auditMaterial
} from '@/service/material';
const params = ref({
  pageNum: 1,
  pageSize: 10,
  processed: 0
});
const auditStatus = ref('');
const total = ref(0);
const list = ref([]);
const drawer = ref(false);
const detail = ref({});
const auditRemarks = ref('');
const isSubmit = ref(false);

const headerCellStyle = {
  background: '#f3f6fb',
  color: '#91a0b9',
  fontWeight: 600,
  height: '50px',
}

onMounted(() => {
  document.title = '名片审核 | 平台管理后台';
  onLoadData();
});

const onLoadData = () => {
  let data = params.value;
  if (auditStatus.value) {
    data.auditStatus = auditStatus.value
  }
  queryMaterialList(data)
    .then(res => {
      list.value = res.records;
      total.value = res.total;
    })
}

const handleSizeChange = (val) => {
  console.log('val', val);
  params.value.pageSize = val;
  onLoadData();
}
const handleCurrentChange = (val) => {
  console.log('val', val);
  params.value.pageNum = val;
  onLoadData();
}

const handleClose = () => {
  detail.value = res;
  limit.value = 10;
  current.value = 10;
  list.value = [];
  drawer.value = false;
}

const handleDetail = (row) => {
  queryMaterialDetail({ id: row.id })
    .then(res => {
      detail.valie = res;
      drawer.valie = true;
    })
}

const handleAudit = (key) => {
  let flag = true;
  let params = {
    auditStatus: key,
  }
  if (key == 2) {
    params.moderationResult = self.auditRemarks;
    if (!params.moderationResult) {
      flag = false;
    }
  }
  if (!flag) {
    return;
  }
  isSubmit.value = true;
  auditMaterial(params, self.detail.id)
    .then(res => {
      handleClose();
      onLoadData();
      isSubmit.value = false;
    })
    .catch(err => {
      isSubmit.value = false;
    })
}

const handleTabChange = (key) => {
  params.value.processed = key;
  onLoadData();
}
</script>

<style scoped lang="scss">
.review-page {
  width: 100%;
  border-radius: 12px;
  overflow: hidden;
  background: #fff;
}

.audit-table {
  width: 100%;
}

:deep(.el-table td),
:deep(.el-table th.el-table__cell) {
  border-bottom: 1px solid #edf1f7;
}

:deep(.el-table .cell) {
  color: #2b364d;
  font-size: 16px;
}

:deep(.el-table .el-table__row td) {
  height: 62px;
}

.type-tag {
  border: 0;
  border-radius: 8px;
  background: #eef2f8;
  color: #6d7f9a;
}

.risk-low {
  border: 0;
  border-radius: 8px;
  background: #daf4e6;
  color: #21a36b;
}

.risk-high {
  border: 0;
  border-radius: 8px;
  background: #ffe3e2;
  color: #e84d55;
}

.review-btn {
  border: 0;
  background: #eef2f6;
  color: #2d3a52;
  font-weight: 600;
}

.ai-result {
  margin: 20px;
  padding: 16px 20px;
  border-radius: 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.ai-result.aiPass {
  background-color: #f0f9eb;
  color: #67c23a;
}

.ai-left {
  display: flex;
  align-items: center;
  gap: 8px;
}

.ai-title {
  font-weight: 500;
}

.ai-status {
  font-weight: 600;
}

.ai-suggestion {
  color: #606266;
}

.info-row {
  display: flex;
  gap: 20px;
  padding: 0 20px;
  margin-bottom: 24px;
}

.info-card {
  flex: 1;
  background: #f1f5f9;
  border: 1px solid #eef2f6;
  border-radius: 12px;
  padding: 16px;
  transition: all 0.2s ease;
}

.card-label {
  font-size: 11px;
  font-weight: 800;
  color: #94a3b8;
  text-transform: uppercase;
  margin-bottom: 8px;
}

.card-value {
  font-size: 16px;
  color: #1e293b;
}

.card-value.price {
  color: #2563eb;
  font-weight: 800;
}

.product-info {
  padding: 0 20px;
}

.info-item {
  margin-bottom: 16px;
}

.info-label {
  font-size: 14px;
  color: #606266;
  margin-bottom: 8px;
}

.info-value {
  font-size: 16px;
  color: #303133;
  line-height: 1.6;
}

.preview-box {
  width: 100%;
  height: 200px;
  border: 2px dashed #dcdfe6;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #c0c4cc;
  background-color: #f5f7fa;
}

.opinion-item {
  padding: 0 20px;
  margin: 24px 0;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 16px 20px;
  border-top: 1px solid #ebeef5;
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

.dialog-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.img {
  height: 200px;
  width: auto;
}

:deep(.el-dialog) {
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.15);
  border-radius: 24px;
}
</style>
