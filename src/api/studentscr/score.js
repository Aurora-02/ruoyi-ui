import request from '@/utils/request'

// 查询学生成绩列表
export function listScore(query) {
  return request({
    url: '/studentscr/score/list',
    method: 'get',
    params: query
  })
}

// 查询学生成绩详细
export function getScore(stId) {
  return request({
    url: '/studentscr/score/' + stId,
    method: 'get'
  })
}

// 新增学生成绩
export function addScore(data) {
  return request({
    url: '/studentscr/score',
    method: 'post',
    data: data
  })
}

// 修改学生成绩
export function updateScore(data) {
  return request({
    url: '/studentscr/score',
    method: 'put',
    data: data
  })
}

// 删除学生成绩
export function delScore(stId) {
  return request({
    url: '/studentscr/score/' + stId,
    method: 'delete'
  })
}
