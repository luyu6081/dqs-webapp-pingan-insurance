<template>
  <div class="quality-main-view" :class="{'edit': setting}">
    <div class="mb-xs">
      <span class="font-black pr-sm">{{title}}</span>
      <span>（近3个月数据）</span>
    </div>
    <table class="my-table">
      <tr v-for="(it, idx) of data" :key="idx">
        <td class="td-1">{{subTitle}}</td>
        <td class="td-2">
          <div v-if="!isOrder" class="score">
            <input type="text" v-model="it.startProportion" @input="edit(it, idx)" class="text-center text-blue input-events">
            <span>-</span>
            <input type="text" v-model="it.endProportion" @input="edit(it, idx)" class="text-center text-blue input-events">
          </div>
          <div v-else class="score order">
            <input type="text" v-model="it.number" @input="edit(it, idx)" class="text-center text-blue input-events">
          </div>
        </td>
        <td class="td-3">得分（分）</td>
        <td class="td-4">
          <div class="text-blue text-center score">
            <input type="text" v-model="it.score" @input="edit(it, idx)" class="text-center text-blue input-events">
          </div>
        </td>
        <td v-if="!isOrder && setting">
          <a href="javascript:" @click="add" class="icon-btn"><i class="el-icon-plus"></i></a>
          <a href="javascript:" @click="del(idx)" class="ml-sm icon-btn" :class="{'pointer-events': data.length === 1}"><i class="el-icon-minus"></i></a>
        </td>
      </tr>
    </table>
  </div>
</template>

<script>
  /*
  * 1.查：
  *   1.传入列表数据，编辑编辑还是查看，标题，二级标题
  *   2.方法，增，删，改
  * 增删改 */
  export default {
    name: 'quality-main',

    props: {
      title: {
        type: String,
      },
      subTitle: {
        type: String,
      },
      data: {
        type: Array,
        default: () => [],
      },
      setting: {
        type: Boolean,
      },
      isOrder: {
        type: Boolean,
        default: false,
      },
    },

    methods: {
      add () {
        this.$emit('add')
      },
      del (idx) {
        this.$emit('del', idx)
      },
      edit (it, idx) {
        this.$emit('edit', it, idx)
      },
    },
  }
</script>

<style lang="scss">
  .quality-main-view {

    input{
      height: 30px;
      padding: 0 3px;
      pointer-events: none;
      border: none;
    }

    input:focus{
      outline: none;
    }

    .my-table {
      td{
        padding: 0 0 4px 0;
      }

      .score {
        @apply flex items-center justify-center;
      }

      .td-1, .td-3 {
        padding-right: 10px;
      }

      .td-2, .td-4{
        padding-right: 40px;
      }

      .td-2 {
        input{
          width: 60px;
        }

        .order{
          input{
            width: 127px;
          }
        }
      }

      .td-4 {
        input{
          width: 110px;
        }
      }

      .score {
        border: 1px solid transparent;
        border-bottom-color: theme('colors.gray.light');
      }

      .icon-btn{
        height: 28px;
        width: 28px;
        display: inline-flex;
        border: 1px solid theme('colors.gray.light');
        align-items: center;
        justify-content: center;
      }
    }

    &.edit{
      .score {
        border-color: theme('colors.gray.light');
        border-radius: 4px;
      }

      .input-events{
        pointer-events: auto;
      }
    }

    .pointer-events{
      @apply pointer-events-none text-gray-light;
    }
  }
</style>
