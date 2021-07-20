import request from '@/utils/request'

export function del(deploymentId) {
  return request({
    url: 'api/activiti/process/' + deploymentId + '/delete',
    method: 'delete'
  })
}

export function suspend(processDefinitionId) {
  return request({
    url: 'api/activiti/process/' + processDefinitionId + '/suspend',
    method: 'post'
  })
}

export function activate(processDefinitionId) {
  return request({
    url: 'api/activiti/process/' + processDefinitionId + '/activate',
    method: 'post'
  })
}

export default { del, suspend, activate }
