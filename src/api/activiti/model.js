import request from '@/utils/request'

export function add(data) {
  return request({
    url: 'api/activiti/model/create',
    method: 'post',
    data
  })
}

export function del(id) {
  return request({
    url: 'api/activiti/model/' + id + '/delete',
    method: 'delete'
  })
}

export function deploy(id) {
  return request({
    url: 'api/activiti/model/' + id + '/deployment',
    method: 'post'
  })
}

export default { add, del, deploy }
