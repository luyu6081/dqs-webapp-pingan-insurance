<template>
  <section class="solve-view bg-white p-md mb-sm">
    <div class="title mb-sm">工单操作</div>
    <el-form label-width="80px">
      <el-form-item label="工单操作:">
        <el-radio-group v-model="params.operation">
          <el-radio v-show="it.hasAudit.indexOf(auditName) !== -1" v-for="(it, idx) of issueOperateStatus" :key="idx"
                    :label="it.value">{{it.name}}
          </el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item v-if="this.params.operation === this.issueOperateStatus.pass.value" label="问题状态:">
        <el-radio-group v-model="params.stateEnum">
          <el-radio v-for="(it, idx) of issueOperateSuccess" :key="idx" :label="it.value">{{it.name}}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item v-if="params.operation === issueOperateStatus.resolve.value" label="转发给:">
        <el-select v-model="params.userId"
                   size="mini"
                   filterable
                   remote
                   :remote-method="getUsers"
                   placeholder="请选择">
          <el-option v-for="(it, idx) of userList" :key="idx" :label="`${it.name}(${it.jobNumber})`"
                     :value="it.userId"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="备注:">
        <el-input type="textarea" v-model="params.opinion" :rows="5"></el-input>
      </el-form-item>
      <!--todo: 后端未做,暂时隐藏-->
      <!--<el-form-item label="上传附件:">
        <upload @addFile="handleAddFile" @remove="handleRemove"/>
      </el-form-item>-->
    </el-form>
    <div class="flex flex-row-reverse">
      <a href="javascript:" class="dqs-btn btn-action" @click="save">提交</a>
    </div>
  </section>
</template>

<script>
  import Vue from 'vue'
  import {
    Form,
    FormItem,
    Input,
    Radio,
    RadioGroup,
    Select,
    Option,
    Button,
  } from 'element-ui'

  import enumerate from '~/js/enum'
  import QUERY_AUDIT from '~/graphql/issue_audit.gql'
  import QUERY_USERS from '~/graphql/uc/auth-name-card-query.gql'
  // import Upload from '~/components/upload'

  Vue.use(Form)
  Vue.use(FormItem)
  Vue.use(Input)
  Vue.use(Radio)
  Vue.use(RadioGroup)
  Vue.use(Select)
  Vue.use(Option)
  Vue.use(Button)

  export default {
    props: {
      auditName: {
        type: String,
      },
    },

    components: {
      // Upload,
    },

    data () {
      return {
        params: {
          taskId: this.$route.params.issueId,
          opinion: '',
          operation: enumerate.issueOperateStatus.resolve.value,
          stateEnum: enumerate.issueOperateSuccess.solve.value,
          userId: '',
          // filePaths: [],
        },
        issueOperateStatus: enumerate.issueOperateStatus,
        issueOperateSuccess: enumerate.issueOperateSuccess,
        issueAudit: enumerate.issueAudit,
        userList: [],
      }
    },

    created () {
      this.getUsers()
    },

    methods: {
      save () {
        if (this.params.operation === this.issueOperateStatus.resolve.value) {
          if (!this.params.userId) {
            this.$message.warning({
              message: '请选择转发人',
            })
            return
          }
        }
        this.$apollo.mutate({
          mutation: QUERY_AUDIT,
          variables: {
            input: this.params,
          },
        }).then(data => {
          if (data) {
            this.$emit('change')
            this.$message({
              message: '操作成功',
              type: 'success',
            })
          }
        })
      },
      handleRemove (file) {
        let idx = this.filePaths.indexOf(file.id)
        this.filePaths.splice(idx, 1)
      },
      handleAddFile (file) {
        this.params.filePaths.push(file.id)
      },
      getUsers (val) {
        this.$apollo.query({
          client: 'ucClient',
          query: QUERY_USERS,
          variables: {
            input: {
              keyWords: val,
            },
          },
        }).then(res => {
          if (res) {
            this.userList = res.data.users
          }
        })
      },
    },

  }
</script>

<style lang="scss">
  .solve-view {
    padding: 13px 20px;

    .title {
      font-size: 15px;
      font-weight: bold;
    }

    .btn-action {
      width: 64px;
      height: 26px;
    }
  }

</style>
<style lang="scss">
  .solve-view {
    .el-form-item {
      margin-bottom: theme('spacing.sm');
    }

    .el-form-item__label, .el-form-item__content {
      line-height: 20px;
    }

    .el-input--mini {
      .el-input__inner, .el-input__icon {
        height: 20px;
        line-height: 20px;
      }
    }
  }
</style>
