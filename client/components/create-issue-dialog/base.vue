<template>
  <div class="order-base-view">
    <el-form>
      <el-form-item>
        <div class="form-item require-item">
          <span class="form-label">标题：</span>
          <el-input size="mini" v-model="params.title"></el-input>
        </div>
      </el-form-item>
      <el-form-item>
        <div class="form-item form-copy require-item">
          <span class="form-label">抄送人：</span>
          <div class="select-wrap">
            <auth-user v-model="params.cc"></auth-user>
          </div>
        </div>
      </el-form-item>
      <el-form-item>
        <div class="form-item my-radio require-item">
          <span class="form-label">级别：</span>
          <el-radio-group v-model="params.urgency">
            <el-radio v-for="(item, key) in rankList" :key="key" :label="item.value">{{item.name}}
            </el-radio>
          </el-radio-group>
        </div>
      </el-form-item>
      <el-form-item>
        <div class="form-item desc require-item">
          <span class="form-label">事件描述：</span>
          <el-input type="textarea" size="mini" rows="7" v-model="params.desc"></el-input>
        </div>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import Vue from 'vue'
  import {DatePicker, Form, FormItem, Radio, RadioGroup} from 'element-ui'

  import enumerate from '~/js/enum'
  import AuthUser from '~/components/auth-user'

  Vue.use(Form)
  Vue.use(FormItem)
  Vue.use(DatePicker)
  Vue.use(RadioGroup)
  Vue.use(Radio)

  export default {
    name: 'StepBase',

    components: {
      AuthUser,
    },

    props: {
      params: {
        type: Object,
      },
    },

    data () {
      return {
        rankList: enumerate.rankList,
        copy_name: '',
      }
    },

    watch: {
      params: {
        deep: true,
        handler (val) {
          this.$emit('update:params', val)
        },
      },
    },
  }
</script>

<style lang="scss">
  @import "./commom";

  .order-base-view {
    * {
      box-sizing: border-box;
    }

    .form-item {
      .form-label {
        min-width: 140px;
        text-align: right;
      }

      .my-input, .my-textarea {
        flex: 1;
        border-radius: 4px;
        padding: 5px 12px;
      }

      .my-input {
        height: 24px;
        line-height: 24px;
      }
    }

    .my-date-picker {
      input {
        padding-right: 30px;
      }
    }

    .desc {
      .form-label {
        align-self: flex-start;
      }
    }

    .my-radio {
      margin-bottom: 30px;
    }

    .form-copy {
      @apply items-start;
      .form-label {
        padding-top: 1px;
      }
    }

    .select-wrap {
      .el-select__tags {
        max-width: none !important;
        max-height: 100px;
        overflow-y: auto;
      }
    }
  }
</style>

<style lang="scss">
  .order-base-view {
    .el-form-item__content {
      line-height: unset;
    }

    .el-form-item {
      margin-bottom: 0;
    }

    .el-input__icon {
      line-height: 24px;
    }

    .el-input__prefix {
      right: 5px;
      left: unset;
    }
  }
</style>
