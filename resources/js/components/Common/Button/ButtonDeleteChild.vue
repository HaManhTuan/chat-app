<template>
  <el-button class="button-action" :loading="loading" @click="$emit('delete')">
    <svg-icon icon-class="_trash" />
  </el-button>
</template>

<script>
export default {
  name: 'ButtonDeleteChild',
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
.button-action{
  font-size: 12.22px;
  background-color: #f4f8fd;
  border-color: #f4f8fd;
  width:30px;
  height: 30px;
  margin-left: -10px;
  &:hover{
    opacity: 0.8;
  }
}
</style>
