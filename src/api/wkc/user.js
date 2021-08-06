import request from '@/utils/request'

export function add(data) {
  return request({
    url: 'api/wkcUser',
    method: 'post',
    data
  })
}

export function del(ids) {
  return request({
    url: 'api/wkcUser/',
    method: 'delete',
    data: ids
  })
}

export function login(id) {
  return request({
    url: 'api/wkcUser/login?id=' + id,
    method: 'get'
  })
}

export function edit(data) {
  return request({
    url: 'api/wkcUser',
    method: 'put',
    data
  })
}

export function queryPeer(id) {
  return request({
    url: 'api/wkcUser/peer?id=' + id,
    method: 'get'
  })
}

export function queryUsb(id, peerId) {
  return request({
    url: 'api/wkcUser/usb?id=' + id + '&deviceId=' + peerId,
    method: 'get'
  })
}

export function setDefaultUsbDevice(id, deviceId, peerId, uuid, path) {
  return request({
    url: 'api/wkcUser/defaultDevice?id=' + id + '&deviceId=' + deviceId + '&peerId=' + peerId + '&uuid=' + uuid + '&path=' + path,
    method: 'get'
  })
}

export function queryTask(id, peerId, position, number) {
  return request({
    url: 'api/wkcUser/tasks?id=' + id + '&peerId=' + peerId + '&position=' + position + '&number=' + number,
    method: 'get'
  })
}

export function pauseTask(id, peerId, taskId) {
  return request({
    url: 'api/wkcUser/pauseTask?id=' + id + '&peerId=' + peerId + '&taskId=' + taskId,
    method: 'get'
  })
}

export function startTask(id, peerId, taskId) {
  return request({
    url: 'api/wkcUser/startTask?id=' + id + '&peerId=' + peerId + '&taskId=' + taskId,
    method: 'get'
  })
}

export function delTask(id, peerId, taskId, deleteFile, recycleTask) {
  return request({
    url: 'api/wkcUser/delTask?id=' + id + '&peerId=' + peerId + '&taskId=' + taskId + '&deleteFile=' + deleteFile + '&recycleTask=' + recycleTask,
    method: 'get'
  })
}

export function createTask(id, peerId, path, name, url) {
  return request({
    url: 'api/wkcUser/createTask?id=' + id + '&peerId=' + peerId + '&path=' + path + '&name=' + name + '&url=' + url,
    method: 'get'
  })
}

export function refreshUuid(id) {
  return request({
    url: 'api/wkcUser/refreshUuid?id=' + id,
    method: 'get'
  })
}

export default { add, edit, del, login, queryPeer, queryUsb, setDefaultUsbDevice, queryTask, pauseTask, startTask, delTask, createTask, refreshUuid }
