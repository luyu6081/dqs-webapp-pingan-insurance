<template>
  <div class="setting-quality-view">
    <div class="flex">
      <span class="text-lg font-black mb-sm flex-1">数据质量评分体系库</span>
      <a href="javascript:" @click="setting = !setting" class="dqs-btn setting-btn">设置</a>
    </div>
    <div class="desc mb-5">注：数据质量分=100-错误分-工单分 （数据质量满分100分）</div>
    <qualityMain title="错误分"
                 subTitle="错误占比（%）"
                 @del="delErr"
                 @add="addErr"
                 @edit="editErr"
                 :data="errorList"
                 :setting="setting"
                 class="mb-md"/>
    <qualityMain title="工单分"
                 subTitle="工单数量（条）"
                 @edit="editOrder"
                 :is-order="true"
                 :data="orderList"
                 :setting="setting"/>
    <div v-if="setting" class="flex flex-row-reverse mt-xl">
      <a href="javascript:" @click="save" class="dqs-btn ml-md btn-action">确认</a>
    </div>
  </div>
</template>

<script>
  import Lodash from 'lodash'
  import QUERY_ERR from '~/graphql/query_quality_err_score.gql'
  import QUERY_ORDER from '~/graphql/query_rule_score.gql'
  import MUTATION_EDIT from '~/graphql/mutation_setting_quality.gql'

  import QualityMain from './quality-main'

  export default {
    name: 'quality',

    components: {
      QualityMain,
    },

    data () {
      return {
        setting: false,
        errorList: [],
        orderList: [],
      }
    },

    created () {
      this.getErrData()
      this.getOrderData()
    },

    methods: {
      addErr () {
        this.errorList.push({
          startProportion: 0,
          endProportion: 0,
          score: 0,
        })
      },
      editErr (it, idx) {
        this.$set(this.errorList, idx, it)
      },
      delErr (idx) {
        this.errorList.splice(idx, 1)
      },
      editOrder (it, idx) {
        this.$set(this.orderList, idx, it)
      },
      save () {
        let errorList = this.errorList.map(it => ({
          startProportion: it.startProportion / 100,
          endProportion: it.endProportion / 100,
          score: it.score,
        }))
        let order = this.orderList[0]
        this.$apollo.mutate({
          mutation: MUTATION_EDIT,
          variables: {
            input: {
              errorScoreInputs: errorList,
              issueScoreInput: order,
            },
          },
        }).then(res => {
          if (res.data.data) {
            this.$message({
              message: '操作成功',
              type: 'success',
            })
            this.getErrData()
            this.getOrderData()
          }
        })
      },
      getErrData () {
        this.$apollo.query({
          query: QUERY_ERR,
          fetchPolicy: 'network-only',
        }).then(res => {
          if (res) {
            let data = res.data.data
            this.errorList = data.length ? data.map(it => ({
              startProportion: Lodash.round(it.startProportion * 100),
              endProportion: Lodash.round(it.endProportion * 100),
              score: it.score,
            })) : [{
              startProportion: 0,
              endProportion: 0,
              score: 0,
            }]
          }
        })
      },
      getOrderData () {
        this.$apollo.query({
          query: QUERY_ORDER,
          fetchPolicy: 'network-only',
        }).then(res => {
          if (res) {
            let data = res.data.data
            this.orderList = [{
              // id: data.id,
              number: data.number,
              score: data.score,
            }]
          }
        })
      },
    },
  }
</script>

<style lang="scss">
  .setting-quality-view {
    .desc {
      font-size: 15px;
    }

    .setting-btn {
      @apply bg-blue-lighter border-blue-lighter text-blue text-sm;

      width: 58px;
      height: 24px;
      border-radius: 4px;
    }

    .btn-action {
      width: 64px;
      height: 26px;
    }
  }
</style>
