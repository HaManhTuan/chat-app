export const SearchMixin = {
  methods: {
    async handleSearch() {
      this.$refs.listDatatableElement.getList(
        _.assign(
          {
            page: 1,
          },
          this.buildParamRequest()
        )
      );
    },
    async doSearch() {
      this.searchForm.page = 1;
      this.$refs.listDatatableElement.getList(
        this.buildParamRequest()
      );
    },
  },
};
