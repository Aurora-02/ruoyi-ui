import request from '@/utils/request'

// 查询老师信息列表
export function listInf(query) {
  return request({
    url: '/teacher/inf/list',
    method: 'get',
    params: query
  })
}

// 查询老师信息详细
export function getInf(teaId) {
  return request({
    url: '/teacher/inf/' + teaId,
    method: 'get'
  })
}

// 新增老师信息
export function addInf(data) {
  return request({
    url: '/teacher/inf',
    method: 'post',
    data: data
  })
}

// 修改老师信息
export function updateInf(data) {
  return request({
    url: '/teacher/inf',
    method: 'put',
    data: data
  })
}

// 删除老师信息
export function delInf(teaId) {
  return request({
    url: '/teacher/inf/' + teaId,
    method: 'delete'
  })
}
