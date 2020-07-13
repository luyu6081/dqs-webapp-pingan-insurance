<template>
  <div class="ej-list-comp">
    <!-- header「已选择」「总条数」及「suffix」 区域 -->
    <div class="flex items-center">
      <div class="flex items-center">
        <el-checkbox v-if="selectable && listMode === ListMode.attach"
                     v-model="checkAll"
                     :indeterminate="isIndeterminate"
                     :disabled="!selectKeysList.length && listMode === ListMode.attach"
                     @change="handleCheckAllChange">全选
        </el-checkbox>

        <el-link v-else-if="selectable && listMode === ListMode.main"
                 type="primary"
                 @click="handleCheckAllChange">选中本页数据
        </el-link>

        <span v-if="selectable"
              class="cursor-pointer pl-sm"
              @click="toggleListMode">已选择{{selectionCount}}条，</span>
        <span class="list-total">共{{total}}条检索数据</span>
      </div>
      <slot name="suffix">
        <div class="ml-auto my-2 p-2 border-2 border-dashed border-gray text-gray">suffix区域 </div>
      </slot>
    </div>

    <!-- header -->
    <slot name="header">
      <div class="my-2 p-2 border-2 border-dashed border-gray text-center text-gray">header区域</div>
    </slot>

    <!--「列表」区域 -->
    <div v-ej-loading="loading">
      <!-- 普通列表 -->
      <div v-if="!loadMore">
        <div v-if="listData && listData.length" class="list-content">
          <div v-for="(item, idx) in listData"
               :key="idx"
               class="list-content-item w-full flex"
               :class="{divider: divider}"
               @click="handleItemClick(item)">
            <el-checkbox v-if="selectable"
                         v-model="selection"
                         :label="item.id"
                         @change="handleCheckItemChange(item.id, item)"/>
            <slot :data="{idx, item}">{{item}}</slot>
          </div>
        </div>
        <div v-else class="list-content text-center text-gray">
          暂无数据
        </div>
      </div>

      <!-- 滚动加载数据列表 待讨论 提出去-->
      <div v-else
           v-infinite-scroll="loadData"
           style="height: 60vh; overflow: auto; padding: 0; margin: 0; list-style: none;">
        <div v-if="listData && listData.length" class="list-content">
          <div v-for="(item, idx) in listData"
               :key="idx"
               class="list-content-item w-full"
               :class="{divider: divider}"
               @click="handleItemClick(item)">
            <el-checkbox v-if="selectable"
                         v-model="selection"
                         :label="item.id"
                         @change="handleCheckItemChange(item.id, item)"></el-checkbox>
            <slot :data="{idx, item}">{{item}}</slot>
          </div>
        </div>
        <div v-else class="list-content text-center text-gray">
          暂无数据
        </div>
      </div>
    </div>

    <!-- footer 区域 -->
    <slot name="footer">
      <div class="my-2 p-2 border-2 border-dashed border-gray text-center text-gray">footer区域</div>
    </slot>

    <!-- 分页 -->
    <ej-pagination v-if="pagination"
                   background
                   :current-page="paginationObject._currentPage"
                   :page-size="paginationObject._limit"
                   :total="paginationObject._total"
                   :style="{textAlign: pagination.position || 'center'}"
                   @current-change="handleCurrentChange"/>
  </div>
</template>

