<template>
  <div class="templates-view flex-grow bg-white py-md">
    <ej-search-list :models.sync="params"
                    :keyword.sync="keyword"
                    @search="getData(1)"
                    :default-tag-more="true"
                    :view-id="2"
                    class="px-md">
      <template #default="{setSelected}">
        <ej-search-option-list prop="templateTypeIds"
                               v-model="params.templateTypeIds"
                               label="问题分类"
                               :options="qualityList"/>
        <ej-search-option-select prop="classifyEnums"
                                 v-model="params.classifyEnums"
                                 label="基础资源"
                                 :options="classify"/>
      </template>
    </ej-search-list>

    <ej-list :data="dataList"
             :total="total"
             :pagination="{position: 'right', ...pageOptions}"
             @current-page-change="getData"
             :loading="loading">
      <div slot="header"></div>
      <div slot="footer"></div>
      <template #suffix>
        <get-auth data="dqsTemplateAdd" class="ml-auto">
          <router-link :to="{name: 'template-edit', params: {id: 0}}" class="dqs-btn mb-sm text-sm btn-add">新建模版
          </router-link>
        </get-auth>
      </template>
      <template #default="{data}">
        <div class="templates-item px-md py-sm flex-1">
          <div class="flex mb-xs">
            <router-link :to="{name: 'template-detail', params: {id: data.item.id}}" v-html="data.item.name" class="text-blue text-lg root-highlight"></router-link>
            <div class="flex ml-auto">
              <get-auth data="dqsTemplateUpdate">
                <router-link :to="{name: 'template-edit', params: {id: data.item.id}}"><i
                  class="el-icon-edit text-blue text-lg"></i></router-link>
              </get-auth>
              <get-auth data="dqsTemplateRemove">
                <a href="javascript:" @click="delSure(data.item.id)" class="ml-sm"><i
                  class="el-icon-delete text-blue text-lg"></i></a>
              </get-auth>
            </div>
          </div>
          <p class="desc mb-xs">
            描述：
            <span v-html="data.item.checkTypeDesc" class="root-highlight"></span>
          </p>
          <div class="other-info flex">
            <div v-if="qualityList.length" class="other-info-item">数据问题分类：{{getQual(data.item.qualityProblems)}}</div>
            <div class="other-info-item">业务技术分类：{{data.item.classifyEnum | getClassify}}</div>
            <div class="other-info-item">引用次数：{{data.item.tasksNumber}}次</div>
            <div class="other-info-item">创建人：{{data.item.createdBy.name}}</div>
            <div class="other-info-item other-info-time">创建时间：{{data.item.createTm | formatDate('YYYY-MM-DD')}}</div>
          </div>
        </div>
      </template>
    </ej-list>
  </div>
</template>

<script>
  import Vue from 'vue'
  import {SearchList, SearchOptionList, SearchOptionSelect} from '@ej/ui'

  import enumerate from '~/js/enum'
  import {getClassify} from '~/utils/filter'
  import {formatDate} from '~/utils/date'
  import {validParams} from '~/utils'
  import QUERY_LIST from '~/graphql/query_templates.gql'
  import QUERY_QUESTIONS from '~/graphql/query_qustions.gql'
  import MUTATION_DEL from '~/graphql/mutation_template_del.gql'
  import EjList from '~/common-components/pagination-list'
  import GetAuth from '~/components/get-auth'

  Vue.use(SearchList)
  Vue.use(SearchOptionList)
  Vue.use(SearchOptionSelect)
  Vue.use(EjList)
  Vue.use(GetAuth)

  export default {
    name: 'TemplatesView',

    filters: {
      getClassify,
      formatDate,
    },

    data () {
      return {
        params: {
          keyword: '',
          classifyEnums: [null],
          templateTypeIds: [],
        },
        paramsPage: {
          offset: 0,
          limit: 10,
        },
        keyword: '',
        qualityList: [],
        classify: [],
        dataList: [],
        total: 0,
        loading: false,
      }
    },

    computed: {
      pageOptions () {
        return {
          currentPage: this.paramsPage.offset / this.params.limit + 1,
          limit: this.paramsPage.limit,
          total: this.total,
        }
      },
    },

    created () {
      this.getQuestions()
      this.classify = [enumerate.classify.map(it => ({
        value: it.value,
        label: it.name,
      }))]
    },

    methods: {
      getData (page) {
        if (page) {
          this.paramsPage.offset = (page - 1) * this.paramsPage.limit
        }
        let params = {
          offset: this.paramsPage.offset,
          limit: this.paramsPage.limit,
          keyword: this.keyword,
          classifyEnum: this.params.classifyEnums[0],
          templateTypeIds: this.params.templateTypeIds,
        }

        this.params.classifyEnums[0] && (params.classifyEnum = this.params.classifyEnums[0])
        this.$apollo.query({
          query: QUERY_LIST,
          fetchPolicy: 'no-cache',
          variables: {
            input: validParams(params),
          },
        }).then(res => {
          if (res) {
            let data = res.data.data
            this.dataList = data.data
            this.total = data.total
          }
        })
      },

      getQuestions () {
        this.$apollo.query({
          query: QUERY_QUESTIONS,
          fetchPolicy: 'network-only',
        }).then(res => {
          if (res) {
            this.qualityList = res.data.data.map(it => ({
              value: it.id,
              label: it.name,
            }))
          }
        })
      },

      getQual (val) {
        for (let it of this.qualityList) {
          if (it.value === val) {
            return it.label
          }
        }
        return '无'
      },

      del (id) {
        this.$apollo.mutate({
          mutation: MUTATION_DEL,
          variables: {
            id: [id],
          },
        }).then(res => {
          if (res) {
            let data = res.data.data
            if (data.type) {
              this.getData()
              this.$message({
                message: '操作成功',
                type: 'success',
              })
            } else {
              this.$message({
                message: data.message,
                type: 'warning',
              })
            }
          }
        })
      },

      delSure (id) {
        this.$confirm('确认删除', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }).then(() => {
          this.del(id)
        })
      },
    },
  }
</script>

<style lang="scss">
  .templates-view {
    .btn-add {
      width: 72px;
      height: 24px;
    }

    .desc {
      font-size: 13px;
      color: #777;
    }

    .other-info {
      &-item {
        width: 212px;
        font-size: 13px;
      }

      &-time {
        width: 140px;
      }
    }

    .templates-item {
      border-radius: 4px;

      &:hover {
        box-shadow: 0 2px 5px 4px rgba(71, 125, 233, .1);
      }
    }
  }
</style>
<style lang="scss">
  .templates-view {
    .ej-list-comp > :first-child {
      @apply px-md;
    }

    .list-content {
      .divider {
        border: none;
      }

      .list-content-item {
        padding: 0;
      }
    }

    .app-pagination {
      @apply mt-md;
    }

    .ej-search-input > .el-input__inner {
      height: 40px;
    }
  }

</style>
