<template>
  <el-button :disabled="disabled" class="button-logout" :loading="loading" @click="$emit('click')">
    <span>ログアウト</span>
  </el-button>
</template>

<script>
export default {
  name: 'ButtonLogout',
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
.button-logout{
  background: #CC3A3A 0% 0% no-repeat padding-box !important;
  color: #fff;
  opacity: 1;
  font-family: Noto Sans JP;
  border: none !important;
  min-width: 55px;
  height: 34px;
  width: 118px;
  &:hover{
    opacity: 0.8;
  }
  span{
    font-size: 15px;
    font-weight: 500 !important;
    color: #fff !important;
  }
}
.button-logout:hover{
  background: #CC3A3A 0% 0% no-repeat padding-box !important;
  color: #fff;
}
</style>
