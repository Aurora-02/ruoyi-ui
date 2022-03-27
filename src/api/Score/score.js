import request from '@/utils/request'

// 查询成绩查询列表
export function listScore(query) {
  return request({
    url: '/Score/score/list',
    method: 'get',
    params: query
  })
}

// 查询成绩查询详细
export function getScore(stId) {
  return request({
    url: '/Score/score/' + stId,
    method: 'get'
  })
}

// 新增成绩查询
export function addScore(data) {
  return request({
    url: '/Score/score',
    method: 'post',
    data: data
  })
}

// 修改成绩查询
export function updateScore(data) {
  return request({
    url: '/Score/score',
    method: 'put',
    data: data
  })
}

// 删除成绩查询
export function delScore(stId) {
  return request({
    url: '/Score/score/' + stId,
    method: 'delete'
  })
}
