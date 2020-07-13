<template>
  <el-card class="temp-table">
    <h3>检查结果临时目标表信息</h3>
    <div class="column-info">
      <el-row>
        <el-col :span="4">表名：</el-col>
        <el-col :span="12" class="ell">{{checkTempInfo.tableName}}</el-col>
      </el-row>
      <el-row>
        <el-col :span="4">中文名称：</el-col>
        <el-col :span="12">{{checkTempInfo.zhName}}</el-col>
      </el-row>
      <el-row>
        <el-col :span="4">技术层次：</el-col>
        <el-col :span="12">{{checkTempInfo.technologyLevel}}</el-col>
      </el-row>
      <el-row>
        <el-col :span="4">业务主题：</el-col>
        <el-col :span="12">{{checkTempInfo.businessTheme}}</el-col>
      </el-row>
      <el-row>
        <el-col :span="4">其他检查：</el-col>
        <el-col :span="12">{{checkTempInfo.otherCheck}}</el-col>
      </el-row>
      <div class="quality-score"></div>
    </div>
    <el-table :data="checkTempInfo.checkData" height="200px" style="width: 100%">
      <el-table-column prop="ruleName" label="规则名称"/>
      <el-table-column prop="checkName" label="检查对象"/>
      <el-table-column prop="status" label="执行状态"/>
      <el-table-column prop="time" label="最后执行日期" width="150px"/>
    </el-table>
  </el-card>
</template>

<script>
  import {
    Card as ElCard,
    Col as ElCol,
    Row as ElRow,
    Table as ElTable,
    TableColumn as ElTableColumn,
  } from 'element-ui'

  export default {
    name: 'TempTablePanel',

    props: {
      checkTempInfo: Object,
    },

    components: {
      ElRow,
      ElCol,
      ElCard,
      ElTable,
      ElTableColumn,
    },
  }
</script>

<style lang="scss">
  @import '../../style/variables.scss';

  .temp-table {
    display: none;
    position: absolute;
    width: 500px;
    background: $white;
    z-index: 2;
    left: -250px;

    .quality-score {
      position: absolute;
      top: 15px;
      right: 15px;
      width: 124px;
      height: 124px;
      border: 1px solid $color_EEE;
    }
  }
</style>
