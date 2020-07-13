<template>
  <el-dialog width="920px"
             :visible.sync="visible$"
             :show-close="true"
             class="create-order-view"
             @close="closeBefore">
    <div class="order-main-wrap">
      <div class="order-title">工单申请</div>
      <el-steps class="my-steps" :active="step">
        <!--
          1.slot icon 放数组步骤和标题
          2.slot description 放描述
          3.处于当前步骤时，用class active
          -->
        <el-step class="steps-item" :class="{active: step === 1}" icon="el-icon-edit">
          <div slot="icon" class="steps-title">
            <span class="num">1</span>
            <span>基础信息</span>
          </div>
          <span slot="description" class="desc">填写工单基础信息</span>
        </el-step>
        <el-step class="steps-item" :class="{active: step === 2}" icon="el-icon-edit">
          <div slot="icon" class="steps-title">
            <span class="num">2</span>
            <span>检查规则</span>
          </div>
          <span slot="description" class="desc">关联质量规则</span>
        </el-step>
        <el-step class="steps-item" :class="{active: step === 3}" icon="el-icon-edit">
          <div slot="icon" class="steps-title">
            <span class="num">3</span>
            <span>辅助操作</span>
          </div>
          <span slot="description" class="desc">填写辅助操作内容</span>
        </el-step>
      </el-steps>

      <step-base class="order-main-center" :params.sync="baseParams" v-show="step === 1"></step-base>
      <step-rules :checkedList1.sync="ruleList" v-show="step === 2"></step-rules>
      <div class="order-main-center three-step" v-show="step === 3">
        <div class="form-item">
          <span class="label">问题推送：</span>
          <div>
            <el-checkbox v-model="otherParams.notice_email">邮件</el-checkbox>
            <el-checkbox v-model="otherParams.notice_phone">短信</el-checkbox>
            <el-checkbox v-model="otherParams.notice">通知</el-checkbox>
          </div>
        </div>
      </div>

      <div class="footer flex order-main-center">
        <a class="btn cancel" @click="close">取消</a>
        <a class="btn prev" v-if="step !== 1" @click="step--">上一步</a>
        <a class="btn next" v-if="step === 3" @click="ok">提交</a>
        <a class="btn next" v-else @click="next">下一步</a>
      </div>
    </div>
  </el-dialog>
</template>

<script>
  /*
   * 新建工单组件
   * 1.模态框组件
   *   1.没有尾部
   * 2.进度条组件
   * 3.分页
   */

  import Vue from 'vue'
  import {Checkbox, Dialog, Step, Steps} from 'element-ui'

  import enumerate from '~/js/enum'
  import ISSUE_ADD from '~/graphql/issue_add.gql'
  import StepBase from './base.vue'
  import StepRules from './rules.vue'

  Vue.use(Dialog)
  Vue.use(Steps)
  Vue.use(Step)
  Vue.use(Checkbox)

  export default {
    name: 'CreatOrder',

    components: {
      StepBase,
      StepRules,
    },

    props: {
      visible: Boolean,
    },

    data () {
      return {
        step: 1,
        baseParams: {
          title: '',
          cc: [],
          urgency: enumerate.rankList.normal.value,
          desc: '',
        },
        ruleList: [],
        // ruleList: [1, 2],
        otherParams: {
          pause: false,
          notice_type: 1,
          notice_email: true,
          notice_phone: false,
          notice: false,
        },
        isCancel: false,
      }
    },

    computed: {
      visible$: {
        get () {
          return this.visible
        },
        set (val) {
          this.$emit('update:visible', val)
        },
      },
    },

    methods: {
      close () {
        this.isCancel = true
        this.visible$ = false
      },
      initData () {
        this.step = 1
        this.baseParams = {
          title: '',
          cc: [],
          urgency: enumerate.rankList.normal.value,
          desc: '',
        }
        this.ruleList = []
        this.otherParams = {
          pause: false,
          notice_type: 1,
          notice_email: true,
          notice_phone: false,
          notice: false,
        }
      },
      next () {
        /*
        * 1.第一步
        *   标题：不为空
        *   描述：不为空
        *   发生日期：以前的
        * 2. 规则至少一条
        * */
        if (this.validate()) {
          this.step++
        }
      },
      ok () {
        let ids = this.ruleList.map(item => item.id)
        // todo：第三步 信息后端不接
        let params = Object.assign({}, this.baseParams)
        params.ids = ids
        console.log(params)
        this.$apollo.mutate({
          mutation: ISSUE_ADD,
          variables: {
            input: params,
          },
        }).then(data => {
          if (data) {
            this.close()
            this.$message({
              message: '操作成功',
              type: 'success',
            })
            this.$emit('createSuccess')
          }
        })
      },
      validate () {
        if (this.step === 1) {
          let baseParams = this.baseParams
          if (!baseParams.title) {
            this.$message({
              message: '请填写标题',
              type: 'warning',
            })
            return false
          }
          if (!baseParams.desc) {
            this.$message({
              message: '请填写事件描述',
              type: 'warning',
            })
            return false
          }
        } else if (this.step === 2) {
          if (!this.ruleList.length) {
            this.$message({
              message: '请至少选择一条规则',
              type: 'warning',
            })
            return false
          }
        }
        return true
      },
      closeBefore () {
        this.visible$ = true
        /*
        *  如果是 取消直接清空
        *  如果不是，且填写了信息
        *     询问用户是否清空
        *  */
        if (this.isCancel) {
          this.initData()
          this.isCancel = false
          this.visible$ = false
        } else {
          if (this.baseParams.title || this.baseParams.desc) {
            // 弹出询问
            this.$confirm('此操作将清空操作数据, 是否继续?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning',
            }).then(() => {
              this.initData()
              this.visible$ = false
            }).catch(() => {
              this.visible$ = false
            })
          } else {
            this.visible$ = false
          }
        }
        // 初始化状态
      },
    },
  }
