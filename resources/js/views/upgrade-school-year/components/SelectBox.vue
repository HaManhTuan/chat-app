<template>
  <el-select
    v-model="selectValue"
    :class="textClass"
    :filterable="filterable"
    :clearable="clearable"
    :multiple="multiple"
    :placeholder="placeholder"
    :popper-class="popperClass"
    loading-text="データなし"
    :no-match-text="CommonTxt.selectboxEmptyTxt"
    :no-data-text="CommonTxt.selectboxEmptyTxt"
    :disabled="disabled"
    @change="change"
  >
    <el-option
      v-for="item in options"
      :key="item[keyValue]"
      :label="item[keyLabel]"
      :value="item[keyValue]"
    />
  </el-select>
</template>

<script>
import { autoSelectSize } from '@/mixins/autoSelectSize';

export default {
  name: 'SelectBox',
  mixins: [autoSelectSize],
  props: {
    value: {
      type: [Array, Object, String, Number],
      default: null,
    },
    options: {
      type: Array,
      require: true,
      default: null,
    },
    row: {
      type: [Array, Object, String, Number],
      default: null,
    },
    className: {
      type: String,
      default: '',
    },
    popperClass: {
      type: String,
      default: '',
    },
    placeholder: {
      type: String,
      default: '',
    },
    filterable: {
      type: Boolean,
      default: false,
    },
    clearable: {
      type: Boolean,
      default: false,
    },
    multiple: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    keyLabel: {
      type: String,
      default: 'label',
    },
    keyValue: {
      type: String,
      default: 'value',
    },
    autoSize: {
      type: Boolean,
      default: false,
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
    textClass: {
      get() {
        if (this.autoSize === false) {
          return this.className;
        } else {
          return (
            this.getClass(
              this.selectValue,
              this.options,
              this.keyValue,
              this.keyLabel
            ) + this.className
          );
        }
      },
    },
  },
  methods: {
    change(currentValue) {
      if (currentValue !== '') {
        const object = this.options.find(
          o => o[this.keyValue] === currentValue
        );
        this.$emit('onChange', currentValue, object, this.row);
      } else {
        this.$emit('onChange', null, null, this.row);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
//
</style>
