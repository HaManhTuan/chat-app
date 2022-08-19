export const Tab = {
  data() {
    return {
      tabIndex: 1,
      activeTab: 'register',
    };
  },
  created() {
    this.activeTab = this.getParameterByName('tab');
    this.tabIndex = this.getTabIndex(this.activeTab);
  },
  methods: {
    async tabClick(tab) {
      this.tabIndex = parseInt(tab.index);
      this.activeTab = tab._props.name;
      const url = new URL(window.location);
      url.searchParams.set('tab', tab._props.name);
      window.history.pushState({}, '', url);

      if (this.activeTab === 'register') {
        if (this.$refs.tabRegister !== undefined) {
          this.$refs.tabRegister.$refs.listDataTableElement.needUpdate();
        }
      } else if (this.activeTab === 'approved') {
        if (this.$refs.tabApproved !== undefined) {
          // console.log(this.$refs.tabApproved);
          this.$refs.tabApproved.needUpdate();
        }
      }
    },
    getParameterByName(name, url = window.location.href) {
      name = name.replace(/[\[\]]/g, '\\$&');
      const regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)');
      const results = regex.exec(url);
      if (!results) {
        return this.activeTab;
      }
      if (!results[2]) {
        return this.activeTab;
      }
      return decodeURIComponent(results[2].replace(/\+/g, ' '));
    },
    getTabIndex(name) {
      switch (name) {
        case 'register':
          return 1;
        case 'approved':
          return 2;
        default:
          return 0;
      }
    },
  },
};
