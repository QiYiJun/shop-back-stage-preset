import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from 'views/login/Login'
import Home from 'views/home/Home'
import Welcome from 'components/Welcome'
import Users from 'components/user/Users'
import Rights from 'components/power/Rights'
import Roles from 'components/power/Roles'
import Cate from 'components/goods/Cate'
import Params from 'components/goods/Params'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    component: Login
  },
  {
    path: '/home',
    component: Home,
    redirect: '/welcome',
    children: [
      {
        path: '/welcome',
        component: Welcome
      },
      {
        path: '/users',
        component: Users
      },
      {
        path: '/rights',
        component: Rights
      },
      {
        path: '/roles',
        component: Roles
      },
      {
        path: '/categories',
        component: Cate
      },
      {
        path: '/params',
        component: Params
      }
    ]
  }
]

const router = new VueRouter({
  routes,
  mode: 'history'
})

router.beforeEach((to, from, next) => {
  // 判断访问是否为登录页, 是: 放行
  if (to.path === '/login') return next()
  // 获取token值
  const tokenStr = window.sessionStorage.getItem('token')
  // 不存在token 强制跳转登录页
  // 存在token 放行
  if (!tokenStr) return next('/login')
  next()
})

export default router
