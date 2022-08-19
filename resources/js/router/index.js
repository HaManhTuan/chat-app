import Vue from 'vue';
import Router from 'vue-router';

/**
 * Layzloading will create many files and slow on compiling, so best not to use lazyloading on devlopment.
 * The syntax is lazyloading, but we convert to proper require() with babel-plugin-syntax-dynamic-import
 * @see https://doc.laravue.dev/guide/advanced/lazy-loading.html
 */

Vue.use(Router);

/* Layout */
import Layout from '@/layout';
import asyncRounter from './modules/asyncRouter';

/**
 * Sub-menu only appear when children.length>=1
 * @see https://doc.laravue.dev/guide/essentials/router-and-nav.html
 **/

/**
* hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
* alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
*                                if not set alwaysShow, only more than one route under the children
*                                it will becomes nested mode, otherwise not show the root menu
* redirect: noredirect           if `redirect:noredirect` will no redirect in the breadcrumb
* name:'router-name'             the name is used by <keep-alive> (must set!!!)
* meta : {
    roles: ['admin', 'editor']   Visible for these roles only
    permissions: ['view menu zip', 'manage user'] Visible for these permissions only
    title: 'title'               the name show in sub-menu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    noCache: true                if true, the page will no be cached(default is false)
    breadcrumb: false            if false, the item will hidden in breadcrumb (default is true)
    affix: true                  if true, the tag will affix in the tags-view
  }
**/

// import adminRoutes from './modules/admin';

export const constantRoutes = [
  {
    path: '',
    component: Layout,
    redirect: '/toiawase',
  },
  {
    path: '/login',
    component: () => import('@/views/auth/login/index'),
    // component: () => import('@/templates/login/index'),
    // NOTE: use old screen when dev at localhost
    hidden: true,
  },
  // {
  //   path: '/login-cloudgate',
  //   component: () => import('@/views/auth/login/index'),
  //   hidden: true,
  // },
  {
    path: '/auth-redirect',
    component: () => import('@/templates/login/AuthRedirect'),
    hidden: true,
  },
  {
    path: '/404',
    component: () => import('@/templates/error-page/404'),
    name: 'err_404',
    hidden: true,
  },
  {
    path: '/403',
    component: () => import('@/templates/error-page/403'),
    name: 'err_403',
    hidden: true,
  },
  {
    path: '/401',
    component: () => import('@/templates/error-page/401'),
    hidden: true,
  },
];

// export const asyncRoutes = [adminRoutes];
export const asyncRoutes = asyncRounter;

const createRouter = () =>
  new Router({
    mode: 'history', // require service support
    scrollBehavior: () => ({ y: 0 }),
    base: process.env.MIX_LARAVUE_PATH,
    routes: constantRoutes,
  });

const router = createRouter();

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter();
  router.matcher = newRouter.matcher; // reset router
}

export default router;
