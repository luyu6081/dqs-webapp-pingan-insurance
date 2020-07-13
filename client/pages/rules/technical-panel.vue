<template>
  <div :span="12" class="technical-panel clearfix">
    <span class="fl">{{label}}：</span>
    <ej-user-card :data="data$" has-email @mail="mail">
      <div slot="img" class="info-wrap">
        <div class="info-img">
          <img :src="data$.userAvatar" class="img"/>
        </div>
        <div>
          <span class="technical-leader fl">{{data$.name}}</span>
        </div>
      </div>
    </ej-user-card>
  </div>
</template>

<script>
  import Vue from 'vue'
  import {UserCard} from '@ej/ui'

  import {toImgHref} from '~/utils'

  Vue.use(UserCard)

  export default {
    name: 'TechnicalPanel',

    props: {
      technicalInfo: {
        type: Object,
        default: () => {},
      },
      label: {
        type: String,
      },
    },

    data () {
      return {
        isShowCard: false,
      }
    },

    computed: {
      data$ () {
        return {
          userId: this.technicalInfo.id,
          name: this.technicalInfo.name,
          position: this.technicalInfo.position,
          userAvatar: toImgHref(this.technicalInfo.avatar), // `http://mds-all-frontier.jinxin.cloud/fileDownload?ambryId=${}&show=true`, // this.technicalInfo.avatar,
          jobNumber: this.technicalInfo.jobNumber,
          phone: this.technicalInfo.phone,
          telephone: this.technicalInfo.telephone || '--',
          department: this.technicalInfo.depts,
          userAddress: this.technicalInfo.address,
          email: this.technicalInfo.email,
        }
      },
    },

    methods: {
      mail (val) {
        console.log('mail')
      },
    },
  }
</script>

<style lang="scss">
  @import '../../style/variables.scss';

  .technical-panel {
    position: relative;

    .technical-leader {
      color: $blue !important;
      margin-left: 8px;
    }

    .common-popcard .box-postcard {
      left: -120px !important;
      background: $white;
    }

    .common-popcard {
      vertical-align: top;
    }

    .info-wrap {
      display: flex;
    }

    .info-img {
      width: 20px;
      height: 20px;
      border-radius: 50%;
      overflow: hidden;
      background: $color_9FBFFF;
      flex: none;

      .img {
        width: 100%;
        height: 100%;
        background-size: cover;
      }

      .email {
        width: 20px;
        height: 16px;
      }
    }
  }
</style>
