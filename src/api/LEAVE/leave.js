import request from '@/utils/request'

// 查询请假列表
export function listLeave(query) {
  return request({
    url: '/LEAVE/leave/list',
    method: 'get',
    params: query
  })
}

// 查询请假详细
export function getLeave(stuId) {
  return request({
    url: '/LEAVE/leave/' + stuId,
    method: 'get'
  })
}

// 新增请假
export function addLeave(data) {
  return request({
    url: '/LEAVE/leave',
    method: 'post',
    data: data
  })
}

// 修改请假
export function updateLeave(data) {
  return request({
    url: '/LEAVE/leave',
    method: 'put',
    data: data
  })
}

// 删除请假
export function delLeave(stuId) {
  return request({
    url: '/LEAVE/leave/' + stuId,
    method: 'delete'
  })
}
