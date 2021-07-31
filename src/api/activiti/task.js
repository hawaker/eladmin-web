import request from '@/utils/request'

export function del(deploymentId) {
  return request({
    url: 'api/activiti/process/' + deploymentId + '/delete',
    method: 'delete'
  })
}

export function complete(taskId, param) {
  return request({
    url: 'api/activiti/task/' + taskId + '/complete',
    method: 'post',
    params: param,
    transformRequest: [function() {
      return JSON.stringify(param)
    }],
    headers: {
      'Content-Type': 'application/json;'
    }
  })
}

export default { del, complete }
