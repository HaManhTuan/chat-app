<template>
  <el-button
    class="search-btn"
    :loading="loading"
    :disabled="disabled"
    @click="$emit('search')"
  >
    <svg-icon icon-class="_search_w" />
    検索
  </el-button>
</template>

<script>
export default {
  name: 'ButtonSearch',
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
button.el-button.search-btn {
  background: #1467b3 0% 0% no-repeat padding-box;
  border-radius: 25px;
  border: 0px;
  color: #fff;
  font-size: 15px;
  font-weight: 500 !important;
  padding-left: 20px;
  padding-right: 20px;
  width: 105px;
  height: 45px;
  border: none;
  font-family: Noto Sans JP;
  &:hover {
    opacity: 80%;
  }
  .svg-icon {
    height: 17px;
    width: 17px;
  }
}
</style>
