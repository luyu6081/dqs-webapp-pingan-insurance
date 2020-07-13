<template>
  <div class="rule-edit-view mx-auto flex-grow flex flex-col">
    <el-breadcrumb separator="/" class="p-md">
      <el-breadcrumb-item :to="{name: 'rule-index'}">检查规则</el-breadcrumb-item>
      <el-breadcrumb-item>{{pageEdit ? this.params.name : '新建规则'}}</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="bg-white p-md pb-lg flex-grow flex flex-col edit-main">
      <div class="text-lg mb-sm">基础信息</div>
      <el-row class="mb-sm">
        <el-col :span="8">
          <div class="template-title">检查规则名称</div>
          <el-input type="text" size="small" placeholder="请输入中文名称" v-model="params.name" class="my-input"/>
        </el-col>
        <el-col :span="16">
          <div class="template-title">检查任务描述</div>
          <el-input type="text" size="small" v-model="params.desc"/>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <div class="template-title">检查任务对象</div>
          <select-target :params.sync="params" :tree="targetTree" class="my-input"/>
        </el-col>
        <el-col :span="8">
          <div class="template-title">表</div>
          <select-table :tableId.sync="params.tableId"
                        :tableList="tableList"
                        :disabled="!params.databaseId"
                        @getTables="getTables"
                        @change="checkTable"
                        class="my-input"/>
        </el-col>
        <el-col :span="8">
          <div class="template-title">字段</div>
          <el-select
            v-model="params.columnIds"
            multiple
            filterable
            :disabled="!params.tableId"
            size="small"
            placeholder="请选择"
            class="block">
            <el-option
              v-for="(it, idx) of columnIds"
              :key="idx"
              :label="it.name"
              :value="it.id">
            </el-option>
          </el-select>
        </el-col>
      </el-row>
      <div v-if="pageEdit" class="mb-sm">
        <div class="template-title">变更说明</div>
        <el-input type="textarea" :rows="3" v-model="changesThat"/>
      </div>
      <div class="text-lg mb-sm mt-md">任务配置</div>
      <el-row class="mb-sm">
        <el-col :span="8">
          <div class="template-title">ETL任务</div>
          <el-select
            v-model="params.etlJobId"
            filterable
            size="small"
            placeholder="请选择"
            class="my-input">
            <el-option
              v-for="(it, idx) of eltList"
              :key="idx"
              :label="it.name"
              :value="it.id">
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="8">
          <div class="template-title">检查规则</div>
          <el-radio-group v-model="params.location">
            <el-radio v-for="(it, idx) of ruleLocation" :key="idx" :label="it.value">{{it.name}}</el-radio>
          </el-radio-group>
        </el-col>
        <el-col :span="8">
          <div class="template-title">任务状态</div>
          <el-radio-group v-model="params.runningState">
            <el-radio :label="true">启动</el-radio>
            <el-radio :label="false">暂停</el-radio>
          </el-radio-group>
        </el-col>
      </el-row>
      <el-row class="mb-sm">
        <el-col :span="8">
          <div class="template-title">检查结果保留天数</div>
          <el-input type="text" size="small" v-model="params.resultTemporaryDay" class="my-input"/>
        </el-col>
        <el-col :span="8">
          <div class="template-title">检查间隔</div>
          <el-radio-group v-model="params.interval">
            <el-radio v-for="(it, idx) of ruleInterval" :key="idx" :label="it.value">{{it.name}}</el-radio>
          </el-radio-group>
        </el-col>
        <el-col :span="8" v-if="params.interval !== ruleInterval.day.value">
          <div class="template-title">检查日期</div>
          <el-select
            v-if="params.interval === ruleInterval.week.value"
            v-model="params.variable"
            filterable
            size="small"
            placeholder="请选择"
            class="block">
            <el-option
              v-for="(it, idx) of week"
              :key="idx"
              :label="it.name"
              :value="it.value">
            </el-option>
          </el-select>
          <el-select
            v-else
            v-model="params.variable"
            filterable
            size="small"
            placeholder="请选择"
            class="block">
            <el-option
              v-for="(it, idx) of 31"
              :key="idx"
              :value="it">
            </el-option>
          </el-select>
        </el-col>
      </el-row>
      <el-row class="mb-sm">
        <el-col :span="8">
          <div class="template-title">错误推送方式</div>
          <div>
            <el-checkbox v-model="params.noticeEmail">短信</el-checkbox>
            <el-checkbox v-model="params.noticePhone">邮件</el-checkbox>
          </div>
        </el-col>
      </el-row>
      <div class="text-lg mb-sm mt-md">检查模版</div>
      <el-row>
        <el-col :span="12" class="pr-md self-stretch">
          <div class="template-title">检查模版</div>
          <el-select
            v-model="params.templateId"
            filterable
            size="small"
            remote
            :remote-method="getTems"
            placeholder="请选择"
            class="block mb-sm">
            <el-option
              v-for="(it, idx) of temList"
              :key="idx"
              :label="it.name"
              :value="it.id">
            </el-option>
          </el-select>
          <div v-if="temDetail">
            <div class="template-title">检查sql</div>
            <ej-highlight :code="temDetail.script" :key="highlightKey" language="sql" class="highlight"/>
          </div>
        </el-col>
        <el-col v-if="temDetail" :span="12">
          <div class="template-title">检查模版变量</div>
          <el-table
            :data="temDetail.params"
            style="width: 100%"
            class="my-table">
            <el-table-column type="index" label="序号" width="50"/>
            <el-table-column property="name" label="变量名称"/>
            <el-table-column label="变量含义" property="description"/>
            <el-table-column label="变量赋值">
              <template #default="{row}">
