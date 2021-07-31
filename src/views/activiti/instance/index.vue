<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <!--如果想在工具栏加入更多按钮，可以使用插槽方式， slot = 'left' or 'right'-->
      <crudOperation :permission="permission" />
      <!--表单组件-->
      <el-dialog :close-on-click-modal="false" :before-close="crud.cancelCU" :visible.sync="crud.status.cu > 0" width="300px">
        <el-form ref="form" :inline="true" :model="form" :rules="rules" size="small">
          <el-form-item label="流程" prop="id">
            <el-select v-model="processId" style="width: 178px" placeholder="请选择" @change="changeProcess">
              <el-option v-for="item in processDates" :key="item.name" :label="item.name" :value="item.id" />
            </el-select>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="text" @click="crud.cancelCU">取消</el-button>
          <el-button :loading="crud.status.cu === 2" type="primary" @click="crud.submitCU">确认</el-button>
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
              <el-table-column prop="processInstanceId" label="ID" />
              <el-table-column prop="processDefinitionName" label="名称" />
              <el-table-column prop="processDefinitionVersion" label="版本" />
              <el-table-column prop="startTime" label="创建时间" />
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
                  <el-button v-permission="['admin']" size="mini" style="margin-right: 3px;" type="text" @click="image(scope.row.id)">
                    进度
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
import CRUD, { crud, form, header, presenter } from '@crud/crud'
import crudOperation from '@crud/CRUD.operation'
import pagination from '@crud/Pagination'
import crudActivitiInstance from '@/api/activiti/instance'
import udOperation from '@crud/UD.operation'
const defaultForm = { id: null }
export default {
  name: 'ActivitiInstance',
  components: { pagination, crudOperation, udOperation },
  mixins: [presenter(), header(), form(defaultForm), crud()],
  cruds() {
    return CRUD({
      title: '发起流程',
      url: 'api/activiti/instance',
      idField: 'id',
      sort: 'id,desc',
      crudMethod: { ...crudActivitiInstance }
    })
  },
  data() {
    return {
      permission: {
        add: ['admin'],
        edit: ['admin'],
        del: ['admin']
      },
      rules: {},
      processDates: [],
      processId: '',
      currentId: null
    }
  },
  methods: {
    // 钩子：在获取表格数据之前执行，false 则代表不获取数据
    [CRUD.HOOK.beforeRefresh]() {
      return true
    },
    allActivatedProcesses() {
      const that = this
      crudActivitiInstance.enableProcess().then(res => {
        console.info(res)
        that.processDates = res.content
      }).catch(err => {
        console.log(err.response)
      })
    },
    image(id) {
    },
    suspendFormatter(a, b, c) {
      if (c === 2) {
        return '暂停'
      }
      return '激活'
    },
    suspend(id) {
      this.crud.loading = true
      crudActivitiInstance.suspend(id).then(res => {
        console.info(res)
        this.crud.loading = false
        this.crud.notify('暂停成功', CRUD.NOTIFICATION_TYPE.SUCCESS)
        this.crud.refresh()
      }).catch(err => {
        this.crud.loading = false
        console.log(err.response)
      })
    },
    activate(id) {
      this.crud.loading = true
      crudActivitiInstance.activate(id).then(res => {
        console.info(res)
        this.crud.loading = false
        this.crud.notify('激活成功', CRUD.NOTIFICATION_TYPE.SUCCESS)
        this.crud.refresh()
      }).catch(err => {
        this.crud.loading = false
        console.log(err.response)
      })
    },
    [CRUD.HOOK.afterToCU](crud, form) {
      this.allActivatedProcesses()
    },
    changeProcess(value) {
      const _this = this
      console.info(value)
      _this.currentId = value
    },
    // 提交前做的操作
    [CRUD.HOOK.afterValidateCU](crud) {
      crud.form.id = this.currentId
      return true
    }
  }
}
</script>

<style scoped>

</style>
