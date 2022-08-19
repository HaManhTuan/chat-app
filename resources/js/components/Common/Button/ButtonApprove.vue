<template>
  <el-button class="button-save" :loading="loading" :disabled="disabled" @click="$emit('save')">
    <svg-icon icon-class="icon_checkbox" />
    <span>{{ name }}</span>
  </el-button>
</template>

<script>
export default {
  name: 'ButtonSave',
  props: {
    loading: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    name: {
      type: String,
      default: '承認',
    },
  },
};
</script>

<style lang="scss" scoped>
    .button-save{
      color: #fff;
      background: var(--unnamed-color-c70000) 0% 0% no-repeat padding-box;
      background: #C70000 0% 0% no-repeat padding-box;
      background-color: #C70000;
      border: none!important;
      border-radius: 25px;
      height: 45px;
      opacity: 1;
      font-family: Noto Sans JP;
      i,
      svg {
        width: 24px;
        height: 17px;
        vertical-align: middle;
      }
      span{
        font-size: 15px;
        font-weight: 500 !important;
        vertical-align: middle !important;
      }
      &:hover{
        opacity: 0.8;
        background: #C70000 0% 0% no-repeat padding-box;
        background-color: #C70000;
        color: #fff;
      }
      .is-disabled {
        background-color: #898989;
        color: #fff;
      }
    }
</style>
