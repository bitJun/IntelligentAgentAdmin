import request from '@/utils/fetch';

export function queryProductAuditList(query) {
  return request({
    url: '/platform/product/audit/list',
    method: 'get',
    params: query
  })
}

export function queryProductAuditDetail(query) {
  return request({
    url: '/platform/product/audit/detail',
    method: 'get',
    params: query
  })
}

export function postProductAudit(data, id) {
  return request({
    url: `/platform/product/audit?id=${id}`,
    method: 'post',
    data: data,
  })
}

