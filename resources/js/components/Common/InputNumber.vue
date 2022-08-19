<template>
  <el-input
    v-model="inputValue"
    v-bind="$attrs"
    :maxlength="maxlength"
    :clearable="clearable"
    @keypress.native="handleNumber"
    @blur.native="handleNumber"
    @keyup.native="handleNumber"
    @change.native="handleChange"
    @clear="handleClear"
  />
</template>

<script>
export default {
  name: 'InputNumber',
  props: {
    value: {
      default: null,
      type: [Array, Object, String, Number],
    },
    maxlength: {
      type: Number,
      default: null,
    },
    clearable: {
      type: Boolean,
      default: true,
    },
  },
  computed: {
    inputValue: {
      get() {
        return this.value;
      },
      set(value) {
        this.$emit('input', value.replace(/[^\d].+/, ''));
      },
    },
  },
  methods: {
    handleNumber(event) {
      if (this.inputValue !== null) {
        this.inputValue = this.inputValue.replace(/[^\d].+/, '');
      }
      if ((event.which < 48 || event.which > 57)) {
        event.preventDefault();
      }
    },
    handleChange(currentValue) {
      this.$emit('onChange', currentValue);
    },
    handleClear(){
      this.$emit('onClear');
    },
  },
};
</script>

<style scoped>

</style>
