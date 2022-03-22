import request from '@/utils/request'

// 查询学生信息列表
export function listInf(query) {
  return request({
    url: '/student/inf/list',
    method: 'get',
    params: query
  })
}

// 查询学生信息详细
export function getInf(stId) {
  return request({
    url: '/student/inf/' + stId,
    method: 'get'
  })
}

// 新增学生信息
export function addInf(data) {
  return request({
    url: '/student/inf',
    method: 'post',
    data: data
  })
}

// 修改学生信息
export function updateInf(data) {
  return request({
    url: '/student/inf',
    method: 'put',
    data: data
  })
}

// 删除学生信息
export function delInf(stId) {
  return request({
    url: '/student/inf/' + stId,
    method: 'delete'
  })
}
