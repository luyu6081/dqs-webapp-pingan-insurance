<template>
  <section class="create-view bg-white p-md mb-sm">
    <div class="title mb-sm">工单操作</div>
    <el-form label-width="80px">
      <el-form-item label="补充信息:">
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
  import QUERY_AUDIT from '~/graphql/issue_audit.gql'

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
    name: 'Slove',

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
          // filePaths: [],
        },
        userList: [],
      }
    },

    methods: {
      save () {
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
    },

  }
</script>

<style lang="scss">
  .create-view {
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
  .create-view {
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
