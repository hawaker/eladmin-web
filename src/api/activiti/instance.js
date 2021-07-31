import request from '@/utils/request'

export function add(data) {
  console.info(data)
  return request({
    url: 'api/activiti/instance/start?processDefinitionId=' + data.id,
    method: 'post'
  })
}

export function del(id) {
  return request({
    url: 'api/activiti/instance/delete?processInstanceId=' + id,
    method: 'delete'
  })
}

export function suspend(id) {
  return request({
    url: 'api/activiti/instance/suspend?processInstanceId=' + id,
    method: 'post'
  })
}

export function activate(id) {
  return request({
    url: 'api/activiti/instance/activate?processInstanceId=' + id,
    method: 'post'
  })
}

export function enableProcess() {
  return request({
    url: 'api/activiti/process?activited=true',
    method: 'get'
  })
}

export default { add, del, suspend, activate, enableProcess }
