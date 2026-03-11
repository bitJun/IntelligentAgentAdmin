import request from '@/utils/fetch';

export function queryMerchantList(query) {
  return request({
    url: '/platform/merchant/list',
    method: 'get',
    params: query
  })
}

export function updateMerchantStatus(data) {
  return request({
    url: '/platform/merchant/updateStatus',
    method: 'post',
    data: data
  })
}

export function queryMerchantInfo(query) {
  return request({
    url: '/platform/merchant/getMerchantInfo',
    method: 'get',
    params: query
  })
}

export function queryMerchantProductList(query) {
  return request({
    url: '/platform/product/merchant/getMerchantProductList',
    method: 'get',
    params: query
  })
}

export function batchAddMerchant(data) {
  return request({
    url: '/platform/merchant/batchAdd',
    method: 'post',
    data: data
  })
}
