import Vue from 'vue'
import Router from 'vue-router'
import IndexPage from '@/pages/IndexPage'
import RegisterPage from '@/pages/RegisterPage'
import RegisterForm from '@/components/register/RegisterForm'
import RegisterTags from '@/components/register/RegisterTags'
import RegisterFollows from '@/components/register/RegisterFollows'
import UserPage from '@/pages/UserPage'
import UserInfo from '@/components/user/UserInfo'
import Error404Page from '@/pages/error-pages/404'
import UserIndexPage from '@/pages/UserIndexPage'

Vue.use(Router)
// main.js引入了VueRouter，所有的页面路由都写到router/index.js这个文件里
// 在创建的 router 对象中，如果不配置 mode，就会使用默认的 hash 模式，该模式下会将路径格式化为 #! 开头。
const router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      component: IndexPage
    },
    {
      path: '/users/:id',
      component: UserPage,
      meta: {
        requiresAuth: true
      },
      children: [
        {
          path: '/users/:id/info',
          component: UserInfo
        }
      ]
    },
    {
      path: '/users/:id/index',
      component: UserIndexPage,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/register',
      component: RegisterPage,
      // chilren意味着一定会有<router-view>
      children: [
        {
          path: 'form',
          component: RegisterForm
        },
        {
          path: 'tags',
          component: RegisterTags
        },
        {
          path: 'follows',
          component: RegisterFollows
        }
      ]
    },
    {
      path: '*',
      component: Error404Page
    }
  ]
})
// 处理需要登录才能访问的页面
router.beforeEach((to, from, next) => {
  // 如果需要验证登录状态
  if (to.matched.some(record => record.meta.requiresAuth)) {
    // 如果没有登录
    if (localStorage.getItem('loginResult') === null) {
      next({
        path: '/login',
        // to.fullPath表示把当前路由信息传递过去方便登录后跳转回
        query: { redirect: to.fullPath }
      })
    } else {
      // 如果登录，那么放行
      next()
    }
  } else {
    // 如果不需要验证，那么放行
    next()
  }
})
export default router
