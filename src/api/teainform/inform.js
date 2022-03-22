import request from '@/utils/request'

// 查询老师信息列表
export function listInform(query) {
  return request({
    url: '/teainform/inform/list',
    method: 'get',
    params: query
  })
}

// 查询老师信息详细
export function getInform(teaId) {
  return request({
    url: '/teainform/inform/' + teaId,
    method: 'get'
  })
}

// 新增老师信息
export function addInform(data) {
  return request({
    url: '/teainform/inform',
    method: 'post',
    data: data
  })
}

// 修改老师信息
export function updateInform(data) {
  return request({
    url: '/teainform/inform',
    method: 'put',
    data: data
  })
}

// 删除老师信息
export function delInform(teaId) {
  return request({
    url: '/teainform/inform/' + teaId,
    method: 'delete'
  })
}
