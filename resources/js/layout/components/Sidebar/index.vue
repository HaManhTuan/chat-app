<template>
  <div :class="{'has-logo':showLogo}">
    <logo v-if="showLogo" :collapse="isCollapse" />
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <el-menu
        :show-timeout="200"
        :default-active="$route.path"
        :collapse="isCollapse"
        :background-color="variables.menuBg"
        :text-color="variables.menuText"
        :active-text-color="variables.menuText"
        mode="vertical"
      >
        <sidebar-item
          v-for="route in routes"
          :key="route.path"
          :item="route"
          :base-path="route.path"
          :is-active="arrayContainArray(toPath, route.path.split('/'))"
        />
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import SidebarItem from './SidebarItem';
import Logo from './Logo';
import variables from '@/styles/variables.scss';
import Layout from '@/layout';
import LinkResource from '@/api/Links';
const linkResource = new LinkResource();

export default {
  components: { SidebarItem, Logo },
  data() {
    return {
      toPath: [],
      links: [],
    };
  },
  computed: {
    ...mapGetters(['sidebar', 'permission_routers']),
    routes() {
      const routesData = this.$store.state.permission.routes;
      const index = routesData.findIndex(element => element.path === '/upgrade-school-year');
      const data = [];
      this.links.forEach(link => {
        data.push({
          path: 'external-link' + link.id,
          component: Layout,
          children: [
            {
              path: link.links.trim(),
              meta: { title: link.name.trim(), noCache: false },
            },
          ],
        });
      });
      routesData.splice(index + 1, 0, ...data);
      return routesData;
    },
    showLogo() {
      return this.$store.state.settings.sidebarLogo;
    },
    variables() {
      return variables;
    },
    isCollapse() {
      return !this.sidebar.opened;
    },
  },
  watch: {
    '$route'(to, from) {
      const path = to.path ? to.path : this.$route.path;
      this.toPath = _.filter(path.split('/'));
    },
  },
  async created() {
    this.toPath = _.filter(this.$route.path.split('/'));
    this.links = await linkResource.list();
  },
  methods: {
    arrayContainArray(arr1, arr2) {
      const a1 = _.filter(arr1);
      const a2 = _.filter(arr2);
      return _.difference(a2, a1).length === 0;
    },
  },
};
</script>
