<template>
  <div class="template-edit-view flex-grow flex flex-col">
    <el-breadcrumb separator="/" class="px-md">
      <el-breadcrumb-item :to="{name: 'templates'}">数据模板</el-breadcrumb-item>
      <el-breadcrumb-item>{{pageEdit ? params.name : '新建模板'}}</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="bg-white pb-lg p-md flex-grow flex flex-col">
      <el-row class="my-group">
        <el-col :span="8">
          <div class="template-title">检查模版名称</div>
          <el-input type="text" size="small" placeholder="请输入中文名称" v-model="params.name" class="my-input"/>
        </el-col>
        <el-col :span="8">
          <div class="template-title">质量问题分类</div>
          <el-select v-model="params.qualityProblems" placeholder="请选择" size="small" class="my-input">
            <el-option
              v-for="(item, key) in qualityList"
              :key="key"
              :label="item.name"
              :value="item.id"/>
          </el-select>
        </el-col>
        <el-col :span="8">
          <div class="template-title">业务技术分类</div>
          <el-radio-group v-model="params.classifyEnum" class="my-radio">
            <el-radio v-for="(it, idx) of classify" :key="idx" :label="it.value">{{it.name}}</el-radio>
          </el-radio-group>
        </el-col>
      </el-row>
      <el-row class="my-group">
        <el-col :span="8">
          <div class="template-title">结果集</div>
          <el-radio-group v-model="params.resultSet" class="my-radio">
            <el-radio v-for="(it, idx) of lineClassify" :key="idx" :label="it.value">{{it.name}}</el-radio>
          </el-radio-group>
        </el-col>
        <el-col :span="16">
          <div class="template-title">检查模板描述</div>
          <el-input type="text" size="small" v-model="params.checkTypeDesc"/>
        </el-col>
      </el-row>
      <div class="relative">
        <div class="template-title">检查sql</div>
        <el-input type="textarea" :rows="8" size="small" v-model="params.script" class="code-font"/>
        <div class="flex flex-row-reverse mt-sm">
          <a href="javascript:" @click="analysis" class="dqs-btn btn-analysis text-sm">一键解析</a>
        </div>
      </div>
      <el-tabs v-model="activeName">
        <el-tab-pane label="变量说明" name="first">
          <el-table
            :data="sqlVars"
            style="width: 100%">
            <el-table-column type="index" label="序号" width="50"/>
            <el-table-column property="name" label="变量名称">
              <template #default="{row}">
                <el-input type="text" v-model="row.name" size="small" class="code-font"></el-input>
              </template>
            </el-table-column>
            <el-table-column label="变量含义">
              <template #default="{row}">
                <el-input type="text" v-model="row.description" size="small"></el-input>
              </template>
            </el-table-column>
            <el-table-column label="操作">
              <template #default="{$index}">
                <a href="javascript:" @click="sqlVarDel($index)" class="dqs-btn dqs-btn-err btn-del">删除</a>
              </template>
            </el-table-column>
          </el-table>
          <a href="javascript:" @click="sqlVarAdd" class="dqs-btn dqs-btn-white btn-add">
            <i class="el-icon-plus icon-add"></i>
          </a>
        </el-tab-pane>
        <el-tab-pane label="结果说明" name="second">
          <el-table
            :data="sqlResult"
            style="width: 100%">
            <el-table-column type="index" label="序号" width="50"/>
            <el-table-column property="result" label="结果字段">
              <template #default="{row}">
                <el-input type="text" v-model="row.result" size="small" class="code-font"></el-input>
              </template>
            </el-table-column>
            <el-table-column label="含义">
              <template #default="{row}">
                <el-input type="text" v-model="row.description" size="small"></el-input>
              </template>
            </el-table-column>
            <el-table-column label="操作">
              <template #default="{$index}">
                <a href="javascript:" @click="sqlResultDel($index)" class="dqs-btn dqs-btn-err btn-del">删除</a>
              </template>
            </el-table-column>
          </el-table>
          <a href="javascript:" @click="sqlResultAdd" class="dqs-btn dqs-btn-white btn-add">
            <i class="el-icon-plus icon-add"></i>
          </a>
        </el-tab-pane>
      </el-tabs>
      <div class="flex justify-center mt-sm mt-lg">
        <a href="javascript:" @click="save" class="dqs-btn btn-save text-sm">提交</a>
      </div>
    </div>
  </div>
</template>

