<template>
  <div class="rules-result pt-sm">
    <p v-if="detailInfo.target" class="check-rules-name mb-sm flex">
      <span>检查对象名称：{{detailInfo.target | getTarget}}</span>
      <a href="javascript:" @click="gotoMds(detailInfo.target.tableId)" class="ml-sm text-blue">影响分析</a>
    </p>
    <div class="tag-wrap">
      <span class="tag-title">标签：</span>
      <ej-tag-list v-model="detailInfo.tags"
                   @tag-create="handleTagCreate"
                   @tag-score="handleTagScore"
                   @tag-remove="handleTagRemove"/>
    </div>
    <div>
      <el-row>
        <el-col :span="11" class="info-wrap">检查类型：{{detailInfo.checkTypeId}}</el-col>
        <el-col :span="13" class="info-wrap">
          检查任务状态：{{detailInfo.rc | getRuleExecuteStatus}}
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="11" class="info-wrap">最后修改日期：{{detailInfo.modifyTm | formatDate}}</el-col>
        <el-col :span="13" class="info-wrap">执行阶段：{{detailInfo.executeStageId}}</el-col>
      </el-row>
      <el-row>
        <el-col :span="11" class="info-wrap">ETL任务名称：{{detailInfo.etlJobName}}</el-col>
        <el-col :span="13" class="info-wrap">
          检查结果临时目标表：
          <div class="temp-table-wrap dotted">
            {{detailInfo.checkResultTemporaryTable}}
            <!--todo: 暂时隐藏，数据来源不清楚-后端-->
            <temp-table-panel v-if="false" :checkTempInfo="rulesResultInfo.checkTempInfo"/>
          </div>
        </el-col>
      </el-row>
      <el-row>
        <!--        <el-col :span="11" class="info-wrap">临时结果保留记录数：{{detailInfo.resultTemporaryNumber}}</el-col>-->
        <el-col :span="11" class="info-wrap">临时结果保留天数：{{detailInfo.resultTemporaryDay}}</el-col>
      </el-row>
    </div>
    <div class="text-wrap">
      <div>
        <span class="info-wrap">检查 SQL：</span>
        <div v-if="detailInfo.template" :span="20" class="info-wrap rule-card">
          <ej-highlight :code="detailInfo.template.script" language="sql" :key="highlightKey"/>
        </div>
      </div>

      <div>
        <span class="info-wrap">检查规则明细：</span>
        <!--TODO: 明细改成列表-->
        <el-table v-if="detailInfo.templateParams" :data="detailInfo.templateParams" height="260" style="width: 100%" class="my-table-info">
          <el-table-column type=index label="序号"/>
          <el-table-column prop="name" label="字段名"/>
          <el-table-column prop="description" label="描述"/>
          <el-table-column prop="val" label="变量值"/>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script>
  import Vue from 'vue'
  import {Col as ElCol, Row as ElRow, Table, TableColumn} from 'element-ui'
  import {Highlight} from '@ej/ui'
  import enumerate from '~/js/enum'
  import QUERY_TAG_ADD from '~/graphql/tag_add.gql'
  import QUERY_TAG_DEL from '~/graphql/tag_del.gql'
  import QUERY_TAG_LIKE from '~/graphql/tag_like.gql'
  import {getTarget} from '~/utils'
  import {gotoMds} from '~/utils/goto'
  import {formatDate} from '~/utils/date'
  import {getRuleExecuteStatus} from '~/utils/filter'
  import TagListNew from '~/components/tag-list'
  import TempTablePanel from './temp-table-panel.vue'

  Vue.use(Table)
  Vue.use(TableColumn)
  Vue.use(Highlight)
  Vue.use(TagListNew)

  export default {
    name: 'RulesResult',

    components: {
      ElRow,
      ElCol,
      TempTablePanel,
    },

    filters: {
      getTarget,
      getRuleExecuteStatus,
      formatDate,
    },

    props: {
      rulesResultInfo: Object,
      detailInfo: {},
    },

    data () {
      return {
        taskStatus: enumerate.taskStatus,
        highlightKey: 0,
      }
    },

    watch: {
      'detailInfo.template.script' () {
        this.highlightKey++
      },
    },

    methods: {
      handleTagCreate (val) {
        this.$apollo.mutate({
          mutation: QUERY_TAG_ADD,
          variables: {
            input: {
              scheduleId: this.$route.params.ruleId,
              tagName: val,
            },
          },
        }).then(data => {
          this.detailInfo.tags.push(data.data.data)
          this.$message({
            message: '操作成功',
            type: 'success',
          })
          // 更新列表
          this.$store.commit('updateReloadRules', true)
        })
      },
      handleTagScore (tag, idx) {
        this.$apollo.mutate({
          mutation: QUERY_TAG_LIKE,
          variables: {
            input: {
              scheduleId: this.$route.params.ruleId,
              tagId: tag.id,
              isOperations: !tag.voted,
              /* todo: 后期去掉字段,去掉时测试是否报错，后端设置非空 */
              tagName: '',
            },
          },
        }).then(data => {
          tag.voted = !tag.voted
          if (tag.voted) {
            tag.score++
          } else {
            tag.score--
          }
          this.$set(this.detailInfo.tags, idx, tag)
          this.$message({
            message: '操作成功',
            type: 'success',
          })
        })
      },
      handleTagRemove (tag, idx) {
        this.$apollo.mutate({
          mutation: QUERY_TAG_DEL,
          variables: {
            scheduleId: this.$route.params.ruleId,
            tagId: tag.id,
          },
        }).then(data => {
          this.detailInfo.tags.splice(idx, 1)
          this.$message({
            message: '操作成功',
            type: 'success',
          })
          this.$store.commit('updateReloadRules', true)
        })
      },
      gotoMds,
    },
  }
</script>

<style lang="scss">
  @import '../../style/variables.scss';

  .rules-result {
    .dotted {
      border-bottom: 1px dotted $black;
    }

    .tag-wrap {
      display: flex;
    }

    .tag-title {
      width: 50px;
      line-height: 22px;
    }

    .rules-tag {
      max-width: none;
      flex: 1;
      display: flex;

      .new-tag-wrap {
        z-index: 2;
      }
    }

    .temp-table-wrap {
      display: inline-block;
      position: relative;

      &:hover {
        .temp-table {
          display: block;
        }
      }
    }

    .check-rules-name {
      font-size: $font-size-normal;
      color: $black;
      line-height: 18px;
      letter-spacing: .5px;
    }

    .text-wrap {
      .rule-card {
        flex: 1;
        height: 380px;
        border: 1px solid $color_d6d6d6;
        overflow-y: auto;
      }
    }

    .info-wrap {
      font-size: $font-size-13;
      color: $black;
      line-height: 22px;
    }

    .text-wrap {
      & > div {
        margin-top: 16px;
        display: flex;

        & > span {
          display: inline-block;
          vertical-align: top;
          width: 10em;
        }
      }
    }

    .my-table-info{
      thead th{
        padding-top: 0;
      }
    }
  }
</style>
