<template>
  <el-button :disabled="disabled" class="button-export" type="primary" :loading="loading" @click="$emit('export')">
    <svg-icon :icon-class="type" />
    <span>出力</span>
  </el-button>
</template>

<script>
export default {
  name: 'ButtonExport',
  props: {
    type: {
      type: String,
      default: 'csv',
    },
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
  .button-export{
    background: #343434 0% 0% no-repeat padding-box !important;
    border-radius: 25px;
    border-color: #343434;
    opacity: 1;
    font-family: Noto Sans JP;
    border: none !important;
    min-width: 105px;
    height: 45px;
    &:hover{
      opacity: 0.8;
    }
    span{
      font-size: 15px;
      font-weight: 500 !important;
    }
  }
  svg {
    margin-right: 10px;
    width: 26px!important;
    height: 17px!important;
  }
</style>
