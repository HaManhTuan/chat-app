<template>
  <el-button class="button-add-org" icon="el-icon-circle-plus" @click="$emit('create')">
    所属組織を追加
  </el-button>
</template>

<script>
export default {
  name: 'ButtonAddOrganization',
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
.button-add-org::v-deep{
  color: #1A1714;
  border-radius: 25px;
  border: 1px solid #D6D6D6;
  height:43px;
  width: 100%;
  cursor: pointer;
  background: #F8F8F8 0% 0% no-repeat padding-box;
  &:hover{
    opacity: 0.8;
  }
  span{
    font-size:15px;
    font-weight: 500;
    margin-right: 10px;
    line-height: 21px;
    vertical-align: middle;
    margin-left: 2px;
  }
  .el-icon-circle-plus{
    color: #1467B3;
    font-size: 22px;
    vertical-align: middle;
  }

}
</style>
