import store from '@/store';
import _ from 'lodash';

export default {
  methods: {
    redirectPage(routerTo, newTab = false) {
      if (newTab) {
        const routeData = this.$router.resolve(routerTo);
        window.open(routeData.href, '_blank');
        return true;
      }
      this.$router.push(routerTo).catch(err => {
        console.log(err);
        return err;
      });
    },
    scrollTop() {
      window.scroll({
        top: 0,
        left: 0,
        behavior: 'smooth',
      });
    },
    disableRole(value) {
      return this.checkExistArrayRole(value);
    },
    ableRole(value) {
      return this.checkExistArrayRole(value);
    },
    checkExistArrayRole(value) {
      const roles = store.getters && store.getters.roles;
      if (value && value instanceof Array && value.length > 0) {
        const requiredRoles = value;
        const hasRole = roles.some(role => {
          return requiredRoles.includes(role);
        });

        if (hasRole) {
          return true;
        }
        return false;
      } else {
        return false;
      }
    },

    buildQuery(obj) {
      const str = [];
      obj = _.pickBy(obj, function(value, key) {
        return !(value === undefined || value === null || value === '');
      });
      for (const p in obj) {
        if (obj[p] && obj.hasOwnProperty(p)) {
          if (_.isArray(obj[p])) {
            const array = obj[p];
            for (const key in array) {
              str.push(
                encodeURIComponent(p) + '=' + encodeURIComponent(array[key])
              );
            }
          } else {
            str.push(encodeURIComponent(p) + '=' + encodeURIComponent(obj[p]));
          }
        }
      }
      return str.join('&');
    },

    buildQueryCustom(obj) {
      const str = [];
      obj = _.pickBy(obj, function(value, key) {
        return !(value === undefined || value === null || value === '');
      });
      for (const p in obj){
        str.push(encodeURIComponent(p) + '=' + encodeURIComponent(obj[p]));
      }
      return str.join('&');
    },

    copyAttributes(from, to) {
      for (const key in to) {
        if (from.hasOwnProperty(key)) {
          let val = from[key];
          if (/^-?\d+$/.test(val)) {
            val = parseInt(val);
          }
          to[key] = val;
        }
      }
      return to;
    },
    covertArrStringToInt(obj) {
      var array = [];
      if (_.isArray(obj)) {
        for (const key in obj) {
          array.push(parseInt(obj[key]));
        }
      } else {
        array.push(parseInt(obj));
      }
      return array;
    },
    covertArrIntToString(obj) {
      const array = [];
      if (_.isArray(obj)) {
        for (const key in obj) {
          array.push(obj[key] + '');
        }
      } else {
        array.push(obj + '');
      }
      return array;
    },
    scrollToError() {
      const isError = document.getElementsByClassName('is-error');
      if (isError.length) {
        isError[0].scrollIntoView({
          block: 'center',
          behavior: 'smooth',
        });
        isError[0].querySelector('input,select,textarea').focus();
      }
    },
    getError(attribute, index) {
      if (this.errors !== null) {
        const key = `form.${index}.${attribute}`;
        if (this.errors[key]) {
          return this.errors[key][0];
        }
      }
      return '';
    },
    scrollTopTable() {
      document.getElementsByClassName(
        'el-table__body-wrapper'
      )[0].scrollTop = 0;
    },
    arrayContainArray(arr1, arr2) {
      const a1 = _.filter(arr1);
      const a2 = _.filter(arr2);
      return _.difference(a2, a1).length === 0;
    },
  },
};
