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
  />
</template>

<script>
export default {
  name: 'HalfSizeNumber',
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
        this.$emit('input', value.replace(/[^a-zA-Z0-9].+/, ''));
      },
    },
  },
  methods: {
    handleNumber(event) {
      if (this.inputValue !== null) {
        this.inputValue = this.inputValue.replace(/[^a-zA-Z0-9].+/, '');
      }
      if (!((event.which >= 48 && event.which <= 57) || (event.which >= 65 && event.which <= 90) ||
        (event.which >= 97 && event.which <= 122))) {
        event.preventDefault();
      }
    },
    handleChange(currentValue) {
      this.$emit('onChange', currentValue);
    },
  },
};
</script>

<style scoped>

</style>
