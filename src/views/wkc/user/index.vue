<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <div v-if="crud.props.searchToggle">
        <!-- 搜索 -->
        <label class="el-form-item-label">手机号</label>
        <el-input
          v-model="query.phone"
          clearable
          placeholder="手机号"
          style="width: 185px;"
          class="filter-item"
          @keyup.enter.native="crud.toQuery"
        />
        <rrOperation :crud="crud" />
      </div>
      <!--如果想在工具栏加入更多按钮，可以使用插槽方式， slot = 'left' or 'right'-->
      <crudOperation :permission="permission" />
      <!--表单组件-->
      <el-dialog
        :close-on-click-modal="false"
        :before-close="crud.cancelCU"
        :visible.sync="crud.status.cu > 0"
        :title="crud.status.title"
        width="500px"
      >
        <el-form ref="form" :model="form" :rules="rules" size="small" label-width="80px">
          <el-form-item label="手机号" prop="phone">
            <el-input v-model="form.phone" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input v-model="form.password" style="width: 370px;" />
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="text" @click="crud.cancelCU">取消</el-button>
          <el-button :loading="crud.status.cu === 2" type="primary" @click="crud.submitCU">确认
          </el-button>
        </div>
      </el-dialog>

      <el-row :gutter="15">
        <!--用户管理-->
        <el-col style="margin-bottom: 10px">
          <el-card class="box-card" shadow="never">
            <div slot="header" class="clearfix">
              <span class="role-span">玩客云账户</span>
            </div>
            <!--表格渲染-->
            <el-table
              ref="table"
              v-loading="crud.loading"
              highlight-current-row
              :data="crud.data"
              size="small"
              style="width: 100%;"
              @selection-change="crud.selectionChangeHandler"
              @current-change="handleCurrentUserChange"
            >
              <el-table-column type="selection" width="55" />
              <el-table-column prop="phone" label="手机号" />
              <el-table-column prop="token" label="token" />
              <el-table-column prop="defaultDeviceId" label="默认设备" />
              <el-table-column prop="defaultUsbUuid" label="USB ID" />
              <el-table-column prop="defaultUsbPath" label="USB路径" />
              <el-table-column prop="uuid" label="UUID" />
              <el-table-column
                v-if="checkPer(['admin','wkcUser:edit','wkcUser:del'])"
                label="操作"
                width="150px"
                align="center"
              >
                <template slot-scope="scope">
                  <el-button
                    v-permission="['admin','wkcUser:login']"
                    size="mini"
                    style="margin-right: 3px;"
                    type="text"
                    @click="login(scope.row.id)"
                  >
                    刷新token
                  </el-button>
                  <el-button
                    v-permission="['admin','wkcUser:login']"
                    size="mini"
                    style="margin-right: 3px;"
                    type="text"
                    @click="refreshUuid(scope.row.id)"
                  >
                    刷新UUID
                  </el-button>
                  <udOperation
                    :data="scope.row"
                    :permission="permission"
                  />
                </template>
              </el-table-column>
            </el-table>
            <!--分页组件-->
            <pagination />
          </el-card>
        </el-col>
      </el-row>
      <el-row :gutter="15">
        <!-- 节点列表 -->
        <el-col style="margin-bottom: 10px">
          <el-card class="box-card" shadow="never">
            <div slot="header" class="clearfix">
              <el-tooltip class="item" effect="dark" content="所选账户节点列表" placement="top">
                <span class="role-span">节点列表</span>
              </el-tooltip>
            </div>
            <el-table
              ref="table"
              v-loading="peersLoading"
              highlight-current-row
              :data="peers"
              size="small"
              style="width: 100%;"
              @current-change="handleCurrentPeerChange"
            >
              <el-table-column prop="peerId" label="ID" />
              <el-table-column prop="deviceName" label="名称" />
              <el-table-column prop="deviceSn" label="SN" />
              <el-table-column prop="deviceType" label="类型" />
              <el-table-column prop="ip" label="IP" />
              <el-table-column prop="lanIp" label="内网IP" />
            </el-table>
          </el-card>
        </el-col>
      </el-row>
      <el-row :gutter="15">
        <!-- 菜单授权 -->
        <el-col :xs="24" :sm="24" :md="8" :lg="8" :xl="7">
          <el-card class="box-card" shadow="never">
            <div slot="header" class="clearfix">
              <el-tooltip class="item" effect="dark" content="Usb设备列表" placement="top">
                <div class="crud-opts">
                  <span class="crud-opts-left">Usb设备列表<slot name="right" /></span>
                  <el-button-group class="crud-opts-right">
                    <el-button size="mini" icon="el-icon-refresh" @click="queryUsb()" />
                  </el-button-group>
                </div>
              </el-tooltip>
            </div>
            <el-table
              ref="table"
              v-loading="usbLoading"
              highlight-current-row
              :data="usbs"
              size="small"
              style="width: 100%;"
            >
              <el-table-column prop="capacityGb" label="可用" />
              <el-table-column prop="usedGb" label="已用" />
              <el-table-column prop="leftGb" label="剩余" />
              <el-table-column prop="percent" label="百分比" />
              <el-table-column prop="fsType" label="存储格式" />
              <el-table-column prop="path" label="路径" />
              <el-table-column prop="uuid" label="UUID" />
              <el-table-column
                label="操作"
                width="150px"
                align="center"
              >
                <template slot-scope="scope">
                  <el-button
                    size="mini"
                    style="margin-right: 3px;"
                    type="text"
                    @click="setDefaultUsb(scope.row)"
                  >
                    设为默认路径
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-card>
        </el-col>
        <el-col :xs="48" :sm="48" :md="16" :lg="16" :xl="14">
          <el-card class="box-card" shadow="never">
            <div slot="header" class="clearfix">
              <el-tooltip class="item" effect="dark" content="任务列表" placement="top">
                <div class="crud-opts">
                  <span class="crud-opts-left">任务列表<slot name="right" /></span>
                  <el-button-group class="crud-opts-right">
                    <el-button size="mini" icon="el-icon-refresh" @click="queryTask()" />
                  </el-button-group>
                </div>
              </el-tooltip>
            </div>
            <el-table
              ref="table"
              v-loading="taskLoading"
              highlight-current-row
              :data="taskData.tasks"
              size="small"
              style="width: 100%;"
            >
              <el-table-column prop="name" label="名称" />
              <el-table-column prop="sizeGb" label="大小" />
              <el-table-column prop="createTime" label="创建日期" />
              <el-table-column prop="completeTime" label="完成日期" />
              <el-table-column
                label="操作"
                width="150px"
                align="center"
              >
                <template slot-scope="scope">
                  <el-button
                    v-if="scope.row.state==stateRef.pending||scope.row.state==stateRef.waiting"
                    size="mini"
                    style="margin-right: 3px;"
                    type="text"
                    @click="pauseTask(scope.row)"
                  >
                    暂停
                  </el-button>
                  <el-button
                    v-if="scope.row.state==stateRef.pause||scope.row.state==stateRef.waiting||scope.row.state==stateRef.error"
                    size="mini"
                    style="margin-right: 3px;"
                    type="text"
                    @click="startTask(scope.row)"
                  >
                    开始
                  </el-button>
                  <el-button
                    v-if="scope.row.state==stateRef.pending||scope.row.state==stateRef.pause||scope.row.state==stateRef.done||scope.row.state==stateRef.waiting||scope.row.state==stateRef.error"
                    size="mini"
                    style="margin-right: 3px;"
                    type="text"
                    @click="deleteTask(scope.row)"
                  >
                    删除
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
            <el-pagination
              :current-page="taskCurrentPage"
              :page-sizes="[20, 40, 60]"
              :page-size="defaultTaskPageSize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="taskData.dlNum + taskData.completeNum"
              @size-change="handleTaskSizeChange"
              @current-change="handleTaskCurrentChange"
            />
          </el-card>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import crudWkcUser from '@/api/wkc/user'
