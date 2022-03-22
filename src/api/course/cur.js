import request from '@/utils/request'

// 查询课程信息列表
export function listCur(query) {
  return request({
    url: '/course/cur/list',
    method: 'get',
    params: query
  })
}

// 查询课程信息详细
export function getCur(cuId) {
  return request({
    url: '/course/cur/' + cuId,
    method: 'get'
  })
}

// 新增课程信息
export function addCur(data) {
  return request({
    url: '/course/cur',
    method: 'post',
    data: data
  })
}

// 修改课程信息
export function updateCur(data) {
  return request({
    url: '/course/cur',
    method: 'put',
    data: data
  })
}

// 删除课程信息
export function delCur(cuId) {
  return request({
    url: '/course/cur/' + cuId,
    method: 'delete'
  })
}