<script>
  import Vue from 'vue'
  import {Checkbox as ElCheckbox, InfiniteScroll, Link as ElLink} from 'element-ui'
  import {Loading} from '@ej/ui'
  import EjPagination from '../ej-pagination'

  Vue.use(InfiniteScroll)
  Vue.use(Loading)
  Vue.use(EjPagination)
  Vue.use(ElCheckbox)
  Vue.use(ElLink)

  const ListMode = {
    // 默认模式
    main: 'MAIN_FRONTAL',
    // 已选模式
    attach: 'AFFILIATED',
  }

  export default {
    name: 'EjList',

    model: {
      prop: 'value',
      event: 'change',
    },

    props: {
      data: {
        type: Array,
        default: () => [],
      },
      total: {
        type: Number,
      },
      divider: {
        type: Boolean,
        default: true,
      },
      selectable: {
        type: Boolean,
        default: false,
      },
      value: {
        type: Array,
        default: () => [],
      },
      itemKey: {
        type: String,
      },
      pagination: {
        type: [Boolean, Object],
        default: false,
      },
      loadMore: {
        type: [Boolean],
        default: false,
      },
      loading: {
        type: Boolean,
        default: false,
      },
    },

    data () {
      return {
        checkAll: false,

        isIndeterminate: false,

        // 当前选中项
        selection: [],

        // 存放已选择的item 以及 selected 是否选中[已选择页面列表用]
        selectKeysList: [],

        // 分页展示已选择的数据
        currentSelectionData: [],

        // 存放本地所有已加载的数据, 主要操作此数据
        cache: [],

        // 当前页面状态，main-主要的
        listMode: ListMode.main,

        defaultPageOptions: {
          pageNumber: 1,
          pageSize: 5,
        },
      }
    },

    computed: {
      ListMode: () => ListMode,

      selectionData: {// 当前选中项的item集合
        get () {
          return this.value
        },
        set (val) {
          this.$emit('change', val)
        },
      },

      /**
       * 已选数据总条数
       */
      selectionCount () {
        return this.selection.length
      },

      /**
       * 分页对象
       */
      paginationObject () {
        let _currentPage = this.defaultPageOptions.pageNumber
        let _total = 0
        let _limit = this.defaultPageOptions.pageSize

        if (this.listMode === ListMode.main) {
          _currentPage = this.pagination.currentPage || this.defaultPageOptions.pageNumber
          _total = this.pagination.total || this.cache.length
          _limit = this.pagination.limit || this.defaultPageOptions.pageSize
        } else if (this.listMode === ListMode.attach) {
          _currentPage = this.defaultPageOptions.pageNumber
          _total = this.selectKeysList.length
          _limit = this.defaultPageOptions.pageSize
        }

        return {
          _currentPage,
          _total,
          _limit,
        }
      },

      /**
       * 用于视图渲染的列表数据
       */
      listData () {
        switch (this.listMode) {
          // 默认模式，渲染业务数据
          case ListMode.main:
            return this.data
          // 已选模式，渲染已选数据
          case ListMode.attach:
            return this.currentSelectionData.map(cs => cs.item)
          default:
            return []
        }
      },
    },

    watch: {
      data: {
        deep: true,
        immediate: true,
        handler () {
          // 点击翻页时，将数据加入到总数据中
          for (const item of this.data) {
            if (this.cache.some(it => it.id === item.id)) {
              this.cache.push(item)
            }
          }
        },
      },

      selectKeysList: {
        deep: true,
        immediate: true,
        handler (items) {
          let _itemFilter = items.filter(sk => sk.selected === true)
          const item = _itemFilter.map(sk => {
            if (sk.selected) {
              return sk.item
            }
          })

          this.selectionData = item
          this.selection = item.map(d => d.id) || []

          // [已选择]列表 如果selection发生变化，则更改[全选框]的状态
          if (this.listMode === ListMode.attach) {
            const _selectionCount = this.selection.length
            const _selectKeysListCount = this.selectKeysList.length

            this.checkAll = _selectionCount === _selectKeysListCount
            this.isIndeterminate = _selectionCount > 0 && _selectionCount < _selectKeysListCount
          }

          this.$emit('selection-change', this.selection)
        },
      },

      listMode (_, oldMode) {
        // 退出已选模式时，从已选数据中移除用户取消选择的数据（`selected === false`）
        if (oldMode === ListMode.attach) {
          this.selectKeysList = this.selectKeysList.filter(it => it.selected)
        }
      },
    },

    methods: {
      /**
       * 移除key: 从selectKeysList中移除key
       *
       * @param {Number} [itemKey] 要移除的key
       */
      removeSelectionKey (itemKey) {
        if (!itemKey) {
          console.error('itemKey不能为null')
          return
        }

        this.selectKeysList = this.selectKeysList.filter(sd => sd.itemKey !== itemKey)
      },

      /**
       * 增加key: 向selectKeysList中增加key
       *
       * @param {Object} [itemKey] 要移除的key
       */
      addSelectionKey (item) {
        if (typeof item === 'undefined' || item === null) {
          console.error('item不能为null')
          return
        }

        this.selectKeysList.push(item)
      },

      /**
       * 切换列表模式
       */
      toggleListMode () {
        // 切换至[已选择]列表
        if (this.listMode === ListMode.main) {
          const _selectKeysListCount = this.selectKeysList.filter(s => s.selected === true).length
          if (this.selectionCount && this.selectionCount === _selectKeysListCount) {
            this.checkAll = this.selectionCount === _selectKeysListCount
            this.isIndeterminate = this.selectionCount > 0 && this.selectionCount < _selectKeysListCount
          }

          this.currentSelectionData = this.selectKeysList.slice(0, this.defaultPageOptions.pageSize)

          this.listMode = ListMode.attach
        }
        // 切换至[主]列表
        else {
          this.listMode = ListMode.main
        }
      },

      /**
       * 点击「选中本页数据」
       */
      handleCheckAllChange (isAllChecked) {
        if (isAllChecked && this.listMode === ListMode.main) { // [主]列表点击全选
          // 如果没有该数据，则存入该数据
          for (const item of this.data) {
            if (this.selectKeysList.findIndex(sd => sd.itemKey === item.id) < 0) {
              this.addSelectionKey({itemKey: item.id, item, selected: true})
            }
          }
        } else if (isAllChecked && this.listMode === ListMode.attach) { // [已选择]列表点击全选
          // 如果没有该数据，则存入该数据
          this.selectKeysList.map(sk => {
            if (!sk.selected) {
              sk.selected = true
            }
            return sk
          })
        } else { // 取消全选
          if (this.listMode === ListMode.attach) { // [已选择]列表
            this.selectKeysList.map(sd => {
              sd.selected = !sd.selected
              return sd
            })
          }
        }

        // this.$emit('select-all', this.selection)
      },

      /**
       * 点击「某一项复选框」
       */
      handleCheckItemChange (itemKey, item) {
        if (this.listMode === ListMode.main) { // [主]列表
          // 如果没有该数据，则存入该数据
          if (this.selectKeysList.findIndex(sd => sd.itemKey === itemKey) < 0) {
            this.addSelectionKey({itemKey, item, selected: true})
          } else {
            this.removeSelectionKey(itemKey)
          }
        } else { // [已选择]列表
          // 选中状态，selected 未选中设置为false 选中设置为true
          if (this.selectKeysList.findIndex(sd => sd.itemKey === itemKey) > -1) {
            this.selectKeysList.map(sd => {
              if (sd.itemKey === itemKey) {
                sd.selected = !sd.selected
              }
              return sd
            })
          }
        }

        const selectKeys = this.selectKeysList.find(sd => sd.itemKey === itemKey)
        this.$emit('select', item, selectKeys ? selectKeys.selected : false, this.selection)
      },

      /**
       * 分页
       * @param {Number} [pageNumber] 当前点击的页码
       */
      handleCurrentChange (pageNumber) {
        if (this.listMode === ListMode.main) { // [主]列表
          this.$emit('current-page-change', pageNumber)
        } else if (this.listMode === ListMode.attach) {
          let _offset = (pageNumber - 1) * this.defaultPageOptions.pageSize
          this.currentSelectionData = this.selectKeysList.slice(_offset, _offset + this.defaultPageOptions.pageSize)
        }
      },

      /**
       * 点击[行]触发该事件
       * @param {Object} [item] 当前点击行数据对象
       */
      handleItemClick (item) {
        this.$emit('item-click', item)
      },

      /**
       * 用于多选列表，清空用户的选择，当使用selectable功能的时候，可能会需要使用此方法
       */
      selectNone () {
        this.selectKeysList = []
        this.listMode = ListMode.main
      },

      /**
       * 用于多选列表，部分选中，当使用selectable功能的时候，可能会需要使用此方法
       * @param {Object} [item] 某一行数据
       * @param {Boolean} [selected] 设置这一行是否选中
       */
      select (item, selected) {
        if (!item) {
          console.error('item不能为null')
          return
        }

        if (selected) {
          if (this.selectKeysList.findIndex(sks => sks.itemKey === item.id) < 0) {
            this.addSelectionKey({itemKey: item.id, item, selected: true})
          }
        } else {
          this.removeSelectionKey(item.id)
        }
      },

      /**
       * 用于loadMore，滚动加载数据
       */
      loadData () {
        console.log('加载数据')
        this.$emit('load-more')
      },
    },
  }
</script>

<style lang="scss">
  .ej-list-comp {
    .list-content {
      .divider {
        @apply border-b border-solid border-blue;
      }

      &-item {
        padding: 12px 0;

        &:last-of-type {
          border-bottom: none;
        }
      }

      .el-checkbox__label{
        display: none;
      }

      .el-checkbox{
        margin-right: 8px;
      }
    }

    .list-total, .cursor-pointer{
      @apply text-gray-dark;
    }
  }
</style>
