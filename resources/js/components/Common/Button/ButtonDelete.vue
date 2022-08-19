<template>
  <el-button class="button-delete" :loading="loading" :disabled="disabled" @click="$emit('delete')">
    <svg-icon icon-class="_trash_w" />
    <span>削除</span>
  </el-button>
</template>

<script>
export default {
  name: 'ButtonDelete',
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
.button-delete{
  color: #fff;
  background: #343434 0% 0% no-repeat padding-box;
  border-radius: 25px;
  opacity: 1;
  min-width: 105px;
  height: 45px;
  font-size: 15px;
  border: none;
  font-family: Noto Sans JP;
  i,
  svg {
    font-size: 20px;
    vertical-align: middle;
  }
  span{
    font-size: 15px;
    font-weight: 500 !important;
    vertical-align: middle !important;
  }
  &:hover{
    opacity: 0.8;
  }
  &.is-disabled {
    background-color: #898989;
    color: #fff;
  }
}
</style>
