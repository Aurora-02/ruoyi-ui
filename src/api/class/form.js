import request from '@/utils/request'

// 查询班级信息列表
export function listForm(query) {
  return request({
    url: '/class/form/list',
    method: 'get',
    params: query
  })
}

// 查询班级信息详细
export function getForm(claId) {
  return request({
    url: '/class/form/' + claId,
    method: 'get'
  })
}

// 新增班级信息
export function addForm(data) {
  return request({
    url: '/class/form',
    method: 'post',
    data: data
  })
}

// 修改班级信息
export function updateForm(data) {
  return request({
    url: '/class/form',
    method: 'put',
    data: data
  })
}

// 删除班级信息
export function delForm(claId) {
  return request({
    url: '/class/form/' + claId,
    method: 'delete'
  })
}
