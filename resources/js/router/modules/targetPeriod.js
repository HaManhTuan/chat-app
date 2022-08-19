import Layout from '@/layout';
const targetPeriodRoutes = {
  path: '/target-period',
  component: Layout,
  meta: { roles: ['system'] },
  children: [
    {
      path: '',
      component: () => import('@/views/target-period/index'),
      name: 'TargetPeriod',
      meta: { title: '期間', noCache: false, roles: ['system'] },
      accessUrl: '/target-period',
    },
    {
      path: '/target-period/form',
      hidden: true,
      component: () => import('@/views/target-period/edit'),
      name: 'TargetPeriodCreate',
      meta: { title: '期間詳細', noCache: false, roles: ['system'] },
      accessUrl: '/target-period/form',
    },
    {
      path: '/target-period/form/:id',
      hidden: true,
      component: () => import('@/views/target-period/edit'),
      name: 'TargetPeriodEdit',
      meta: { title: '期間詳細', noCache: false, roles: ['system'] },
      accessUrl: '/target-period/form/(\\d+)',
    },
  ],
};
export default targetPeriodRoutes;
