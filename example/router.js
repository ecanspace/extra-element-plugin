import Vue from 'vue'
import Router from 'vue-router'
import navJson from './locale/nav.json'

Vue.use(Router)

const createRoutes = (data) => data.reduce((r, item) => {
  const subData = item.children

  if (subData && subData.length) {
    return r.concat(createRoutes(subData))
  }

  r.push({
    name: item.name,
    path: item.path,
    component: () => import('./docs/' + item.name + '.md' /* webpackChunkName: 'component' */ ),
  })

  return r
}, [])

const routes = createRoutes(navJson.data)

routes.unshift({
  name: 'index',
  path: '/',
  redirect: '/component/dialog',
})

export default new Router({
  mode: 'hash',
  routes: routes,
})