<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <!--如果想在工具栏加入更多按钮，可以使用插槽方式， slot = 'left' or 'right'-->
      <crudOperation :permission="permission" />
      <el-dialog :close-on-click-modal="false" :visible.sync="showModal" width="500px">
        <el-form ref="form" :inline="true" :model="form" :rules="rules" size="small">
          <vue-json-editor @json-change="onJsonChange" />
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="text" @click="hiddenModal">取消</el-button>
          <el-button :loading="false" type="primary" @click="action">确认</el-button>
        </div>
      </el-dialog>
      <el-row :gutter="15">
        <!--用户管理-->
        <el-col style="margin-bottom: 10px">
          <el-card class="box-card" shadow="never">
            <div slot="header" class="clearfix">
              <span class="role-span">所有任务</span>
            </div>
            <!--表格渲染-->
            <el-table ref="table" v-loading="crud.loading" :data="crud.data" size="small" style="width: 100%;">
              <el-table-column prop="id" label="ID" />
              <el-table-column prop="name" label="名称" />
              <el-table-column prop="processInstanceId" label="实例ID" />
              <el-table-column prop="processDefinitionId" label="流程ID" />
              <el-table-column prop="persistentState.suspensionState" :formatter="suspendFormatter" label="流程状态" />
              <el-table-column v-if="checkPer(['admin'])" label="操作" width="150px" align="center">
                <template slot-scope="scope">
                  <el-button v-permission="['admin']" size="mini" style="margin-right: 3px;" type="text" @click="modal(scope.row.id,complete)">
                    完成
                  </el-button>
                  <el-button v-permission="['admin']" size="mini" style="margin-right: 3px;" type="text" @click="assignee(scope.row.id)">
                    分配
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
import crudActivitiTask from '@/api/activiti/task'
import vueJsonEditor from 'vue-json-editor'
const defaultForm = { id: null }
export default {
  name: 'ActivitiTask',
  components: { pagination, crudOperation, vueJsonEditor },
  mixins: [presenter(), header(), form(defaultForm), crud()],
  cruds() {
    return CRUD({
      title: '任务管理',
      url: 'api/activiti/task',
      idField: 'id',
      sort: 'id,desc',
      crudMethod: { ...crudActivitiTask }
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
      showModal: false,
      action: '',
      currentId: null,
      jsonContent: null
    }
  },
  created() {
    this.crud.optShow.add = false
    this.crud.optShow.edit = false
    this.crud.optShow.del = false
  },
  methods: {
    // 钩子：在获取表格数据之前执行，false 则代表不获取数据
    [CRUD.HOOK.beforeRefresh]() {
      return true
    },
    suspendFormatter(a, b, c) {
      if (c === 2) {
        return '暂停'
      }
      return '激活'
    },
    modal(id, action) {
      this.showModal = true
      this.action = action
      this.currentId = id
    },
    hiddenModal() {
      this.showModal = false
    },
    complete() {
      this.showModal = false
      console.info(this.jsonContent)
      crudActivitiTask.complete(this.currentId, this.jsonContent).then(res => {
        console.info(res)
        this.crud.loading = false
        this.crud.notify('操作完成', CRUD.NOTIFICATION_TYPE.SUCCESS)
      }).catch(err => {
        this.crud.loading = false
        console.log(err.response)
      })
    },
    onJsonChange(value) {
      this.jsonContent = value
    }
  }
}
</script>

<style scoped>

</style>
