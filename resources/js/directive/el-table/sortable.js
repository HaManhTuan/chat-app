const sortable = {
  bind(el, binding) {
    el.innerHTML = '<span class="caret-wrapper"><i class="sort-caret ascending"></i><i class="sort-caret descending"></i></span>';
    let count = 0;
    el.addEventListener('click', function() {
      const mod = ++count % 3;
      let sort = '';
      if (mod === 1) {
        sort = 'DESC';
        el.innerHTML = '<span class="caret-wrapper"><i class="sort-caret ascending"></i><i class="sort-caret descending" style="border-top-color: #004b9e;"></i></span>';
      } else if (mod === 2){
        sort = 'ASC';
        el.innerHTML = '<span class="caret-wrapper"><i class="sort-caret ascending" style="border-bottom-color: #004b9e;" ></i><i class="sort-caret descending"></i></span>';
      } else {
        el.innerHTML = '<span class="caret-wrapper"><i class="sort-caret ascending"></i><i class="sort-caret descending"></i></span>';
      }
      binding.value(sort);
    });
  },
};

const install = function(Vue) {
  Vue.directive('sortable', sortable);
};

if (window.Vue) {
  window.sortable = sortable;
  Vue.use(install); // eslint-disable-line
}

sortable.install = install;
export default sortable;
