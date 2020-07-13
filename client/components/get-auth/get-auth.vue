<template>
    <div class="inline-flex" v-if="visible">
      <slot></slot>
    </div>
</template>

<script>
  import {mapGetters} from 'vuex'
  export default {
    name: 'GetAuth',

    props: {
      data: {
        type: String,
      },
    },

    computed: {
      ...mapGetters([
        'userData',
      ]),

      visible () {
        if (this.userData.permissionCodes) {
          return this.userData.permissionCodes.indexOf(this.data) !== -1
        }
        return false
      },
    },
  }
</script>
