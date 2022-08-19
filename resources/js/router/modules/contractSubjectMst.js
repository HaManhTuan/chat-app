import Layout from '@/layout';
const contractSubjectMstRoutes = {
  path: '/subject-master',
  component: Layout,
  meta: { roles: ['system'] },
  children: [
    {
      path: '',
      component: () => import('@/views/subject/index'),
      name: 'SubjectMaster',
      meta: { title: '受講科目マスタ', noCache: false, roles: ['system'] },
      accessUrl: '/subject-master',
    },
    {
      path: '/subject-master/form',
      hidden: true,
      component: () => import('@/views/subject/edit'),
      name: 'SubjectMasterCreate',
      meta: { title: '受講科目詳細', noCache: false, roles: ['system'] },
      accessUrl: '/subject-master/form',
    },
    {
      path: '/subject-master/form/:id',
      hidden: true,
      component: () => import('@/views/subject/edit'),
      name: 'SubjectMasterEdit',
      meta: { title: '受講科目詳細', noCache: false, roles: ['system'] },
      accessUrl: '/subject-master/form/(\\d+)',
    },
  ],
};
export default contractSubjectMstRoutes;
