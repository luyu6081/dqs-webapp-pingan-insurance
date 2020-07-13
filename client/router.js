import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

function esm (routes) {
  for (const r of routes) {
    if (typeof r.component === 'function') {
      const _component = r.component
      r.component = () => _component().then(m => m.default || m)
    }
    if (r.children) {
      esm(r.children)
    }
  }

  return routes
}

export function createRouter () {
  return new VueRouter({
    mode: 'history',
    routes: esm([
      // 首页
      {
        path: '/',
        name: 'home',
        component: () => import('~/pages/home/index.vue'),
        meta: {
          navIdx: '1',
        },
      },
      // 检查规则页
      {
        path: '/rules',
        name: 'rule-index',
        meta: {
          navIdx: '2',
        },
        component: () => import('~/pages/rules/index.vue'),
        children: [
          {
            path: '/rule',
            redirect: '/rules',
          },
          // 检查规则详情视图
          {
            path: '/rule/:ruleId',
            name: 'rule-detail',
            component: () => import('~/pages/rules/detail.vue'),
            meta: {
              navIdx: '2',
            },
          },
        ],
      },
      // 工单列表页
      {
        path: '/issues',
        name: 'issue-index',
        component: () => import('~/pages/issues/index.vue'),
        meta: {
          navIdx: '3',
        },
      },
      // 工单详情页
      {
        path: '/issue/:issueId',
        name: 'issue-detail',
        component: () => import('~/pages/issues/detail.vue'),
      },
      //  质量报告
      {
        path: '/report',
        name: 'report-detail',
        component: () => import('~/pages/report/detail.vue'),
        meta: {
          navIdx: '4',
        },
      },
      // 设置
      {
        path: '/setting/',
        component: () => import('~/pages/setting/main.vue'),
        children: [
          {
            path: '',
            redirect: '/setting/quality',
          },
          {
            path: 'quality',
            name: 'setting-quality',
            component: () => import('~/pages/setting/quality.vue'),
          },
          {
            path: 'qualityAdmin',
            name: 'setting-qualityAdmin',
            component: () => import('~/pages/setting/quality-adim.vue'),
          },
          {
            path: 'questions',
            name: 'setting-questions',
            component: () => import('~/pages/setting/questions.vue'),
          },
        ],
      },
      // 模板编辑创建共用次路由，创建页面id参数 0
      {
        path: '/templateEdit/:id',
        name: 'template-edit',
        component: () => import('~/pages/template/edit.vue'),
      },
      {
        path: '/template/:id',
        name: 'template-detail',
        component: () => import('~/pages/template/template-detail.vue'),
      },
      // 模板列表
      {
        path: '/templates',
        name: 'templates',
        component: () => import('~/pages/template/templates.vue'),
        meta: {
          navIdx: '5',
        },
      },
      // 规则编辑创建共用次路由，创建页面id参数 0
      {
        path: '/ruleEdit/:id',
        name: 'rule-edit',
        component: () => import('~/pages/rules/edit.vue'),
      },
    ]),
  })
}
