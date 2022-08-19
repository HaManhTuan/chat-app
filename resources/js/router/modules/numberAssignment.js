import Layout from '@/layout';

const numberAssignmentRoutes = {
  path: '/number-assignment',
  component: Layout,
  children: [
    {
      path: '',
      component: () => import('@/views/number-assignment/List'),
      name: 'NumberAssignment.List',
      meta: { title: '採番', noCache: true },
    },
  ],
};

export default numberAssignmentRoutes;