</script>

<style lang="scss">
  @import "./commom";
  @import "../../style/variables";

  .create-order-view {
    .el-dialog__header {
      padding: 0;
    }

    .el-dialog__body {
      padding: 0;
    }

    .el-step__icon {
      height: auto;
    }

    .el-step__description {
      margin-top: 0;
    }

    .el-radio__input.is-checked + .el-radio__label {
      @apply text-blue;
    }

    .el-checkbox__inner {
      width: 16px;
      height: 16px;
    }

    .el-radio__input.is-checked .el-radio__inner, .el-checkbox__input.is-checked .el-checkbox__inner, .el-checkbox__input.is-indeterminate .el-checkbox__inner {
      @apply bg-blue border-blue;
    }

    .el-checkbox__input.is-checked + .el-checkbox__label, .el-checkbox__label {
      color: $color_333;
    }

    .el-checkbox {
      height: 20px;
      line-height: 20px;
    }
  }

  .el-button:active, .el-button:focus, .el-button:hover {
    border: 1px solid #DCDFE6;
    background: #FFF;
    color: $color_333;
  }

  .el-button--primary, .el-button--primary:hover, .el-button--primary:active, .el-button--primary:focus {
    @apply bg-blue border-blue text-white;
  }

  .el-dialog__headerbtn:focus .el-dialog__close, .el-dialog__headerbtn:hover .el-dialog__close, .el-message-box__headerbtn:hover .el-message-box__close {
    @apply text-blue;
  }

  .el-dialog__headerbtn {
    z-index: 100;
  }
</style>

<style lang="scss">
  @import "../../style/common";
  @import "./commom";

  .create-order-view {
    * {
      box-sizing: border-box;
    }

    .order-main-wrap {
      position: relative;
      padding: 25px 70px 32px;
      color: $black;
      height: 620px;
    }

    .order-main-center {
      margin: 0 auto;
      width: 610px;
    }

    .order-title {
      margin-bottom: 25px;
      height: 22px;
      line-height: 22px;
      font-size: $font-size-big;
      text-align: center;
    }

    .my-steps {
      margin-bottom: 20px;
      padding-left: 25px;

      .active .is-finish {
        .steps-title {
          @apply text-blue;
        }

        .num {
          @apply text-white bg-blue border-blue;
        }

        .desc {
          color: $color_333;
        }
      }

      .is-finish{
        .steps-title{
          @apply text-gray-darkest;
        }

        .num{
          @apply border-gray-darkest;
        }

        .desc {
          @apply text-gray-darkest;
        }
      }

      .steps-title {
        color: $color_9F9F9F;
        /*display: flex;*/
        align-items: center;
        background: $white;
        padding: 0 5px;
        margin-bottom: 8px;
      }

      .num {
        @apply inline-block;
        width: 20px;
        height: 20px;
        border-radius: 50%;
        border: 1px solid $color_9F9F9F;
        line-height: 18px;
        text-align: center;
        margin-right: 5px;
      }

      .desc {
        color: $color_9F9F9F;
        margin-left: 5px;
      }
    }

    .footer {
      position: absolute;
      bottom: 50px;
      left: 0;
      right: 0;
      justify-content: flex-end;

      .btn {
        width: 64px;
        height: 32px;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .cancel {
        border-color: $color_ccc;
        color: $color_333;
        margin-right: 30px;
      }

      .next {
        @apply bg-blue text-white border-blue;
      }

      .prev {
        border-color: $color_ccc;
        color: $color_333;
        margin-right: 15px;
      }
    }

    .three-step {
      height: 390px;

      .label {
        width: 70px;
        height: 20px;
        line-height: 20px;
      }
    }

    .el-step.is-horizontal .el-step__line {
      height: 1px;
    }
  }
</style>
