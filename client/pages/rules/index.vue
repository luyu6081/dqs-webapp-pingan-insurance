<template>
  <div class="rules-view px-md">
    <!-- 左半部分 -->
    <div class="left">
      <ej-search-list v-if="targetTree.length"
                      :models.sync="params"
                      :keyword.sync="keyword"
                      max-width-tag="325px"
                      :default-tag-more="true"
                      @search="getData(1)"
                      :view-id="1"
                      class="my-search-list">
        <template>
          <ej-search-option-cascader prop="target"
                                     v-model="params.target"
                                     label="检查对象"
                                     :options="targetTree"/>
          <ej-search-option-select prop="opts"
                                   v-model="params.opts"
                                   label="过滤条件"
                                   :select-props="[
                                      {placeholder: '执行结果状态'},
                                      {placeholder: '运行状态'}
                                   ]"
                                   :options="options"/>
        </template>
      </ej-search-list>
      <div class="relative">
        <el-tabs v-model="paramsType" @tab-click="getData()" class="mt-sm my-tabs">
          <el-tab-pane v-for="(it, idx) of tabList" :key="idx" :label="it.label" :name="it.name"></el-tab-pane>
        </el-tabs>
        <div class="actions flex action-icon">
          <get-auth data="dqsScheduleAdd">
            <router-link :to="{name: 'rule-edit', params: {id: 0}}"><i class="el-icon-document-add text-lg"></i>
            </router-link>
          </get-auth>
          <get-auth data="dqsScheduleRemove">
            <a href="javascript:" @click="delSure()" class="ml-xs"><i class="el-icon-delete ml-xs text-lg"></i></a>
          </get-auth>
          <get-auth data="dqsScheduleRun">
            <a href="javascript:" @click="plays(true)" class="ml-xs"><i
              class="el-icon-video-play ml-xs text-lg"></i></a>
          </get-auth>
          <get-auth data="dqsScheduleRun">
            <a href="javascript:" @click="plays(false)" class="ml-xs"><i class="el-icon-video-pause ml-xs text-lg"></i></a>
          </get-auth>
        </div>
      </div>
      <ej-list ref="multipleList"
               :data="dataList"
               v-model="ids"
               selectable
               :total="total"
               class="my-list"
               :pagination="{position: 'right', ...pageOptions}"
               @current-page-change="getData">
        <div slot="header"></div>
        <div slot="footer"></div>
        <div slot="suffix"></div>
        <template #default="{data}">
          <div class="rule-item flex-1">
            <div class="flex items-center rule-title-warp">
              <div class="flex items-center rule-title flex-1">
                <com-tooltip :html="data.item.name">
                  <router-link :to="{name: 'rule-detail', params: {ruleId: data.item.id}}"
                               v-html="data.item.name"
                               class="text-blue rule-title-text single root-highlight"/>
                </com-tooltip>
                <i v-if="!data.item.rc === ruleExecuteStatusList.normal.value"
                   class="el-icon-s-opportunity text-red ml-sm"></i>
                <i v-if="data.item.runningState" class="el-icon-video-play text-green ml-sm"></i>
              </div>
              <div class="rule-item-actions flex ml-md action-icon">
                <get-auth data="dqsScheduleUpdate">
                  <router-link :to="{name: 'rule-edit', params: {id: data.item.id}}"><i
                    class="el-icon-edit text-lg"></i></router-link>
                </get-auth>
                <get-auth data="dqsScheduleRemove">
                  <a href="javascript:" @click="delSure(data.item)" class="ml-xs"><i
                    class="el-icon-delete ml-xs text-lg"></i></a>
                </get-auth>
                <get-auth data="dqsScheduleRun">
                  <a href="javascript:" @click="play(data.item)" class="ml-xs"><i
                    class="ml-xs text-lg"
                    :class="data.item.runningState ? 'el-icon-video-pause' : 'el-icon-video-play'"></i></a>
                </get-auth>
              </div>
            </div>
            <p class="mb-xs text-gray-darker text-sm root-highlight">检查对象：<span
              v-html="getTarget(data.item.target)"></span></p>
            <div class="flex text-sm">
              <span class="people">技术负责人：{{data.item.techLinkman.name}}</span>
              <span class="people">业务负责人：{{data.item.busiLinkman.name}}</span>
              <div>
                <span>最近执行日期：</span>
                <span class="text-gray-dark">{{data.item.taskRunTime | formatDate('YYYY-MM-DD')}}</span>
              </div>
            </div>
            <div v-if="data.item.starred || data.item.tags.length" class="tags mt-sm single">
              <a v-if="data.item.starred" href="javascript:" class="dqs-btn btn-rule">已关注</a>
              <a href="javascript:" v-for="(it, idx) of data.item.tags" :key="idx" class="dqs-btn btn-rule">{{it.tagName}}</a>
            </div>
          </div>
        </template>
      </ej-list>
    </div>

    <!-- 右半部分 -->
    <div class="right">
      <div v-if="$route.name === 'rule-index'">
        <div class="no-data">
          <img src="~/assets/no-data.svg" class="no-data-img">
          <p>暂无数据</p>
        </div>
      </div>
      <nuxt v-else/>
    </div>
  </div>
