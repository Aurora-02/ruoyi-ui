import request from '@/utils/request'

// 查询学生信息列表
export function listInform(query) {
  return request({
    url: '/information/inform/list',
    method: 'get',
    params: query
  })
}

// 查询学生信息详细
export function getInform(stId) {
  return request({
    url: '/information/inform/' + stId,
    method: 'get'
  })
}

// 新增学生信息
export function addInform(data) {
  return request({
    url: '/information/inform',
    method: 'post',
    data: data
  })
}

// 修改学生信息
export function updateInform(data) {
  return request({
    url: '/information/inform',
    method: 'put',
    data: data
  })
}

// 删除学生信息
export function delInform(stId) {
  return request({
    url: '/information/inform/' + stId,
    method: 'delete'
  })
}