<!--                <el-input type="text" v-model="row.fun" size="small"></el-input>-->
                <input v-model="row.fun" type="text" class="fun-input">
              </template>
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>
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
  } from 'element-ui'
  import {Highlight} from '@ej/ui'

  import enumerate from '~/js/enum'
  import {toTreeData} from '~/utils'
  import MUTATION_EDIT from '~/graphql/mutation_rule_edit.gql'
  import QUERY_TEMS from '~/graphql/query_templates.gql'
  import QUERY_ETLS from '~/graphql/query_etls.gql'
  import QUERY_TABLE from '~/graphql/query_target_table.gql'
  import QUERY_TARGET from '~/graphql/query_target.gql'
  import QUERY_RULE from '~/graphql/rule_detail.gql'

  import SelectTarget from '~/components/rule/target.vue'
  import SelectTable from '~/components/rule/table.vue'

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
  Vue.use(Highlight)

  const week = [
    {
      value: 1,
      name: '星期一',
    },
    {
      value: 2,
      name: '星期二',
    },
    {
      value: 3,
      name: '星期三',
    },
    {
      value: 4,
      name: '星期四',
    },
    {
      value: 5,
      name: '星期五',
    },
    {
      value: 6,
      name: '星期六',
    },
    {
      value: 7,
      name: '星期日',
    },
  ]

  export default {
    name: 'TemplateEdit',

    components: {
      SelectTarget,
      SelectTable,
    },

    data () {
      return {
        pageEdit: false,
        params: {
          name: '',
          desc: '',
          applyId: '',
          systemId: '',
          databaseId: '',
          tableId: '',
          columnIds: [],
          templateId: '',
          etlJobId: '',
          resultTemporaryDay: '',
          interval: enumerate.ruleInterval.day.value,
          variable: '',
          runningState: true,
          location: enumerate.ruleLocation.pre.value,
          noticeEmail: true,
          noticePhone: true,
        },
        changesThat: '',
        columnIds: [],
        eltList: [],
        temList: [],
        tableList: [],
        targetTree: [],
        ruleLocation: enumerate.ruleLocation,
        ruleInterval: enumerate.ruleInterval,
        week: week,
        highlightKey: 1,
      }
    },

    computed: {
      temDetail () {
        return this.temList.find(it => it.id === this.params.templateId) || ''
      },
    },

    created () {
      if (String(this.$route.params.id) !== '0') {
        this.pageEdit = true
      }
      this.getMdsTarget()
      this.getEtls()
      this.getTems()
    },

    watch: {
      'params.interval' () {
        this.params.variable = ''
      },
      'params.databaseId' (val) {
        if (val) {
          this.params.tableId = ''
          this.params.columnIds = []
          this.getTables()
        }
      },
      'params.templateId' () {
        this.highlightKey++
      },
    },

    methods: {
      getTems (val) {
        this.$apollo.query({
          query: QUERY_TEMS,
          fetchPolicy: 'network-only',
          variables: {
            input: {
              offset: 0,
              limit: 100,
              keyword: val,
            },
          },
        }).then(res => {
          if (res) {
            this.temList = res.data.data.data
            if (this.pageEdit) {
              this.getDetail()
            }
          }
        })
      },
      getEtls () {
        this.$apollo.query({
          query: QUERY_ETLS,
          fetchPolicy: 'network-only',
        }).then(res => {
          if (res) {
            this.eltList = res.data.data
          }
        })
      },
      getTables (keyword) {
        this.$apollo.query({
          query: QUERY_TABLE,
          fetchPolicy: 'network-only',
          variables: {
            input: {
              techCategoryId: this.params.databaseId,
              keyword: keyword,
            },
          },
        }).then(res => {
          if (res) {
            this.tableList = res.data.data.data
            this.getColumns()
          }
        })
      },
      getMdsTarget () {
        this.$apollo.query({
          query: QUERY_TARGET,
          fetchPolicy: 'no-cache',
          variables: {
            input: {
              type: 'TECHONLOGY',
              status: 'AVAILABLE',
              offset: 0,
              // 极大值，所有
              size: 1000000,
            },
          },
        }).then(res => {
          if (res) {
            this.targetTree = toTreeData(res.data.data, {
              rootId: '0',
              id: 'id',
              name: 'name',
              parentId: 'parentId',
            })

            const delNullChildren = (data) => {
              for (let it of data) {
                if (!it.children.length) {
                  delete it.children
                } else {
                  delNullChildren(it.children)
                }
              }
            }
            delNullChildren(this.targetTree)
          }
        })
      },
      getDetail () {
        this.$apollo.query({
          query: QUERY_RULE,
          fetchPolicy: 'network-only',
          variables: {
            id: this.$route.params.id,
          },
        }).then(res => {
          if (res) {
            let data = res.data.data
            let target = data.target
            for (let key in this.params) {
              this.params[key] = data[key]
            }
            this.params.id = data.id
            this.params.templateId = data.template.id
            this.params.applyId = target.applyId
            this.params.systemId = target.systemId
            this.params.databaseId = target.databaseId
            this.$nextTick(() => {
              this.params.tableId = target.tableId
              this.params.columnIds = target.columnIds
            })
            this.temDetail.params = this.temDetail.params.map((it, idx) => {
              it.fun = data.setting[idx]
              return it
            })
          }
        })
      },
      save () {
        if (this.validate()) {
          let params = Object.assign({}, this.params)
          // 默认值改成 0
          !params.variable && (params.variable = 0)
          params.setting = this.temDetail.params.map(it => it.fun)
          this.$apollo.mutate({
            mutation: MUTATION_EDIT,
            variables: {
              input: params,
            },
          }).then(res => {
            if (res.data.data) {
              this.$router.push({
                name: 'rule-index',
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
        if (this.pageEdit) {
          this.params.changesThat = this.changesThat

          if (!this.params.changesThat) {
            this.$message({
              message: '变更说明不能为空',
              type: 'warning',
            })
            return false
          }
        }

        let params = this.params

        if (!params.name) {
          this.$message({
            message: '检查规则名称不能为空',
            type: 'warning',
          })
          return false
        }

        if (!params.desc) {
          this.$message({
            message: '检查任务描述不能为空',
            type: 'warning',
          })
          return false
        }

        if (!params.tableId) {
          this.$message({
            message: '表不能为空',
            type: 'warning',
          })
          return false
        }

        if (!params.columnIds.length) {
          this.$message({
            message: '字段不能为空',
            type: 'warning',
          })
          return false
        }

        if (!params.etlJobId) {
          this.$message({
            message: 'ETL任务不能为空',
            type: 'warning',
          })
          return false
        }

        if (!params.resultTemporaryDay) {
          this.$message({
            message: '检查结果保留天数不能为空',
            type: 'warning',
          })
          return false
        }

        if (this.params.interval !== enumerate.ruleInterval.day.value && !this.params.variable) {
          this.$message({
            message: '检查日期不能为空',
            type: 'warning',
          })
          return false
        }

        if (!this.params.templateId) {
          this.$message({
            message: '检查模版不能为空',
            type: 'warning',
          })
          return false
        }

        for (let it of this.temDetail.params) {
          if (!it.fun) {
            this.$message({
              message: '检查模版变量数据不能为空',
              type: 'warning',
            })
            return false
          }
        }

        return true
      },
      checkTable () {
        this.params.columnIds = []
        this.getColumns()
      },

      getColumns () {
        if (this.params.tableId) {
          let tableDetail = this.tableList.find(it => this.params.tableId === it.id)
          this.columnIds = tableDetail ? tableDetail.mdsColumns : []
        }
      },
    },
  }
</script>

<style lang="scss">
  .rule-edit-view {
    $fontSzieTitle: 15px;

    & {
      width: 1100px;
      /*padding: ;*/
    }

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
      @apply flex items-center justify-center;

      height: 32px;
    }

    .btn-save {
      width: 64px;
      height: 32px;
    }

    .rule-title {

    }

    .my-table th {
      @apply bg-gray-lighter;
    }

    .highlight {
      height: 600px;
      overflow-y: auto;
    }

    .fun-input {
      @apply px-2;
      width: 100%;
      border-radius: 4px;
    }
  }
</style>
