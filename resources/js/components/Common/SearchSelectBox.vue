<template>
  <el-select
    v-if="defaultOptions && defaultOptions.length"
    v-model="selectValue"
    v-loadmore="loadMore"
    v-bind="$attrs"
    :remote-method="keyword => search({ name: keyword })"
    filterable
    remote
    :clearable="clearable"
    no-data-text="データはありません。"
    @change="change"
    @focus="focus"
    @visible-change="visible"
  >
    <el-option
      v-for="item in options"
      :key="item[keyId]"
      :label="item[keyName]"
      :value="item[keyId]"
    >
      <span class="select-option">{{ item[keyName] }}</span>
    </el-option>
  </el-select>
  <el-select
    v-else
    v-model="selectValue"
    v-loadmore="loadMore"
    v-bind="$attrs"
    :clearable="clearable"
    no-data-text="データはありません。"
  >
    <el-option
      v-for="item in options"
      :key="item[keyId]"
      :label="item[keyName]"
      :value="item[keyId]"
    />
  </el-select>
</template>

<script>
import loadmore from '@/directive/selection';

export default {
  name: 'SearchSelectBox',
  directives: { loadmore },
  props: {
    value: {
      default: null,
      type: [Array, Object, String, Number],
    },
    defaultData: {
      type: Array,
      require: true,
      default: () => {
        return [];
      },
    },
    defaultValue: {
      type: Object,
      default: null,
    },
    appendQuery: {
      default: null,
      type: [Object],
    },
    keyId: {
      type: String,
      default: 'id',
    },
    keyName: {
      type: String,
      default: 'name',
    },
    searchFunction: {
      type: Function,
      required: true,
      default: () => {},
    },
    clearable: {
      type: Boolean,
      default: true,
    },
    setDefaultOneOption: {
      type: Boolean,
      default: false,
    },
    setDefaultWhenOneOption: {
      type: Boolean,
      default: false,
    },
    changeData: {
      type: Number,
      default: 1,
    },
    removeFocus: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      options: [],
      query: null,
      page: 1,
      defaultOptions: [],
    };
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
  // watch: {
  //   defaultData: {
  //     async handler(newVal) {
  //       this.options = await this.filterData(newVal);
  //       this.defaultOptions = await this.filterData(newVal);
  //     },
  //   },
  // },
  async created() {
    await this.init();
  },
  methods: {
    async init() {
      this.page = 1;
      if (this.value) {
        if (this.defaultData.length && this.defaultValue) {
          this.defaultOptions = await this.filterData(this.defaultData, this.defaultValue);
          this.options = this.defaultOptions;
        } else {
          await this.search({ id: this.value, page: this.page });
          this.defaultOptions = this.options;
        }
      } else {
        if (this.defaultData.length) {
          this.defaultOptions = await this.filterData(this.defaultData, this.defaultValue);
          this.options = this.defaultOptions;
        } else {
          await this.search({ name: null, page: this.page });
          this.defaultOptions = this.options;
          if (this.defaultOptions.length && this.setDefaultOneOption) {
            this.selectValue = this.options[0][this.keyId];
            return this.$emit('onDefault', this.options[0][this.keyId]);
          }
        }
        if (this.setDefaultWhenOneOption && this.options.length === 1) {
          this.selectValue = this.options[0][this.keyId];
          return this.$emit('onDefault', this.options[0][this.keyId]);
        }
      }
    },
    async search(query = null) {
      this.loading = true;
      this.query = query;
      this.page = 1;
      const res = await this.searchFunction({ ...query, ...this.appendQuery });
      this.options = res.data;
      if (res.current_page >= res.last_page) {
        this.page = 0;
      }
      this.loading = false;
    },
    async loadMore() {
      if (this.page) {
        this.page = this.page + 1;
        const res = await this.searchFunction(_.merge({
          name: this.query ? this.query.name : '',
          not_id: this.value,
          page: this.page,
        }, this.appendQuery));
        this.options = this.filterData(this.options.concat(res.data));
        if (res.current_page >= res.last_page) {
          this.page = 0;
        }
      }
    },
    change(currentValue) {
      this.focus();
      const object = this.options.find(o => o[this.keyId] === currentValue && o[this.keyName]);
      this.$emit('onChange', currentValue, object);
    },
    focus() {
      this.$nextTick(() => {
        if (!this.removeFocus) {
          this.options = this.filterData(this.defaultOptions);
          this.page = 1;
          this.query = null;
        }
      });
    },
    visible(show) {
      this.$emit('visibleChange', show);
      if (show) {
        this.focus();
      }
    },
    filterData(options, defaultValue = null) {
      if (_.isEmpty(defaultValue) || !defaultValue[this.keyId] || !defaultValue[this.keyName]) {
        return _.unionBy(options, this.keyId);
      }
      if (_.isEmpty(options)) {
        options = [];
      }
      return _.unionBy(options, [defaultValue], this.keyId);
    },
  },
};
</script>

<style scoped lang="scss">
/deep/.el-select-dropdown {
  left: 0 !important;
}
</style>
