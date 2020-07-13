<template>
  <div class="setting-questions-view">
    <div class="mb-lg flex flex-row-reverse"><a href="javacript:" @click="gotoAdd" class="dqs-btn btn-add">新增</a></div>
    <table width="100%" class="table my-table">
      <thead>
      <tr>
        <th class="text-left">序号</th>
        <th class="text-left">分类名称</th>
        <th class="text-left">描述</th>
        <th class="text-left">操作</th>
      </tr>
      </thead>
      <vue-draggable v-model="dataList" tag="tbody" @change="change">
        <tr v-for="(it, idx) of dataList" :key="idx">
          <td>{{idx}}</td>
          <td>{{it.name}}</td>
          <td style="width: 400px">{{it.description}}</td>
          <td>
            <a href="javascript:" @click="moveUp(idx)" class="inline-flex text-blue" :class="{'events-none': idx === 0}">上移</a>
            <a href="javascript:" @click="moveDown(idx)" class="inline-flex text-blue ml-sm" :class="{'events-none': idx === dataList.length -1}">下移</a>
            <a href="javascript:" @click="edit(it)" class="inline-flex text-blue ml-sm">编辑</a>
            <a href="javascript:" @click="sureDel(it.id, idx)" class="inline-flex text-blue ml-sm">删除</a>
          </td>
        </tr>
      </vue-draggable>
    </table>
    <el-dialog
      title="新增问题分类"
      :visible.sync="dialog.visible"
      width="700px"
      :before-close="handleClose">
      <template #default>
        <el-form :model="dialog.params" :rules="dialog.rules" ref="ruleForm" label-width="100px" class="px-md">
          <el-form-item label="分类名称" prop="name">
            <el-input v-model="dialog.params.name"></el-input>
          </el-form-item>
          <el-form-item label="描述" prop="description">
            <el-input type="textarea" rows="5" v-model="dialog.params.description"></el-input>
          </el-form-item>
        </el-form>
      </template>
      <template #footer class="dialog-footer">
        <a href="javascript:" @click="handleClose" class="dqs-btn dqs-btn-white btn-dialog">取 消</a>
        <a href="javascript:" @click="add" class="dqs-btn ml-md btn-dialog mr-md">确 定</a>
      </template>
    </el-dialog>
  </div>
</template>

<script>
  import Vue from 'vue'
  import {Table, TableColumn, Dialog, Form, FormItem, Input} from 'element-ui'
  import Lodash from 'lodash'
  import VueDraggable from 'vuedraggable'
  import QUERY_LIST from '~/graphql/query_qustions.gql'
  import MUTATION_DEL from '~/graphql/mutation_question_del.gql'
  import MUTATION_MOVE from '~/graphql/mutation_question_move.gql'
  import MUTATION_ADD from '~/graphql/mutation_question_add.gql'

  Vue.use(Table)
  Vue.use(TableColumn)
  Vue.use(Dialog)
  Vue.use(Form)
  Vue.use(FormItem)
  Vue.use(Input)

  export default {
    name: 'Questions',

    components: {
      VueDraggable,
    },

    data () {
      return {
        dataList: [],
        oldDataList: [],
        dialog: {
          visible: false,
          params: {
            id: '',
            name: '',
            description: '',
          },
          rules: {
            name: [{required: true, message: '信息为不能空', trigger: 'blur'}],
            description: [{required: true, message: '信息不能为空', trigger: 'blur'}],
          },
        },
        isEdit: false,
      }
    },

    created () {
      this.getData()
    },

    methods: {
      getData () {
        this.$apollo.query({
          query: QUERY_LIST,
          fetchPolicy: 'network-only',
        }).then(res => {
          if (res) {
            let data = res.data.data
            this.dataList = data
            this.oldDataList = Lodash.cloneDeep(data)
          }
        })
      },
      sureDel (id, idx) {
        this.$confirm('此操作将永久删除, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }).then(() => {
          this.del(id, idx)
        })
      },
      del (id, idx) {
        this.$apollo.mutate({
          mutation: MUTATION_DEL,
          variables: {
            id: id,
          },
        }).then(res => {
          if (res.data.data) {
            this.getData()
            this.$message({
              type: 'success',
              message: '操作成功',
            })
          } else {
            this.$message({
              type: 'warning',
              message: '数据模板引用的数据，不可删除',
            })
          }
        })
      },
      moveUp (idx) {
        if (idx === 0) return
        this.move({
          startId: this.dataList[idx].id,
          endId: this.dataList[idx - 1].id,
        })
      },
      moveDown (idx) {
        if (idx === this.dataList.length - 1) return
        this.move({
          startId: this.dataList[idx].id,
          endId: this.dataList[idx + 1].id,
        })
      },
      move (params) {
        this.$apollo.mutate({
          mutation: MUTATION_MOVE,
          variables: params,
        }).then(res => {
          if (res) {
            this.getData()
            this.$message({
              message: '操作成功',
              type: 'success',
            })
          }
        })
      },
      add () {
        this.$refs.ruleForm.validate(valid => {
          if (valid) {
            this.$apollo.mutate({
              mutation: MUTATION_ADD,
              variables: {
                input: this.dialog.params,
              },
            }).then(res => {
              if (res) {
                this.getData()
                this.dialog.visible = false
                this.clearParams()
                this.$message({
                  message: '操作成功',
                  type: 'success',
                })
              }
            })
          }
        })
      },
      handleClose () {
        this.$confirm('是否清空操作数据？')
          .then(_ => {
            this.dialog.visible = false
            this.clearParams()
          })
          .catch(() => {
            this.dialog.visible = false
          })
      },
      clearParams () {
        this.dialog.params = {
          id: '',
          name: '',
          description: '',
        }
      },
      edit (row) {
        this.isEdit = true
        this.dialog.params = {
          id: row.id,
          name: row.name,
          description: row.description,
        }
        this.dialog.visible = true
      },
      gotoAdd () {
        if (this.isEdit) {
          this.isEdit = false
          this.clearParams()
        }
        this.dialog.visible = true
      },
      change (data) {
        if (data.moved) {
          this.moved(data.moved)
        }
      },
      moved (data) {
        this.move({
          startId: data.element.id,
          endId: this.oldDataList[data.newIndex].id,
        })
      },
    },
  }
</script>

<style lang="scss">
  .setting-questions-view {
    .btn-add {
      @apply bg-blue-lighter border-blue-lighter text-blue;
      width: 58px;
      height: 24px;
    }

    .btn-dialog {
      width: 64px;
      height: 26px;
    }

    .my-table{
      th, td{
        padding: 10px 0;
        border-bottom: 1px solid theme('colors.gray.light');
      }
      tr>:first-child, tr>:last-child{
        @apply pl-sm;
      }
      tbody tr{
        &{
          cursor: move;
        }
        &:hover{
          @apply bg-gray-lighter;
        }
        td{
          transition: background-color .25s ease;
        }
      }
    }

    .events-none {
      @apply pointer-events-none text-gray-dark;
    }
  }
</style>
