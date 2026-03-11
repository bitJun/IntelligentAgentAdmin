import request from '@/utils/fetch';

export function queryMaterialList(query) {
  return request({
    url: '/platform/business-card/list',
    method: 'get',
    params: query
  })
}

export function queryMaterialDetail(data) {
  return request({
    url: '/platform/business-card/detail',
    method: 'post',
    data: data
  })
}

export function auditMaterial(data, id) {
  return request({
    url: `/platform/business-card/audit?id=${id}`,
    method: 'post',
    data: data
  })
}

