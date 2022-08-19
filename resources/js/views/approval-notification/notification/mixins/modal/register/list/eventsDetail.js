export const eventsDetail = {
  data() {
    return {
      dialog: {
        id: null,
        showDialog: false,
      },
    };
  },
  methods: {
    handleClickDetail(id) {
      this.dialog.id = id;
      this.dialog.showDialog = true;
    },
  },
};