import CRUD, { crud, form, header, presenter } from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import udOperation from '@crud/UD.operation'
import pagination from '@crud/Pagination'

const defaultForm = {
  id: null,
  phone: null,
  userId: null,
  password: null,
  token: null,
  accountType: null,
  enableHomeShare: null,
  bindPwd: null,
  phoneArea: null,
  bindUser: null
}
export default {
  name: 'WkcUser',
  components: { pagination, crudOperation, rrOperation, udOperation },
  mixins: [presenter(), header(), form(defaultForm), crud()],

  cruds() {
    return CRUD({
      title: '玩客云用户',
      url: 'api/wkcUser',
      idField: 'id',
      sort: 'id,desc',
      crudMethod: { ...crudWkcUser }
    })
  },
  data() {
    return {
      usbs: [],
      peerIds: [],
      peers: [],
      taskLoading: false,
      currentPeerId: null,
      taskData: { dlNum: 0, completeNum: 0 },
      stateRef: { pending: 0, waiting: 8, done: 11, pause: 9, error: 12 },
      peersLoading: false,
      usbLoading: false,
      defaultTaskPageSize: 20,
      taskCurrentPage: 1,
      permission: {
        add: ['admin', 'wkcUser:add'],
        edit: ['admin', 'wkcUser:edit'],
        del: ['admin', 'wkcUser:del']
      },
      rules: {
        phone: [
          { required: true, message: '手机号不能为空', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '密码不能为空', trigger: 'blur' }
        ]
      },
      currentId: 0,
      currentDeviceId: null,
      queryTypeOptions: [
        { key: 'phone', display_name: '手机号' }
      ]
    }
  },
  methods: {
    // 执行
    login(id) {
      console.log(id)
      crudWkcUser.login(id).then(res => {
        console.info(res)
        this.crud.notify('执行成功', CRUD.NOTIFICATION_TYPE.SUCCESS)
      }).catch(err => {
        console.log(err.response.data.message)
      })
    },
    refreshUuid(id) {
      console.log(id)
      crudWkcUser.refreshUuid(id).then(res => {
        console.info(res)
        this.crud.notify('执行成功', CRUD.NOTIFICATION_TYPE.SUCCESS)
      }).catch(err => {
        console.log(err.response.data.message)
      })
    },
    // 触发选中用户变化
    handleCurrentUserChange(val) {
      console.info(val)
      if (!val) {
        return
      }
      // 保存当前的角色id
      this.currentId = val.id
      this.queryPeer()
    },
    // 获取选中用户的设备
    queryPeer() {
      if (this.currentId === 0) {
        return
      }
      this.peersLoading = true
      console.log(this.currentId)
      crudWkcUser.queryPeer(this.currentId).then(res => {
        console.info(res)
        this.peers = res
        this.peersLoading = false
      }).catch(err => {
        console.log(err.response.data.message)
        this.peersLoading = false
      })
    },
    handleTaskSizeChange(size) {
      this.defaultTaskPageSize = size
      this.queryTask()
    },
    handleTaskCurrentChange(page) {
      this.taskCurrentPage = page
      this.queryTask()
    },
    //  获取当前用户任务列表
    queryTask() {
      if (this.currentId === 0) {
        return
      }
      if (this.currentDeviceId === null) {
        return
      }
      this.taskLoading = true
      const position = (this.taskCurrentPage - 1) * this.defaultTaskPageSize
      crudWkcUser.queryTask(this.currentId, this.currentPeerId, position, this.defaultTaskPageSize).then(res => {
        console.info(res)
        this.taskData = res
        if (res.tasks != null) {
          for (let i = 0; i < res.tasks.length; i++) {
            const task = res.tasks[i]
            task.sizeGb = (task.size / 1024 / 1024 / 1024).toFixed(2) + 'GB'
          }
        }
        this.taskLoading = false
      }).catch(err => {
        console.log(err.response.data.message)
        this.taskLoading = false
      })
    },
    // 当前选中节点变化
    handleCurrentPeerChange(val) {
      console.info(val)
      if (!val) {
        return
      }
      // 保存当前的角色id
      this.currentDeviceId = val.deviceId
      this.currentPeerId = val.peerId
      this.queryUsb()
      this.queryTask(1)
    },
    // 暂停任务
    pauseTask(row) {
      console.info(row)
      if (!row) {
        return
      }
      this.taskLoading = true
      crudWkcUser.pauseTask(this.currentId, this.currentPeerId, row.id).then(res => {
        console.info(res)
        this.queryTask()
      }).catch(err => {
        console.log(err.response.data.message)
        this.taskLoading = false
      })
    },
    // 开始任务
    startTask(row) {
      console.info(row)
      if (!row) {
        return
      }
      this.taskLoading = true
      crudWkcUser.startTask(this.currentId, this.currentPeerId, row.id).then(res => {
        console.info(res)
        this.queryTask()
      }).catch(err => {
        console.log(err.response.data.message)
        this.taskLoading = false
      })
    },
    // 暂停任务
    deleteTask(row) {
      console.info(row)
      if (!row) {
        return
      }
      this.taskLoading = true
      crudWkcUser.pauseTask(this.currentId, this.currentPeerId, row.id).then(res => {
        console.info(res)
        this.queryTask()
      }).catch(err => {
        console.log(err.response.data.message)
        this.taskLoading = false
      })
    },
    // 获取设备下的USB
    queryUsb() {
      if (this.currentId === 0) {
        return
      }
      if (this.currentDeviceId === null) {
        return
      }
      this.usbLoading = true
      crudWkcUser.queryUsb(this.currentId, this.currentDeviceId).then(res => {
        console.info(res)
        for (let i = 0; i < res.length; i++) {
          const usb = res[i]
          usb.capacityGb = (usb.capacity / 1024 / 1024 / 1024).toFixed(2) + 'GB'
          usb.usedGb = (usb.used / 1024 / 1024 / 1024).toFixed(2) + 'GB'
          usb.leftGb = ((usb.capacity - usb.used) / 1024 / 1024 / 1024).toFixed(2) + 'GB'
          usb.percent = ((usb.used / usb.capacity) * 100).toFixed(2) + '%'
        }
        this.usbs = res
        this.usbLoading = false
      }).catch(err => {
        console.log(err.response.data.message)
        this.usbLoading = false
      })
    },
    setDefaultUsb(row) {
      this.usbLoading = true
      crudWkcUser.setDefaultUsbDevice(this.currentId, this.currentDeviceId, this.currentPeerId, row.uuid, row.path)
        .then(res => {
          this.usbLoading = false
        })
        .catch(err => {
          console.log(err.response.data.message)
          this.usbLoading = false
        })
    },
    // 是否可以选中
    checkboxT(row) {
      return true
    },
    // 钩子：在获取表格数据之前执行，false 则代表不获取数据
    [CRUD.HOOK.beforeRefresh]() {
      return true
    }

  }
}
</script>

<style scoped>

</style>
