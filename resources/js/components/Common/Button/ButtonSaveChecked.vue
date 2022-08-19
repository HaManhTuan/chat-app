<template>
  <el-button class="button-create" v-bind="$attrs" @click="$emit('save')">
    <svg-icon icon-class="icon_checkbox" />
    <span class="text-btn">チェックした申請を承認</span>
  </el-button>
</template>

<script>
export default {
  name: 'ButtonSaveChecked',
};
</script>

<style lang="scss" scoped>
.text-btn {
  top: -2px;
  position: relative;
}
.button-create::v-deep{
  color: #FFFFFF;
  border-radius: 25px;
  height:45px;
  min-width: 236px;
  border: none;
  cursor: pointer;
  background: #C70000 0% 0% no-repeat padding-box;
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
