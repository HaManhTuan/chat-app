<template>
  <!-- Form -->
  <div>
    <el-dialog
      title="エラー"
      :visible.sync="errorPopupShow"
      :before-close="closeModal"
      class="custom-dialog"
    >
      <span><p>編集した受講情報と変則申請届を再度確認してください。</p></span>
      <span slot="footer" class="dialog-footer custom-footer__button">
        <el-button class="cancel" @click="closeModal">
          <svg-icon icon-class="_cancel" />
          <span>キャンセル</span>
        </el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import CommonSettings from '@/const/CommonSettings';

export default {
  name: 'ErrorPopup',
  directives: { },
  components: { },
  mixins: [],
  props: {
    errorPopupShow: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      commonText: CommonSettings.COMMON_TXT,
      activeType: 1,
    };
  },
  async created() { },
  methods: {
    closeModal() {
      this.$emit('close');
    },
  },
};
</script>
<style lang="scss" scoped>
@import '../styles/modal';

.custom-dialog::v-deep .el-dialog .el-dialog__body .el-form-item.radio-button-custom {
  justify-content: space-between;
  margin-left: 80px;
}

.custom-dialog::v-deep {
  .el-dialog {
    height: unset;
    width: 1060px;
    .el-dialog__header {
      .el-dialog__title {
        font-weight: 500;
      }
    }
    .el-dialog__footer {
      margin-top: 70px !important;
    }
    .el-dialog__body {
      p {
        font-size: 16px;
        color: #C70000;
      }
    }
  }
}
.el-checkbox__inner {
  background: none !important;
  border: none !important;

  &:after {
    border-color: #1a1714 !important;
    border-width: 4px !important;
    top: 0 !important;
    width: 8px !important;
    height: 15px !important;
    left: 0;
    transform: rotate(45deg) scaleY(1);
    box-sizing: content-box;
    content: '';
  }
}
/deep/.el-form-item__error{
  min-width: 500px;
}
</style>
