<template>
  <el-select v-model="selectValue" class="select-inside-table" :placeholder="placeholder">
    <el-option
      v-for="item in options"
      :key="item.value"
      :label="item.label"
      :value="item.value"
    />
  </el-select>
</template>

<script>
export default {
  name: 'Selectbox',
  props: {
    data: {
      default: null,
      type: [Array, Object, String, Number],
    },
    options: {
      type: Array,
      require: true,
      default: null,
    },
    classes: {
      type: String,
      default: '',
    },
    placeholder: {
      type: String,
      default: '',
    },
  },
  computed: {
    selectValue: {
      get() {
        return this.value;
      },
      set(value) {
        this.$emit('input', value);
      },
    },
  },
};
</script>

<style scoped>

</style>
