<template>
  <div class="audit-history-view">
    <div v-for="(item, index) in options" :key="index" class="flex audit-history-view__list">
      <div class="audit-history-view__user flex">
        <img :src="item.img" class="photo">
        <div class="base flex flex-col justify-center">
          <span>{{item.title}}</span>
          <span class="text-gray-dark">{{item.name}}</span>
        </div>
      </div>
      <div class="audit-history-view__info">
        <div class="info flex">
          <p>审批时间<span class="text-blue pl-xs">{{item.timestamp | formatDate}}</span></p>
          <p>历时约<span class="text-blue pl-xs">{{item.duration | humanizeTime}}</span></p>
          <p>{{attachmentLen(item) ? `有${attachmentLen(item)}附件` : '暂无附件'}}</p>
        </div>
        <div>审批意见：
          <slot name="attachment" :options="item.attachment" :content="item.content" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import {formatDate, humanizeTime} from '~/utils/date'
  export default {
    name: 'AuditHistory',

    filters: {
      humanizeTime,
      formatDate,
    },

    props: {
      options: {
        type: Array,
        default: () => [],
      },
    },

    methods: {
      attachmentLen (item) {
        return item.attachment ? item.attachment.length : 0
      },
    },
  }
</script>

<style lang="scss">
  .audit-history-view {
    padding: 20px;
    font-size: 12px;

    &__list {
      line-height: 20px;
      padding-bottom: 40px;
      position: relative;
      overflow: hidden;

      &::after {
        content: '';
        position: absolute;
        left: 17.45px;
        top: 30px;
        width: 1px;
        height: 100%;
        /*background: theme('colors.blue.default');*/
      }

      &:last-child {
        padding-bottom: 0;

        &::after {
          display: none;
        }
      }
    }

    &__user {
      width: 200px;

      .photo {
        width: 36px;
        height: 36px;
        margin-right: 11px;
      }

      .base {
        height: 36px;
        font-size: 12px;
        line-height: 20px;
      }
    }

    &__info {
      .info {
        & > * {
          margin-right: 1.5em;
        }
      }
    }
  }
</style>
