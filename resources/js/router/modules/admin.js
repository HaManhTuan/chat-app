/** When your routing table is too long, you can split it into small modules**/
import Layout from '@/layout';

const adminRoutes = {
  path: '/administrator',
  component: Layout,
  redirect: '/administrator/users',
  name: 'Administrator',
  alwaysShow: true,
  meta: {
    title: 'administrator',
    icon: 'admin',
    permissions: ['view menu administrator'],
  },
  children: [
    /** User managements */
    // OTHER
    {
      path: 'path023',
      component: () => import('@/templates/users/List'),
      name: 'path023',
      meta: {
        title: '開校コース',
        icon: 'dashboard',
        permissions: ['manage user'],
      },
    },
    {
      path: 'path024',
      component: () => import('@/templates/users/List'),
      name: 'path024',
      meta: {
        title: '科目セット',
        icon: 'dashboard',
        permissions: ['manage user'],
      },
    },

    {
      path: 'path025',
      component: () => import('@/templates/users/List'),
      name: 'path025',
      meta: { title: '受講科目マスタ', icon: 'dashboard', noCache: false },
    },
    {
      path: 'path026',
      component: () => import('@/templates/users/List'),
      name: 'path026',
      meta: {
        title: 'カレンダーパターン',
        icon: 'dashboard',
        noCache: false,
      },
    },
    {
      path: 'path027',
      component: () => import('@/templates/users/List'),
      name: 'path027',
      meta: {
        title: '割引管理',
        icon: 'dashboard',
        noCache: false,
      },
    },
    {
      path: 'path028',
      component: () => import('@/templates/users/List'),
      name: 'path028',
      meta: { title: '採番', icon: 'dashboard', noCache: false },
    },
    {
      path: 'path029',
      component: () => import('@/templates/users/List'),
      name: 'path029',
      meta: { title: '校舎', icon: 'dashboard', noCache: false },
    },
    {
      path: 'path30',
      component: () => import('@/templates/users/List'),
      name: 'path30',
      meta: { title: '学校', icon: 'dashboard', noCache: false },
    },

    {
      path: 'path031',
      component: () => import('@/templates/users/List'),
      name: 'path031',
      meta: { title: '学年', icon: 'dashboard', noCache: false },
    },

    {
      path: 'path032',
      component: () => import('@/templates/users/List'),
      name: 'path032',
      meta: { title: '学校種別', icon: 'dashboard', noCache: false },
    },

    {
      path: 'path033',
      component: () => import('@/templates/users/List'),
      name: 'path033',
      meta: { title: '期間', icon: 'dashboard', noCache: false },
    },

    {
      path: 'path034',
      component: () => import('@/templates/users/List'),
      name: 'path034',
      meta: {
        title: 'システム日付設定',
        icon: 'dashboard',
        noCache: false,
      },
    },

    {
      path: 'path035',
      component: () => import('@/templates/users/List'),
      name: 'path035',
      meta: { title: 'ユーザー', icon: 'dashboard', noCache: false },
    },
  ],
};

export default adminRoutes;
