<template>
  <el-button class="button-cancel" @click="$emit('cancel')">
    <svg-icon icon-class="_cancel" />
    <span>{{ name }}</span>
  </el-button>
</template>

<script>
export default {
  name: 'ButtonCancel',
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
      default: 'キャンセル',
    },
  },
};
</script>

<style lang="scss" scoped>
.button-cancel{
  color: #fff;
  background: #6A6A6A 0% 0% no-repeat padding-box;
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
    color: #fff;
    background: #6A6A6A;
  }
  // &.is-disabled {
  //   background-color: #898989;
  //   color: #fff;
  // }
}
</style>
