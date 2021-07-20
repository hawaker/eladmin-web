import request from '@/utils/request'

export function start(id) {
  return request({
    url: 'api/activiti/instance/' + id + '/start',
    method: 'post'
  })
}

export function del(id) {
  return request({
    url: 'api/activiti/instance/' + id + '/delete',
    method: 'delete'
  })
}

export function suspend(id) {
  return request({
    url: 'api/activiti/instance/' + id + '/suspend',
    method: 'post'
  })
}

export function activate(id) {
  return request({
    url: 'api/activiti/instance/' + id + '/activate',
    method: 'post'
  })
}

export default { start }
