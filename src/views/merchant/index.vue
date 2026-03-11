<template>
  <div class="filter-panel">
    <div class="filter-form">
      <div class="filter-item">
        <label>商户查询</label>
        <el-input v-model="keyword" type="text" placeholder="商户名/手机号/ID..." />
      </div>
      <div class="filter-item">
        <label>运营状态</label>
        <el-select style="width: 180px;" v-model="status" placeholder="请选择状态" clearable>
          <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </div>
      <button class="btn btn-primary" @click="handleSearch">✧ 开始查询</button>
    </div>
    <div class="filter-item" style="margin-left: auto;">
      <button class="btn btn-secondary" @click="handleAddMerchant">✧ 新增商户</button>
    </div>
  </div>
  <div class="card">
    <el-table
      :data="list"
      class="audit-table"
      row-key="id"
      :header-cell-style="headerCellStyle"
    >
      <el-table-column prop="merchantId" label="商户ID" width="100">
        <template #default="scope">
          <el-link type="primary">{{ scope.row.merchantId }}</el-link>
        </template>
      </el-table-column>
      <el-table-column prop="name" label="主理人">
        <template #default="scope">
          <span style="font-weight: 700;">{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="name" label="店铺/品牌名称">
      </el-table-column>
      <el-table-column prop="type" label="类型">
        <template #default="scope">
          <el-tag type="default" v-if="scope.row.type === 0">终端用户</el-tag>
          <el-tag type="default" v-if="scope.row.type === 1">经销商</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="phone" label="联系电话">
        <template #default="scope">
          {{ desensitizePhoneNumber(scope.row.phone) }}
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="入驻时间">
      </el-table-column>
      <el-table-column prop="status" label="状态">
        <template #default="scope">
          <el-tag type="success" v-if="scope.row.status === 0">正常</el-tag>
          <el-tag type="danger" v-if="scope.row.status === 1">冻结</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="address" label="操作" width="200">
        <template #default="scope">
          <button class="btn btn-secondary btn-sm"
            style="padding: 0 12px; height: 30px; display: inline-flex; align-items: center; gap: 4px; border-radius: 8px; margin-right: 10px;"
            @click="handleDetail(scope.row)">
            <span style="font-size: 14px; margin-top: -2px;">📄</span>
            管理详情
          </button>
          <button class="btn btn-success-soft btn-sm" @click="handleChangeStatus(scope.row)"
            v-if="scope.row.status == 1">
            解冻
          </button>
          <button class="btn btn-danger-soft btn-sm" @click="handleConfirmChangeStatus(scope.row)" v-else>
            冻结
          </button>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination-container" v-if="total > 0">
      <el-pagination v-model:current-page="params.pageNum" v-model:page-size="params.pageSize"
        :page-sizes="[10, 20, 50]" size="default" :background="false" layout="total, sizes, prev, pager, next, jumper"
        :total="total" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
    </div>
    <el-dialog
      v-model="showAddMerchant"
      title="Warning"
      width="500"
      align-center
    >
      <span>Open the dialog from the center from the screen</span>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="centerDialogVisible = false">Cancel</el-button>
          <el-button type="primary" @click="centerDialogVisible = false">
            Confirm
          </el-button>
        </div>
      </template>
    </el-dialog>
    <el-dialog
      v-model="show"
      title="操作确认"
      width="480"
      align-center
    >
      <div class="risk-panel" style="margin-bottom: 0;">
        <div class="risk-title">⚠️ 风险操作提示</div>
        <div class="risk-desc">
          确定要冻结吗？冻结后，该商户所有展示中的商品将同步下架。
        </div>
      </div>
      <template #footer>
        <div class="dialog-footer">
          <button class="btn btn-secondary btn-sm"
            style="margin-right: 12px;"
            @click="handleCancel"
          >
            取消
          </button>
          <button class="btn btn-danger-soft btn-sm" @click="handleChangeStatus(scope.row)">
            确定冻结
          </button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>
<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import {
  queryMerchantList,
  updateMerchantStatus,
  batchAddMerchant
} from '@/service/merchant';
const router = useRouter();
const params = ref({
  pageNum: 1,
  pageSize: 10,
});
const status = ref(null);
const keyword = ref('');
const total = ref(0);
const list = ref([]);
const show = ref(false);
const showAddMerchant = ref(false);
const rowItem = ref({});

const options = ref(
  [
    {
      value: '',
      label: '全部状态'
    },
    {
      value: '0',
      label: '正常运营'
    }, {
      value: '1',
      label: '已冻结'
    }
  ]
)

const headerCellStyle = {
  background: '#f3f6fb',
  color: '#91a0b9',
  fontWeight: 600,
  height: '50px',
}

onMounted(() => {
  document.title = '商户管理 | 平台管理后台';
  onLoadData();
});

const onLoadData = () => {
  let data = params.value;
  data.status = status.value;
  data.keyword = keyword.value;
  queryMerchantList(data)
    .then(res => {
      list.value = res.records;
      total.value = res.total;
    })
}

const handleDetail = (row) => {
  let url = '/merchant/' + row.merchantId;
  router.push({
    path: url,
    query: {
      name: row.name || ''
    }
  });
}

const handleChangeStatus = (row) => {
  updateMerchantStatus({ merchantId: row.merchantId, status: row.status === 1 ? 0 : 1 })
    .then(res => {
      show.value = false;
      onLoadData();
    })
}

const handleConfirmChangeStatus = (row) => {
  rowItem.value = row;
  show.value = true;
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

const handleSearch = () => {
  params.value.pageNum = 1;
  onLoadData();
}

const handleAddMerchant = () => {
  batchAddMerchant({
    type: 0,
    phoneNumbers: '13111111111,13311111111'
  })
    .then(res => {
      console.log('res', res);
      onLoadData();
    })
}

const desensitizePhoneNumber = (phoneNumber) => {
  if (typeof phoneNumber !== 'string') {
    phoneNumber = String(phoneNumber);
  }
  
  // 验证是否为11位手机号格式
  if (!/^\d{11}$/.test(phoneNumber)) {
    return phoneNumber; // 如果不是标准手机号，返回原值
  }
  
  // 保留前3位和后4位，中间4位用*替换
  return phoneNumber.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2');
}

const handleCancel = () => {
  show.value = false;
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
.risk-panel {
    padding: 16px;
    border-radius: 14px;
    border: 1px solid #fee2e2;
    background: rgba(239, 68, 68, 0.06);
    margin-bottom: 16px;
}
.risk-title {
    font-weight: 800;
    color: var(--error-text);
    margin-bottom: 6px;
    display: flex;
    align-items: center;
    gap: 6px;
}
.risk-desc {
    color: var(--text-secondary);
    font-size: 13px;
    line-height: 1.5;
}
</style>
