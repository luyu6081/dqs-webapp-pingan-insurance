<template>
  <div v-if="Object.keys(data).length" class="template-detial-view flex-grow flex flex-col">
    <el-breadcrumb separator="/" class="px-md">
      <el-breadcrumb-item :to="{name: 'templates'}">数据模板</el-breadcrumb-item>
      <el-breadcrumb-item>模板详情</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="bg-white pb-lg p-md flex-grow flex flex-col">
      <el-row class="template-title mb-sm">
        <el-col :span="12">
          <span class="font-bold">检查模版名称：</span>
          <span>{{data.name}}</span>
        </el-col>
        <el-col :span="12">
          <span class="font-bold">质量问题分类：</span>
          <span>{{qualityName}}</span>
        </el-col>
      </el-row>
      <el-row class="template-title mb-sm">
        <el-col :span="12">
          <span class="font-bold">业务技术分类：</span>
          <span>{{data.classifyEnum | getClassify}}</span>
        </el-col>
        <el-col :span="12">
          <span class="font-bold">结果集：</span>
          <span>{{data.resultSet | getLineClassify}}</span>
        </el-col>
      </el-row>
      <div class="mb-sm template-title flex">
        <span class="font-bold desc">检查模版描述：</span>
        <span>{{data.checkTypeDesc}}</span>
      </div>
      <div class="font-bold mb-xs template-title">检查SQL</div>
      <div class="highlight-wrap mb-sm">
        <ej-highlight :code="data.script" language="sql"/>
      </div>
      <el-tabs v-model="activeName">
        <el-tab-pane label="变量说明" name="first">
          <el-table
            :data="data.params"
            style="width: 100%">
            <el-table-column type="index" label="序号" width="50"/>
            <el-table-column property="name" label="变量名称">
              <template #default="{row}">
                <span class="code-font">{{row.name}}</span>
              </template>
            </el-table-column>
            <el-table-column label="变量含义" prop="description"/>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="结果说明" name="second">
          <el-table
            :data="data.resultFields"
            style="width: 100%">
            <el-table-column type="index" label="序号" width="50"/>
            <el-table-column property="result" label="结果字段">
              <template #default="{row}">
                <span class="code-font">{{row.result}}</span>
              </template>
            </el-table-column>
            <el-table-column label="含义" prop="description"/>
          </el-table>
        </el-tab-pane>
      </el-tabs>
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
    Tabs,
    TabPane,
  } from 'element-ui'
  import {Highlight} from '@ej/ui'

  import QUERY_TEMPLATE from '~/graphql/query_template.gql'
  import QUERY_QUESTIONS from '~/graphql/query_qustions.gql'
  import {getClassify, getLineClassify} from '~/utils/filter'

  Vue.use(Breadcrumb)
  Vue.use(BreadcrumbItem)
  Vue.use(Table)
  Vue.use(TableColumn)
  Vue.use(Row)
  Vue.use(Col)
  Vue.use(Tabs)
  Vue.use(TabPane)
  Vue.use(Highlight)

  export default {
    name: 'TemplateEdit',

    filters: {
      getClassify,
      getLineClassify,
    },

    data () {
      return {
        data: {},
        qualityList: [],
        activeName: 'first',
      }
    },

    computed: {
      qualityName () {
        if (this.qualityList.length && this.data.qualityProblems) {
          let it = this.qualityList.find(it => it.id === this.data.qualityProblems)
          return it ? it.name : '无'
        }
        return '无'
      },
    },

    created () {
      this.getData()
      this.getQuestions()
    },

    methods: {
      getData () {
        this.$apollo.query({
          query: QUERY_TEMPLATE,
          fetchPolicy: 'network-only',
          variables: {
            id: this.$route.params.id,
          },
        }).then(res => {
          if (res) {
            // let data = res.data.data
            this.data = res.data.data
          }
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
    },
  }
</script>

<style lang="scss">
  .template-detial-view {
    $fontSzieTitle: 15px;

    .template-title {
      font-size: $fontSzieTitle;
    }

    .highlight-wrap {
      max-height: 600px;
      border: 1px solid theme('colors.gray.default');
      border-radius: 4px;
      overflow: auto;
    }

    .desc {
      min-width: 105px;
    }
  }
</style>