<script>
  import Vue from 'vue'
  import {
    Breadcrumb,
    BreadcrumbItem,
    Table,
    TableColumn,
    Row,
    Col,
    Input,
    Select,
    Option,
    RadioGroup,
    Radio,
    Tabs,
    TabPane,
  } from 'element-ui'

  import enumerate from '~/js/enum'
  import MUTATION_EDIT from '~/graphql/mutation_template_edit.gql'
  import QUERY_QUESTIONS from '~/graphql/query_qustions.gql'
  import QUERY_TEMPLATE from '~/graphql/query_template.gql'

  Vue.use(Breadcrumb)
  Vue.use(BreadcrumbItem)
  Vue.use(Table)
  Vue.use(TableColumn)
  Vue.use(Row)
  Vue.use(Col)
  Vue.use(Input)
  Vue.use(Select)
  Vue.use(Option)
  Vue.use(RadioGroup)
  Vue.use(Radio)
  Vue.use(Tabs)
  Vue.use(TabPane)

  export default {
    name: 'TemplateEdit',

    data () {
      return {
        pageEdit: false,
        params: {
          name: '',
          qualityProblems: '', // TemplateTypeEnum!
          classifyEnum: enumerate.classify.techonlogy.value, // ClassifyEnum!
          resultSet: enumerate.lineClassify.single.value,
          checkTypeDesc: '',
          script: '',
        },
        sqlVars: [],
        sqlResult: [],
        qualityList: [],
        classify: enumerate.classify,
        lineClassify: enumerate.lineClassify,
        activeName: 'first',
      }
    },

    created () {
      if (String(this.$route.params.id) !== '0') {
        this.pageEdit = true
        this.getData()
      }
      this.getQuestions()
    },

    methods: {
      save () {
        if (this.validate()) {
          let params = Object.assign({}, this.params)
          this.pageEdit && (params.id = this.$route.params.id)
          params.resultFields = this.sqlResult
          params.params = this.sqlVars
          this.$apollo.mutate({
            mutation: MUTATION_EDIT,
            variables: {
              input: params,
            },
          }).then(res => {
            if (res.data.data) {
              this.$router.push({
                name: 'templates',
              })
              this.$message({
                message: '操作成功',
                type: 'success',
              })
            }
          })
        }
      },
      validate () {
        let params = this.params

        if (!params.name) {
          this.$message({
            message: '检查模版名称不能为空',
            type: 'warning',
          })
          return false
        }

        if (!params.qualityProblems) {
          this.$message({
            message: '质量问题分类不能为空',
            type: 'warning',
          })
          return false
        }

        if (!params.checkTypeDesc) {
          this.$message({
            message: '检查模板描述不能为空',
            type: 'warning',
          })
          return false
        }

        if (!params.script) {
          this.$message({
            message: '检查sql不能为空',
            type: 'warning',
          })
          return false
        }

        if (!this.sqlVars.length) {
          this.$message({
            message: '变量说明数据不能为空',
            type: 'warning',
          })
          return false
        }

        for (let it of this.sqlVars) {
          if (!it.name || !it.description) {
            this.$message({
              message: '变量说明数据不能为空',
              type: 'warning',
            })
            return false
          }
        }

        if (!this.sqlResult.length) {
          this.$message({
            message: '结果说明数据不能为空',
            type: 'warning',
          })
          return false
        }

        for (let it of this.sqlResult) {
          if (!it.result || !it.description) {
            this.$message({
              message: '结果说明数据不能为空',
              type: 'warning',
            })
            return false
          }
        }
        return true
      },
      analysis () {
        if (this.params.script) {
          let vars = [...new Set(this.params.script.match(/[^${]+(?=})/g))]
          if (vars.length) {
            this.sqlVars = []
            vars.forEach(it => {
              this.sqlVars.push({
                name: it,
                description: '',
              })
            })
          }
        }
      },
      sqlResultDel (idx) {
        this.$confirm('确认删除?', '提示', {
          confirmButtonText: '确定',
          type: 'warning',
        }).then(() => {
          this.sqlResult.splice(idx, 1)
        })
      },
      sqlResultAdd () {
        this.sqlResult.push({
          result: '',
          description: '',
        })
      },
      sqlVarDel (idx) {
        this.$confirm('确认删除?', '提示', {
          confirmButtonText: '确定',
          type: 'warning',
        }).then(() => {
          this.sqlVars.splice(idx, 1)
        })
      },
      sqlVarAdd () {
        this.sqlVars.push({
          name: '',
          description: '',
        })
      },
      getQuestions () {
        this.$apollo.query({
          query: QUERY_QUESTIONS,
          fetchPolicy: 'network-only',
        }).then(res => {
          if (res) {
            this.qualityList = res.data.data
          }
        })
      },
      getData () {
        this.$apollo.query({
          query: QUERY_TEMPLATE,
          fetchPolicy: 'network-only',
          variables: {
            id: this.$route.params.id,
          },
        }).then(res => {
          if (res) {
            let data = res.data.data
            for (let key in this.params) {
              this.params[key] = data[key]
            }
            this.sqlVars = data.params.map(it => ({
              name: it.name,
              description: it.description,
            }))
            this.sqlResult = data.resultFields.map(it => ({
              result: it.result,
              description: it.description,
            }))
          }
        })
      },
    },
  }
</script>

<style lang="scss">
  .template-edit-view {
    $fontSzieTitle: 15px;

    .mb-15 {
      margin-bottom: 15px;
    }

    .template-title {
      font-size: $fontSzieTitle;
    }

    .my-input {
      width: 260px;
    }

    .my-radio {
      @apply flex items-center;

      height: 32px;
    }

    .btn-analysis {
      @apply bg-white text-blue;
      width: 80px;
      height: 25px;
    }

    .btn-del {
      width: 40px;
    }

    .btn-add {
      @apply flex text-3xl text-gray-dark;
      border: none;
      border-bottom: 1px solid #EBEEF5;
      height: 40px;
    }

    .btn-save {
      width: 64px;
      height: 32px;
    }

    .my-group{
      margin-bottom: 12px;
    }
  }
</style>
