import Layout from '@/layout';
const subjectSet = {
  path: '/subject-set',
  component: Layout,
  meta: { roles: ['system'] },
  children: [
    {
      path: '',
      component: () => import('@/views/subject-set/index'),
      name: 'SubjectSet',
      meta: { title: '科目セット', roles: ['system'] },
      accessUrl: '/subject-set',
    },
    {
      path: '/subject-set/form',
      hidden: true,
      component: () => import('@/views/subject-set/edit'),
      name: 'SubjectSetCreate',
      meta: { title: '科目セット詳細', noCache: false, roles: ['system'] },
      accessUrl: '/subject-set/form',
    },
    {
      path: '/subject-set/form/:id',
      hidden: true,
      component: () => import('@/views/subject-set/edit'),
      name: 'SubjectSetEdit',
      meta: { title: '科目セット詳細', noCache: false, roles: ['system'] },
      accessUrl: '/subject-set/form/(\\d+)',
    },
  ],
};
export default subjectSet;
