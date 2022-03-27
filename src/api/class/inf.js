import request from '@/utils/request'

// 查询班级信息列表
export function listInf(query) {
  return request({
    url: '/class/inf/list',
    method: 'get',
    params: query
  })
}

// 查询班级信息详细
export function getInf(claId) {
  return request({
    url: '/class/inf/' + claId,
    method: 'get'
  })
}

// 新增班级信息
export function addInf(data) {
  return request({
    url: '/class/inf',
    method: 'post',
    data: data
  })
}

// 修改班级信息
export function updateInf(data) {
  return request({
    url: '/class/inf',
    method: 'put',
    data: data
  })
}

// 删除班级信息
export function delInf(claId) {
  return request({
    url: '/class/inf/' + claId,
    method: 'delete'
  })
}
