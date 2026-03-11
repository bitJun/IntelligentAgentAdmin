import request from '@/utils/fetch'

export function queryOrderList(query) {
  return request({
    url: '/platform/order/list',
    method: 'get',
    params: query
  })
}

export function queryOrderDetail(query) {
  return request({
    url: '/platform/order/detail',
    method: 'get',
    params: query
  })
}

export function queryRefundOrderList(query) {
  return request({
    url: '/platform/order/getRefundOrderList',
    method: 'get',
    params: query
  })
}

export function queryRefundOrderDetail(query) {
  return request({
    url: '/platform/order/getRefundOrderDetail',
    method: 'get',
    params: query
  })
}

export function refundOrder(data, id) {
  return request({
    url: `/platform/order/refund?id=${id}`,
    method: 'post',
    data
  })
}