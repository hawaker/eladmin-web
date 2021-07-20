<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <div v-if="crud.props.searchToggle">
        <!-- 搜索 -->
        <label class="el-form-item-label">名称</label>
        <el-input
          v-model="query.phone"
          clearable
          placeholder="流程名称"
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
          <el-form-item label="名称" prop="name">
            <el-input v-model="form.name" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="key" prop="key">
            <el-input v-model="form.key" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="描述" prop="description">
            <el-input v-model="form.description" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="版本" prop="version">
            <el-input v-model="form.version" style="width: 370px;" />
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
              <span class="role-span">所有流程</span>
            </div>
            <!--表格渲染-->
            <el-table ref="table" v-loading="crud.loading" :data="crud.data" size="small" style="width: 100%;">
              <el-table-column prop="deploymentId" label="deploymentId" />
              <el-table-column prop="name" label="名称" />
              <el-table-column prop="key" label="key" />
              <el-table-column prop="version" label="版本" />
              <el-table-column prop="persistentState.suspensionState" :formatter="suspendFormatter" label="状态" />
              <el-table-column v-if="checkPer(['admin'])" label="操作" width="150px" align="center">
                <template slot-scope="scope">
                  <udOperation :data="scope.row" :disabled-edit="true" :permission="permission" />
                  <el-button v-if="scope.row.persistentState.suspensionState==1" v-permission="['admin']" size="mini" style="margin-right: 3px;" type="text" @click="suspend(scope.row.id)">
                    暂停
                  </el-button>
                  <el-button v-if="scope.row.persistentState.suspensionState==2" v-permission="['admin']" size="mini" style="margin-right: 3px;" type="text" @click="activate(scope.row.id)">
                    激活
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
            <!--分页组件-->
            <pagination />
          </el-card>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import crudActivitiProcess from '@/api/activiti/process'
import CRUD, { crud, form, header, presenter } from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import udOperation from '@crud/UD.operation'
import pagination from '@crud/Pagination'

const defaultForm = {
  name: null,
  key: null,
  description: null,
  version: null
}
export default {
  name: 'Model',
  components: { pagination, crudOperation, rrOperation, udOperation },
  mixins: [presenter(), header(), form(defaultForm), crud()],

  cruds() {
    return CRUD({
      title: '所有流程',
      url: 'api/activiti/process',
      idField: 'deploymentId',
      sort: 'deploymentId,desc',
      crudMethod: { ...crudActivitiProcess }
    })
  },
  data() {
    return {
      permission: {
        add: ['admin'],
        edit: ['admin'],
        del: ['admin']
      },
      rules: {}
    }
  },
  methods: {
    deploy(id) {
      this.crud.loading = true
      crudActivitiProcess.deploy(id).then(res => {
        console.info(res)
        this.crud.loading = false
        this.crud.notify('发布成功', CRUD.NOTIFICATION_TYPE.SUCCESS)
      }).catch(err => {
        this.crud.loading = false
        console.log(err.response)
      })
    },
    suspend(id) {
      this.crud.loading = true
      crudActivitiProcess.suspend(id).then(res => {
        console.info(res)
        this.crud.loading = false
        this.crud.notify('暂停成功', CRUD.NOTIFICATION_TYPE.SUCCESS)
        this.crud.refresh()
      }).catch(err => {
        this.crud.loading = false
        console.log(err.response)
      })
    },
    suspendFormatter(a, b, c) {
      if (c === 2) {
        return '暂停'
      }
      return '激活'
    },
    activate(id) {
      this.crud.loading = true
      crudActivitiProcess.activate(id).then(res => {
        console.info(res)
        this.crud.loading = false
        this.crud.notify('激活成功', CRUD.NOTIFICATION_TYPE.SUCCESS)
        this.crud.refresh()
      }).catch(err => {
        this.crud.loading = false
        console.log(err.response)
      })
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
