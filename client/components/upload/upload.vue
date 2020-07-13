<template>
  <el-upload
    :action="action"
    class="upload-view"
    multiple
    :file-list="fileList$"
    :limit="3"
    :before-upload="beforeUpload"
    :http-request="handleUpload"
    :before-remove="beforeRemove"
    :on-remove="handleRemove"
  >
    <a href="javascript:" class="action">上传文件</a>
    <div slot="tip" class="el-upload__tip">支持格式：.rar .zip .doc .docx .pdf .jpg...</div>
  </el-upload>
</template>

<script>
  /* 上传组件 增删改，查看
  * todo: 待做
  *  双向数据绑定
  * 支持传入 + 增删查
  * 如何不传入是可以
  * */
  import Vue from 'vue'
  import {Upload} from 'element-ui'

  Vue.use(Upload)
  export default {
    name: 'EjUpload',

    props: {
      fileList: {
        type: Array,
        default: () => {},
      },
    },

    data () {
      return {
        // todo: 配置到环境变量中
        action: 'https://dfjx.com',
        fileList$: this.fileList,
      }
    },

    methods: {
      handleRemove (file, fileList) {
        this.$emit('remove', file)
      },
      beforeRemove (file, fileList) {
        return this.$confirm(`确定移除 ${file.name}？`)
      },
      beforeUpload (file) {
        this.addFile = file
      },
      handleUpload () {
        // todo: 自定义上传 apollo 上传 返回上传数据
        // this.$apollo.mutate({
        //   mutation: '',
        //   variables: {
        //     input: this.addFile,
        //   },
        // }).then(res => {
        //   this.emit('addFile', res.data.data)
        // })
        this.$emit('addFile', this.addFile)
      },
    },
  }
</script>

<style lang="scss">
  .upload-view{
    .action{
      @apply inline-flex items-center justify-center text-blue bg-blue-lighter;
      width: 100px;
      height: 24px;
    }
  }

</style>
