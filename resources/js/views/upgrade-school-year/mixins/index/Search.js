export const SearchMixin = {
  data() {
    return {
      searchLoading: false,
    };
  },
  methods: {
    async handleSearch() {
      this.searchLoading = true;
      await this.$refs.listDatatableElement.getList(
        _.assign(
          {
            page: 1,
          },
          this.buildParamRequest()
        )
      );
      this.searchLoading = false;
    },
  },
};
