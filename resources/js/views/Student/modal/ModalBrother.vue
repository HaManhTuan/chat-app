<template>
  <!-- Form -->
  <div>
    <h3>123123</h3>
  </div>
</template>
<script>
// import ButtonSave from '../../../components/Common/Button/ButtonSave';
import { ModalRegister } from '../assets/validate';

export default {
  name: 'ModalRegister',
  components: {
    // ButtonSave,
  },
  mixins: [ModalRegister],
  props: {
    showDialog: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      selectData: [
        {
          value: 1,
          label: 'Option 1',
        },
        {
          value: 2,
          label: 'Option 2',
        },
        {
          value: 3,
          label: 'Option 3',
        },
      ],
      form: {
        name: '小中_最難関コース南浦和東口',
        name2: '中学3年',
        name3: '10100001',
        name4: '湘南',
        name5: '',
        region: '永井 祐輔',
        region2: '渡邊 美咲',
        region3: '永井 祐輔',
        region4: 'ー',
        region5: '渡邊 美咲',
        region6: 'ー',
        region7: 'ー',
        date1: '2021',
        date2: '2021/02/09',
        delivery: false,
        type: [],
        resource: '',
        desc: '',
      },
      ruleForm: {
        name: '',
        region: '',
        date1: '',
        date2: '',
        delivery: false,
        type: [],
        resource: '',
        desc: '',
      },
      value3: '',
    };
  },
  methods: {
    closeModal() {
      this.$emit('close');
    },
  },
};
</script>
<style lang="scss" scoped>
.icon-input__calendar {
  position: absolute;
  top: 0;
  right: 11px;
}
.custom-dialog::v-deep {
  .el-dialog {
    width: 1060px;
    height: 638px;
    border-radius: 25px;

    .el-dialog__header {
      padding: 53px 0 0 74px;
      font-family: Noto Sans JP, sans-serif;
      .el-dialog__title {
        color: #1a1714;
        font-size: 20px;
      }
      .el-dialog__headerbtn {
        top: 28px;
        right: -2px;

        .el-dialog__close {
          font-size: 40px;
          color: #1a1714;
        }

        &:after {
          content: '閉じる';
          position: relative;
          top: 15px;
          right: 36px;
          font-size: 11px;
          font-family: Noto Sans JP, sans-serif;
        }
      }
    }

    .el-dialog__body {
      padding: 37px 0 0 0;
      margin-right: 120px;

      .el-form-item.el-form-item--medium {
        display: flex;
        justify-content: flex-end;
        margin-bottom: 13px;

        label.el-form-item__label {
          line-height: 36px !important;
          padding-left: 20px;
          font-weight: 500;
          color: #000000;
        }

        &.custom-date {
          .el-form-item__content {
            display: flex;
            flex-direction: column;

            & > span.des {
              height: 25px;
              font-size: 13px;
              color: #1a1714;
              margin-top: -4px;
            }
          }
        }

        .el-input {
          .el-input__inner {
            width: 280px;
            height: 36px;
          }
        }
      }
    }

    .el-dialog__footer {
      padding: 0 30px 37px 55px;
      margin-top: 5px;
      .dialog-footer.custom-footer__button {
        .el-button + .el-button {
          margin-left: 15px !important;
        }
        button {
          border-radius: 100px;
          color: #fff;
          height: 45px;
          width: 105px;
          border: none;

          span {
            font-size: 15px;
            font-family: Noto Sans JP, sans-serif;
            padding-left: 4px;
          }

          &.cancel {
            background: #6a6a6a;
            border-color: #707070;
            margin-right: 0;
            width: 145px;
          }

          &.delete {
            background: #343434;
            border-color: #707070;
          }
          svg {
            font-size: 18px;
            vertical-align: -3px;
          }

          &:hover {
            opacity: 0.8;
          }
        }
      }
    }
  }
}
</style>
