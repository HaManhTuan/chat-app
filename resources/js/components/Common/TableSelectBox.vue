<template>
  <el-select
    v-model="selectValue"
    v-bind="$attrs"
    :class="getClassName()"
    class=" "
    no-data-text="データはありません。"
    filterable
    popper-class="select-inside-table"
    @change="onChange"
  >
    <el-option
      v-for="item in computedOption"
      :key="item[keyId]"
      :label="item[keyName]"
      :value="item[keyId]"
    />
  </el-select>
</template>

<script>
import { autoSelectSize } from '@/mixins/autoSelectSize';

export default {
  name: 'TableSelectBox',
  mixins: [
    autoSelectSize,
  ],
  props: {
    value: {
      default: null,
      type: [Array, Object, String, Number],
    },
    defaultObject: {
      default: null,
      type: [Object],
    },
    options: {
      type: Array,
      require: true,
      default: null,
    },
    keyId: {
      type: String,
      default: 'id',
    },
    keyName: {
      type: String,
      default: 'name',
    },
    autoFont: {
      type: Boolean,
      default: true,
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
    computedOption: {
      get() {
        const options = _.clone(this.options);
        if (this.defaultObject && options.length) {
          const id = this.defaultObject[this.keyId];
          const keyId = this.keyId;
          const exist = _.find(options, (item) => {
            return item[keyId] === id;
          });
          if (!exist && Array.isArray(options)) {
            options.unshift(this.defaultObject);
          }
        } else if (this.defaultObject && !options.length) {
          return [this.defaultObject];
        } else if (!this.defaultObject && !options.length) {
          return [];
        }
        if (options.length === 1 && !options[0]) {
          return [];
        }
        return _.unionBy(options, this.keyId);
      },
    },
  },
  methods: {
    getClassName() {
      if (this.autoFont) {
        return this.getClass(this.selectValue, this.computedOption, this.keyId, this.keyName);
      }
      return '';
    },
    async onChange() {
      await this.$emit('change');
    },
  },
};
</script>

<style scoped>

</style>
