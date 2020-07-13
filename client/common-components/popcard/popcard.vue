<template>
  <div class="common-popcard" @mouseenter="show" @mouseleave="hide">
    <slot name="img"/>
    <div class="position">
      <div class="box-postcard white-bg" v-show="visible" :style="{width: width + 'px'}">
        <div class="item item-title">
          <span v-if="imgUrl" class="card-img" :style="{backgroundImage: `url(${imgUrl})`}"></span>
          <img v-else src="~/assets/icon-account.svg" class="card-img img-def">
          <a :href="href" class="user-name">{{title}}</a>
          <slot name="action"></slot>
        </div>
        <slot name="main">
          <div class="item flex">
            <span class="label">ID：</span>
            <span>{{item.id}}</span>
          </div>
          <div class="item flex">
            <span class="label">联系电话：</span>
            <span>{{item.phone}}</span>
          </div>
          <div class="item flex">
            <span class="label">邮箱地址：</span>
            <span>{{item.email}}</span>
          </div>
          <div class="item flex">
            <span class="label">联系地址：</span>
            <span>{{item.address}}</span>
          </div>
        </slot>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'CommonPopcard',

    props: {
      imgUrl: {
        type: String,
      },

      href: {
        type: String,
        default: 'javascript:void(0)',
      },

      title: {
        type: String,
      },
      item: {
        type: Object,
      },
      width: {
        type: Number,
        default: 272,
      },
    },

    data () {
      return {
        visible: false,
      }
    },

    methods: {
      show () {
        this.visible = true
      },
      hide () {
        this.visible = false
      },
    },
  }
</script>

<style lang="scss">
  .common-popcard {
    display: inline-block;

    .position {
      position: relative;
    }

    .box-postcard {
      padding: 10px 20px;
      position: absolute;
      left: 0;
      top: 0;
      z-index: 100;
      color: rgba(102, 102, 102, 1);
      box-shadow: 0 2px 6px 3px rgba(0, 0, 0, 0.1);
    }

    .item {
      padding: 5px 0;
      height: 20px;
      display: flex;
      align-items: center;
    }

    .card-img {
      width: 20px;
      height: 20px;
      border-radius: 50%;
      background-size: cover;
    }

    .img-def {
      width: 16px;
    }

    .user-name {
      font-size: 14px;
      color: rgba(71, 125, 233, 1);
      margin-left: 5px;
      flex: 1;
    }
  }
</style>