</template>

<script>
  import Vue from 'vue'
  import {Tabs, TabPane} from 'element-ui'
  import {SearchList, SearchOptionList, SearchOptionSelect, SearchOptionCascader} from '@ej/ui'

  import RULE_LIST from '~/graphql/rule_list.gql'
  import QUERY_TARGET from '~/graphql/query_target.gql'
  import MUTATION_DEL from '~/graphql/mutation_rule_del.gql'
  import MUTATION_RUN from '~/graphql/mutation_rule_run.gql'
  import {formatDate} from '~/utils/date'
  import {toTreeData} from '~/utils/toTree'
  import {getTarget} from '~/utils'

  import enumerate from '~/js/enum'

  import EjList from '~/common-components/pagination-list'
  import GetAuth from '~/components/get-auth'
  import ComTooltip from '~/components/tooltip'

  Vue.use(SearchList)
  Vue.use(SearchOptionList)
  Vue.use(SearchOptionSelect)
  Vue.use(SearchOptionCascader)
  Vue.use(Tabs)
  Vue.use(TabPane)
  Vue.use(EjList)
  Vue.use(GetAuth)
  Vue.use(ComTooltip)

  export default {
    name: 'RuleIndexView',

    filters: {
      formatDate,
    },

    data () {
      return {
        searchPlaceholder: '请输入内容',
        tabList: [{
          name: 'ALL',
          label: '全部',
        }, {
          name: 'RELATED',
          label: '与我相关的规则',
        }, {
          name: 'STARRED',
          label: '收藏与订阅',
        }],
        params: {
          // 检索内容
          // applyId: null, // 数据类型
          // systemId: null, // 所属系统
          // databaseId: null, // 所属应用
          target: [],
          opts: [null, null],
        },
        keyword: '',
        paramsType: 'ALL',
        paramsPage: {
          offset: 0,
          limit: 5,
        },
        total: 0,
        dataList: [],
        options: [],
        targetTree: [],
        ids: [],
        ruleExecuteStatusList: enumerate.ruleExecuteStatusList,
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

    watch: {
      '$store.state.reloadRules' (val) {
        if (val) {
          this.$store.commit('updateReloadRules', false)
          this.getData()
        }
      },
    },

    created () {
      this.options = [
        enumerate.ruleExecuteStatusList.map(it => ({
          value: it.value,
          label: it.name,
        })),
        enumerate.ruleStatus.map(it => ({
          value: it.val,
          label: it.name,
        })),
      ]
      this.getMdsTarget()
      this.getData()
    },

    methods: {
      getTarget,
      getData (page) {
        if (page) {
          this.paramsPage.offset = (page - 1) * this.paramsPage.limit
        }
        let params = Object.assign({}, this.paramsPage, {
          keyword: this.keyword,
          applyId: this.params.target[0],
          systemId: this.params.target[1],
          databaseId: this.params.target[2],
          type: this.paramsType,
        })
        let opts = this.params.opts
        opts[0] && (params.rc = opts[0])
        let itState = enumerate.ruleStatus.find(it => it.val === opts[1])
        if (itState) {
          params.runningStateEnum = itState.value
        }
        this.$apollo.query({
          query: RULE_LIST,
          fetchPolicy: 'no-cache',
          variables: {
            input: params,
          },
        }).then(res => {
          if (res) {
            let data = res.data.data
            this.dataList = data.data
            this.total = data.total
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
            const delNullChildren = (data) => {
              for (let it of data) {
                if (!it.children.length) {
                  delete it.children
                } else {
                  delNullChildren(it.children)
                }
              }
            }
            // todo: 处理对象成树
            let targetTree = toTreeData(res.data.data, {
              rootId: '0',
              id: 'id',
              name: 'name',
              parentId: 'parentId',
            })
            // 删除为空的children
            delNullChildren(targetTree)
            this.targetTree = targetTree
          }
        })
      },

      delSure (item) {
        if (!item && this.ids.length === 0) {
          this.$message({
            message: '请选择删除信息',
          })
          return
        }
        this.$confirm('确认删除', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }).then(() => {
          this.del(item)
        })
      },

      del (item) {
        this.$apollo.mutate({
          mutation: MUTATION_DEL,
          variables: {
            id: item ? [item.id] : this.ids.map(it => it.id),
          },
        }).then(res => {
          if (res) {
            if (res.data.data) {
              this.getData()
              this.$message({
                message: '操作成功',
                type: 'success',
              })
              // todo: 清空数据
              if (item) {
                this.$refs.multipleList.select(item, false)
              } else {
                this.$refs.multipleList.selectNone()
              }
            }
          }
        })
      },
      play (item) {
        this.playApl({
          id: [item.id],
          state: !item.runningState,
        }, item)
      },
      plays (state) {
        if (!this.ids.length) {
          this.$message.warning({
            message: '请选择规则',
          })
          return
        }

        this.playApl({
          id: this.ids.map(it => it.id),
          state: state,
        })
      },
      playApl (params, item) {
        this.$apollo.mutate({
          mutation: MUTATION_RUN,
          variables: params,
        }).then(res => {
          if (res) {
            if (res.data.data) {
              this.getData()
              this.$message({
                message: '操作成功',
                type: 'success',
              })
              // todo: 清空数据
              if (item) {
                this.$refs.multipleList.select(item, false)
              } else {
                this.$refs.multipleList.selectNone()
              }
            }
          }
        })
      },
    },
  }
</script>

<style lang="scss">
  @import '../../style/variables.scss';

  .rules-view {
    flex: auto;
    display: flex;
    width: 100%;

    > .left,
    > .right {
      display: flex;
      flex-direction: column;
      padding: 15px 20px;
    }

    .left {
      width: 530px;
      background: $white;
    }

    .right {
      flex: 1 1 1px;
      min-width: 620px;
      margin-left: 5px;
      position: relative;
      background: $white;
      box-sizing: border-box;
    }

    .modify-tm {
      min-width: 200px;
    }

    .no-data {
      display: flex;
      align-items: center;
      flex-direction: column;
      padding: 188px 0;

      .img {
        width: 144px;
        height: 149px;
      }

      p {
        @apply text-gray ;

        margin-top: 15px;
      }
    }

    .list-content-item {
      @apply py-sm px-xs;
      border-radius: 4px;

      &:hover {
        box-shadow: 0 2px 5px 4px rgba(71, 125, 233, .1);
      }

      .people {
        width: 140px;
      }

      .btn-rule {
        @apply bg-blue-lighter border-blue-lighter px-xs text-sm text-gray-darkest;

        height: 18px;
      }

      .tags > * + * {
        @apply ml-sm;
      }

      .tags {
        width: 430px;
      }

      .rule-title-text {
        max-width: 360px;
      }

      .rule-title-warp {
        margin-bottom: 8px;
      }
    }

    .left {
      .actions {
        position: absolute;
        right: 0;
        bottom: 15px;
      }

      .action-icon {
        color: #777;
      }
    }
  }
</style>

<style lang="scss">
  .rules-view {
    .my-search-list {
      .ej-search-input {
        width: 340px !important;
      }
    }

    .my-tabs {
      .el-tabs__item {
        height: 30px;
        line-height: 30px;
      }
    }

    .list-content {
      .divider {
        border: none;
      }
    }

    .app-pagination {
      @apply mt-md;
    }

    .el-link.el-link--default:after, .el-link.el-link--primary.is-underline:hover:after, .el-link.el-link--primary:after {
      @apply border-blue;
    }

    .ej-search-input > .el-input__inner {
      height: 40px;
    }
  }
</style>
