<template>
  <el-button class="button-create" @click="$emit('create')">
    <svg-icon icon-class="_add" />
    <span>新規作成</span>
  </el-button>
</template>

<script>
export default {
  name: 'ButtonCreate',
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
.button-create::v-deep{
  color: #FFFFFF;
  border-radius: 25px;
  height:45px;
  width: 129px;
  border: none;
  cursor: pointer;
  background: #1467B3 0% 0% no-repeat padding-box;
  &:hover{
    opacity: 0.8;
  }
  svg {
    margin-right: 10px;
    width: 19px!important;
    height: 19px!important;
  }
  span{
    font-size:15px;
    font-weight: 500 !important;
  }
  .el-icon-circle-plus-outline{
    font-weight: 500;
    font-size: 20px;
    vertical-align: middle;
  }

}
</style>
