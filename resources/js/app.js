import '@/styles/index.scss';
import 'core-js';
import Vue from 'vue';
import Cookies from 'js-cookie';
import ElementUI from 'element-ui';
import App from './views/App';
import store from './store';
import router from '@/router';
import i18n from './lang'; // Internationalization
import '@/icons'; // icon
import '@/permission'; // permission control
import VueMeta from 'vue-meta';
import * as filters from './filters'; // global filters
import './mixins/mixin';
import _ from 'lodash';
import CommonSettings from './const/CommonSettings';
import ja from './lang/elementUI/ja';

Vue.use(ElementUI, {
  size: Cookies.get('size') || 'medium', // set element-ui default size
  locale: ja,
});

// register global utility filters.
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key]);
});
Vue.use(VueMeta, {
  // optional pluginOptions
  refreshOnceOnNavigation: true,
});
Vue.mixin({
  data() {
    return { 'CommonTxt': CommonSettings.COMMON_TXT, popperMaxRecord: CommonSettings.POPPER_MAX_RECORD };
  },
  methods: {
    injectFormValidates(errResponse) {
      if (errResponse.status === 422) {
        const errorDatas = errResponse.data.errors;
        for (let i = 0; i < this.fields.length; i++) {
          const field = this.fields[i].prop;
          if (errorDatas[field] !== undefined) {
            this.fields[i].validateMessage = errorDatas[field][0];
            this.fields[i].validateState = 'error';
          }
        }
      }
    },
    createDownloadXlsFile(fileName, data) {
      const filename = fileName + '' + moment(new Date()).format('YYYYMMDDHHmmss') + '.xlsx';
      const url = window.URL.createObjectURL(new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
    },
    focusFieldError() {
      this.fields.every(item => {
        if (item.validateState === 'error') {
          // item.$children[1].$el.querySelector('input,select,textarea').focus();
          item.$children[1].$el.scrollIntoView({
            block: 'center',
          });
          return false;
        }
        return true;
      });
    },
  },
});
Vue.config.productionTip = false;
Object.defineProperty(Vue.prototype, '$_', { value: _ });
new Vue({
  el: '#app',
  router,
  store,
  i18n,
  render: h => h(App),
});
