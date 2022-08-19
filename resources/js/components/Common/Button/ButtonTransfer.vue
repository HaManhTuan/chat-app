<template>
  <el-button class="button-save" :loading="loading" :disabled="disabled" @click="$emit('save')">
    <svg-icon icon-class="transfer" />
    <span>変更</span>
  </el-button>
</template>

<script>
export default {
  name: 'ButtonTransfer',
  props: {
    loading: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
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
      opacity: 1;
      font-family: Noto Sans JP;
      span{
        font-weight: 500 !important;
      }
      &:hover{
        opacity: 0.8;
      }
    }
</style>
