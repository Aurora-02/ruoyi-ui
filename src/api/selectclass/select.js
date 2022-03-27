import request from '@/utils/request'

// 查询选修课程列表
export function listSelect(query) {
  return request({
    url: '/selectclass/select/list',
    method: 'get',
    params: query
  })
}

// 查询选修课程详细
export function getSelect(cuId) {
  return request({
    url: '/selectclass/select/' + cuId,
    method: 'get'
  })
}

// 新增选修课程
export function addSelect(data) {
  return request({
    url: '/selectclass/select',
    method: 'post',
    data: data
  })
}

// 修改选修课程
export function updateSelect(data) {
  return request({
    url: '/selectclass/select',
    method: 'put',
    data: data
  })
}

// 删除选修课程
export function delSelect(cuId) {
  return request({
    url: '/selectclass/select/' + cuId,
    method: 'delete'
  })
}
